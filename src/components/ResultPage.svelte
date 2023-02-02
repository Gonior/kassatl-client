<script>
    import {fly} from 'svelte/transition'
    import {createEventDispatcher, onMount} from 'svelte'
    import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
    import {fade} from 'svelte/transition'
    import {SyncLoader} from 'svelte-loading-spinners'
    import {TranslateModel} from '../models/translateModel'
    import {StoreController} from '../controller/storeController'
    export let show = false
    export let data
    export let source
    export let target
    export let id = ""
    export let entryMode = false


    let isLoading = true,
        state = "",
        theme = "",
        err = {},
        textarea,
        translateModel = new TranslateModel(),
        storeController = new StoreController(),
        translate = {
            parsedText : "",
            translate : "",
            romanji : ""
        },
        oldText,
        isLoadingRefresh = false,
        furigana = true,
        heightContent =0,
        showAlert = {
            open : false,
            message : false
        }
        
    const progress = tweened(0, {
		duration: 100,
		easing: cubicOut
	});
    $: favorite = id !== ""
    const dispatch = createEventDispatcher()

    onMount( async () => {
        window.history.pushState({id :1},null,null)
        window.addEventListener('popstate', (e) => {
            e.preventDefault()
            handleClose()
        })
        theme = document.getElementsByTagName('html')[0].getAttribute('data-theme')
        // console.log({source,target})
        if (entryMode) { 
            isLoading = false
            furigana = true
            oldText = ""

            translate.parsedText = ""
            translate.translate = ""
            translate.romanji = ""

        } else if (id !== "") {
            translate = storeController.getDetailFavorites(id)
            source = translate.source.code
            target = translate.target.code
            isLoading = false
        } else await handleScan(data)
    })
    const handleClose = () => {
        dispatch('close', {show : false})
    }

    const handleScan = async (data) => {
        const config = {
            onUploadProgress : progressEvent => {
                if (progressEvent.loaded === progressEvent.total) state = "Sedang memproses"
                else state = "Mengunggah"
                progress.set(progressEvent.loaded/progressEvent.total*100)
            }
        }
        // console.log({source,target})
        await translateModel.getTranslate(data,source,target,config,'upload')
        translate = translateModel.getProperty()
        err = {...translateModel.getError()}
        oldText = translate.parsedText

        isLoading = false
    }

    const addRemoveToFavorite = () => {
        if (!favorite) {
            //add to favorite and return id
            translate.source = source
            translate.target = target
            id = storeController.addListFavorites(translate)
            handleShowAlert('Berhasil ditambahkan ke Favorit!')
            // console.log(storeController.getListFavorites())
        }
        else {
            storeController.getDetailFavorites(id)
            storeController.updateListFavorites(id)
            id = ""
            handleShowAlert('Berhasil dihapus dari Favorit!')
        }
    }

    const handleCopy = (text) => {
        storeController.copyToClipboard(text, () => handleShowAlert('teks berhasil disalin'))
    }

    const handleRefresh = async () => {
        isLoadingRefresh = true
        await translateModel.getTranslate(translate.parsedText,source,target,function(){}, 'translate')
        translate = translateModel.getProperty()
        err = {...translateModel.getError()}
        oldText = translate.parsedText
        isLoadingRefresh = false
    }

    const handleShowAlert = (message) => {
        showAlert.open = true
        showAlert.message = message
        setTimeout(() => {
            showAlert.open = false
            showAlert.message = ""
        },2000)
    }

    const furiganaMode = () => {
        furigana = !furigana
        
    }
    
    function textAreaAdjust(element) {
		
        element.style.height = "1px";
        
        element.style.height = (25+element.scrollHeight)+"px";
    }

</script>

