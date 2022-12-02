<script>
    import {StoreController} from '../controller/storeController'
    import ResultPage from '../components/ResultPage.svelte'
    let storeCotroller = new StoreController()
    let favorites = storeCotroller.getListFavorites()
    let detailContent = {
        id : "",
        data : "",

        show : false
    }
    
    const handleGetDetail = (kk) => {
        detailContent.id = kk
        detailContent.show = true
    }

    const handleClose = (e) => {
        detailContent.show = e.detail.show
        favorites = storeCotroller.getListFavorites()
    }

</script>

{#if detailContent.show}
    <ResultPage {...detailContent}  on:close={(e) => handleClose(e)}/>
{/if}
<div class="h-[90vh] overflow-y-auto disable-scrollbars py-2 pb-4 space-y-2">
    
    {#each favorites as fav}
    <div class="p-4 shadow-lg rounded-md bg-base-300 text-base-content flex-col" on:click={() => handleGetDetail(fav.id, fav.source.code, fav.target.code)} >
        <div class="flex w-full mb-2" >
            <div class="flex space-x-1 items-center">
                <img class="h-5 w-5 object-cover rounded-full border-base-content border-2" src={`icons/${fav.source.flag}`} alt={fav.source.alt}>
                <span class="text-base-content text-xs">{fav.source.text}</span>
            </div>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mx-2 h-6 w-6 text-base-content"><path d="M3 12h18m-3 3 3-3-3-3" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            <div class="flex space-x-1 items-center ">
                <img class="h-5 w-5 object-cover rounded-full border-base-content border-2" src={`icons/${fav.target.flag}`} alt={fav.target.alt}>
                <span class="text-base-content text-xs">{fav.target.text}</span>
            </div>
        </div>
        <p class=" truncate w-full text-base-content">{fav.parsedText}</p>
        <p class=" truncate w-full text-base-content">{fav.translate}</p>
    </div>
    {:else}
    <div class="flex h-full w-full justify-center items-center flex-col">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-base-content text-opacity-40" viewBox="0 0 24 24">
            <path d="M18.95 20.5h.1" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2.6"/><path d="M19 16v-3" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path d="M19 9V7l-4-4H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8" data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/>
        </svg>
        <p class="text-base-content text-opacity-40 font-semibold">Belum ada terjemahan favorit!</p>
    </div>
    
    {/each}
</div>