{#if show}
<div class="absolute inset-0 z-20 flex bg-base-100 bg-opacity-80 justify-center items-center ">
    <div in:fly={{y :200 , duration : 200}} class="flex flex-col transition-all duration-500 ease-in-out {isLoading || err.isError ? 'min-h-max max-h-80 h-1/4 min-w-max w-1/2 max-w-md p-4 bg-base-200 rounded-lg items-center justify-center' : "max-w-md w-full mx-auto h-full bg-base-100"} ">
        <!-- <div class="alert alert-error shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Error! Task failed successfully.</span>
            </div>
          </div> -->
        {#if isLoading}
            <SyncLoader color="#5B31CE" size="5" unit="rem" />
            <span class="text-base-content text-opacity-80 capitalize">{state}</span>
            <progress class="progress progress-primary w-56" value="{$progress}" max="100"></progress>
            <span class="text-base-content text-opacity-80 capitalize">{Math.round($progress)}%</span>
        {:else if err.isError}
        
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-24 w-24 text-error text-opacity-80" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm1-5a1 1 0 0 1-2 0V7a1 1 0 0 1 2 0Z"/></svg>
            <h1 class="font-bold text-xl text-base-content">Gagal Menerjemahkan</h1>
            <span class="text-base-content text-center max-w-xs text-opacity-80 capitalize">{err.message}</span>
            <button class="text-base-content btn btn-ghost btn-sm " on:click={() => handleClose()}>Tutup</button>
            
        {:else}
        <div class="flex items-center justify-between p-2">
            <div class="flex items-center space-x-2">
                <button class="btn btn-circle  border-0 btn-ghost text-base-content" on:click={() => handleClose()}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 class="text-xl font-semibold tracking-tighter font-sans text-base-content">Hasil Terjemahan</h1>
            </div>
            <div class="flex space-x-1 items-center">
                {#if oldText !== translate.parsedText}
                    <button class="btn btn-circle btn-ghost text-base-content border-0 {isLoadingRefresh ? 'loading' : ''}" on:click={() => handleRefresh()} >
                        {#if !isLoadingRefresh}
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24"><path d="m12 16 2 2-2 2" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path d="M6 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10M12 8l-2-2 2-2" data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path d="M18 18h2a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H10" data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
                        {:else}{''}
                        {/if}
                    </button>
                {/if}
                <button class="btn btn-circle btn-ghost border-0 text-warning {favorite ? 'fill-warning' : 'fill-transparent'}" on:click={() => addRemoveToFavorite()}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-10">
            <div class="flex items-center justify-between py-4">
                <h3 class="font-bold text-base-content ">{source === 'ja' ? 'Jepang' : "Indonesia"}</h3>
                <div class="flex space-x-1 items-center">
                    {#if source === "ja"}
                        <button class="btn btn-ghost rounded-lg text-base-content btn-xs lowercase" on:click={() => furiganaMode()}>{furigana ? "raw": "furigana"}</button>
                    {/if}
                    
                    <button class="btn btn-circle border-0 text-base-content btn-ghost" on:click={() => handleCopy(translate.parsedText)}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="text-base-content pb-10">
                {#if source === 'ja'}
                    {#if furigana}
                    <p class="text-base-content whitespace-pre-line" >{@html translate.furigana}</p>
                    {:else}
                    <textarea class="focus:outline-none focus:border-0 text-base-content bg-transparent resize-none w-full h-[20vh]" on:keyup={() => textAreaAdjust(textarea)} bind:value={translate.parsedText} bind:this={textarea}></textarea>
                    {/if}
                    <p class="text-base-content my-2 text-xs font-semibold">{translate.romanji}</p>
                {:else}
                {#if entryMode}
                    <textarea placeholder="Masukan text yang akan diterjemahkan" class="focus:outline-none focus:border-0 text-base-content bg-transparent resize-none w-full h-[20vh]" on:keyup={() => textAreaAdjust(textarea)} bind:value={translate.parsedText} bind:this={textarea}></textarea>
                {:else}
                <textarea placeholder="Masukan text yang akan diterjemahkan" class="focus:outline-none focus:border-0 text-base-content bg-transparent resize-none w-full h-[20vh]" on:keyup={() => textAreaAdjust(textarea)} bind:value={translate.parsedText} bind:this={textarea}></textarea>
                    <!-- <p class="text-base-content">{translate.parsedText}</p> -->
                {/if}

                {/if}
            </div>
            <div class="flex w-full justify-center">
                <hr class="w-1/2 border-blue-900 dark:border-accent" />
            </div>
            <div class="flex items-center justify-between py-4 text-accent">
                <h3 class="font-bold text-base-content">{target === 'id' ? 'Indonesia' : "Jepang"}</h3>
                <button class="btn btn-circle border-0 btn-ghost fill-transparent text-base-content" on:click={() => handleCopy(translate.translate)}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </button>
            </div>
            <p class="text-base-content whitespace-pre-line">{translate.translate}</p>
            {#if source !== 'ja'}
            <p class="text-base-content my-2 text-xs font-semibold">{translate.romanji}</p>
            {/if}
        </div>
        {/if}
        {#if showAlert.open}
        <div in:fade={{duration : 200}} out:fade={{duration : 200}} class="absolute z-10 left-0 right-0 bottom-10">
            <div class="alert shadow-lg alert-success w-max mx-auto">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{showAlert.message}</span>
                </div>
            </div>
        </div>
        {/if}
        
    </div>
</div>
{/if}

<!-- <button on:click={() => handleClose()} class="w-1/2 btn btn-primary btn-sm block rounded-full">Oke</button> -->