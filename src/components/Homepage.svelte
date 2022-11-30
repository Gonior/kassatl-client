<script>
    import fx from 'glfx-es6'
	import RangeSlider from "svelte-range-slider-pips";
	import Crop from './Crop.svelte'
    import {fly, slide} from "svelte/transition"
    import {clickOutside} from '../lib/clickOutside'
    import SkeletonModal from './SkeletonModal.svelte'
    import ResultPage from './ResultPage.svelte'
    import {onMount} from 'svelte'
    import {SUPPORT_CAMERA} from '../lib/store' 
    import { CameraController } from '../controller/cameraController';
    
    let showImage = false, 
        openEditEffect = false, 
        fileinput,
        video, 
        crop = {openCrop : false, img: ""}, 
        stream, 
        canvasfx, 
        texture,
        effect = {
            brightness : 0,
            contrast : 0,
            radius : 10,
            strength : 0
	    },
        error = {
            show : false,
            message : "",
            cause : ""
        },
        modal = {
            show : false,
            title : "",
            content : ""
        },
        isLoading = false,
        showErrorToLarge = false,
        result = {
            data : null,
            show : false
        },
        cameraController = new CameraController()

    onMount(async () => {
        initCanvas(true)
		if ($SUPPORT_CAMERA.support) {
			await startVideo(true)
            error.show = false
        } else {
            if ($SUPPORT_CAMERA.support !== true) handleError("Perangkat anda tidak mendukung kamera.", "support")
            else handleError('Akses kamera ditolak', "permission")
        }
		
  	});

    const handleError = (msg, cause) => {
        error.show = true
        error.message = msg
        error.cause = cause
    }

    const handleCrop =  (e) => {
		crop.openCrop = e.detail.openCrop
		setTimeout(async () => {
			texture = canvasfx.texture(e.detail.img)
			canvasfx.draw(texture).update()
			canvasfx.className="object-scale-down max-w-full rounded-lg"
			video.parentNode.insertBefore(canvasfx, video)
			showImage = true
			cameraController.stopVideo(stream)
		}, 200);
	}

    const changeEffect = (value, type) => {

        if (type === "brightness") effect.brightness = value
        else if (type==="contrast") effect.contrast = value
        else if (type=== "radius") effect.radius = value
        else effect.strength = value

        canvasfx.draw(texture).brightnessContrast(effect.brightness, effect.contrast)
            .unsharpMask(effect.radius, effect.strength).update()

    }
    const resetEffect = () => {
        effect = {contrast : 0, brightness :0, strength : 0, radius :10}
        canvasfx.draw(texture).brightnessContrast(effect.brightness, effect.contrast)
            .unsharpMask(effect.radius, effect.strength).update()	
    }

    const takeaPicture = async () => {
        let canvas
        await initFx()
    }

    const startCrop = async () => {
        canvasfx.update()
        crop.img = await canvasfx.toDataURL("image/jpeg")
        crop.openCrop = true
    }
    const onFileSelected =(e)=>{
        let fileSize = e.target.files[0].size /1024/1024
        if (fileSize <= 1) {
            let file = e.target.files[0]
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                let image = new Image()
                image.onload = async function() {
                    // canvas.getContext('2d').drawImage(image,0,0)
                    texture = canvasfx.texture(image)
                    canvasfx.draw(texture).update()
                    canvasfx.className="object-scale-down rounded-lg max-w-full"
                    video.parentNode.insertBefore(canvasfx, video)
                    showImage = true
                    cameraController.stopVideo(stream)
                }
                image.src = e.target.result
            };
        } else {
            //do something with this error
            showErrorToLarge = true
            setTimeout(() => {
                showErrorToLarge = false
            },3000)
        }
    }


    const scanDoc = async () => {
		canvasfx.update()
		result.data = await canvasfx.toDataURL("image/jpeg")
        result.show = true
	}

    const startVideo = async (first) => {
		
        if ($SUPPORT_CAMERA.support) {
            video.srcObject = await cameraController.startVideo()
            initCanvas(first)
        } else initCanvas(false)

		showImage = false
		openEditEffect = false
	}

    const initCanvas = (first) => {
        first ? canvasfx = fx.canvas() : video.parentNode.removeChild(canvasfx)
    }

    const initFx = async (element) => {
		canvasfx.className = "object-scale-down rounded-lg max-w-full"
		texture = canvasfx.texture(element)
		canvasfx.draw(texture).update()
		video.parentNode.insertBefore(canvasfx, video)
		showImage = true
		cameraController.stopVideo(stream)
	}

    const handleShowModal = async (type) => {
        modal.show = true
        if (type === "grantAccess") {
            modal.title = "Beri Akses Kamera"
            modal.content = `
            <div class="flex flex-col px-6">
                <ol class="list-decimal">
                    <li>Di Ponsel, buka aplikasi setelan (Setting Apps)</li>
                    <li>Ketuk <strong>Aplikasi</strong></li>
                    <li>Cari dan pilih <strong>JXI Penerjemah</strong>(Jika tidak menemukannya, pilih <strong>Lihat semua aplikasi.</strong>)</li>
                    <li>Ketuk <strong>Izin</strong></li>
                    <li>Pilih <strong>Kamera</strong> > <strong>Izinkan saat aplikasi digunakan</strong> </li>
                    <li>Buka Aplikasi <strong>JIX Penerjemah</strong></li>
                    <li>Selesai.</li>
                </ol>
            </div>
            `
        } else {
            
            modal.title = "Ambil Gambar"
            modal.content = `
                <div class="h-1/2 flex flex-col items-center justify-center p-4">
                    <img class="object-scale-down rounded-3xl mb-2"  src="https://res.cloudinary.com/djvghywq0/image/upload/c_scale,h_1319/v1646213980/20220302_163538_shx7rv.jpg" alt="..."/>
                    <p class="text-base-content text-opacity-80 text-xs">Contoh pengambilan gambar.</p>
                </div>
            `
        }
    }
</script>

<div class="h-[80vh]">
    {#if crop.openCrop}
        <Crop {...crop}  on:close={(e) => crop.openCrop = e.detail.openCrop} on:done={handleCrop}/>
    {/if}
    {#if modal.show}
        <SkeletonModal show={modal.show} title={modal.title} on:close={(e) => modal.show = e.detail.show}>
            {@html modal.content}
        </SkeletonModal>
    {/if}
    {#if showErrorToLarge}
    <div in:fly={{y :-200 , duration : 200}} out:fly={{y :-200 , duration : 200}} class="absolute z-10 left-0 right-0 top-20">
        <div class="alert shadow-lg alert-error w-max mx-auto">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>Ukuran gambar harus kurang dari 1MB.</span>
            </div>
        </div>
    </div>
    {/if}
    {#if result.show}
        <ResultPage show={result.show} data={result.data} on:close={(e) => result.show = e.detail.show}/>
    {/if}
    <div class="h-[75vh] flex items-center justify-center max-w-full w-full relative">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video class="{showImage || error.show ? 'hidden' : ''} object-scale-down rounded-lg max-w-full" bind:this={video} autoplay></video>
        {#if error.show}
            <div class="flex flex-col items-center space-y-2 h-full w-full justify-center {showImage ? 'hidden' : ''}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-24 w-24 text-base-content text-opacity-80" ><path d="M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Zm-9-5v6M12.05 17h-.1" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
                <p class="text-base-content">{error.message}</p>
                {#if error.cause === "permission"}
                    <button on:click="{() => handleShowModal('grantAccess')}" class="btn btn-sm btn-primary">beri akses kamera</button>
                {/if}
            </div>
        {/if}
        {#if showImage && openEditEffect}
        <div use:clickOutside on:click_outside={() => openEditEffect = false} transition:slide|local={{duration : 200}} class="flex flex-col absolute bottom-0 rounded-b-lg inset-x-0 bg-gray-800 bg-opacity-40 p-2 mx-2w-full ">
            <div class="flex flex-col">
                <p class="text-xs text-gray-100">Kecerahan</p>
                <RangeSlider min={-0.8} max={0.8} float={true} values={[effect.brightness]} step="{0.05}" on:change={(e) => changeEffect(e.detail.value, "brightness")} />
            </div>
            <div class="flex flex-col">
                <p class="text-xs text-gray-100">Kontras</p>
                <RangeSlider min={-0.8} max={0.8} float={true} values={[effect.contrast]} step="{0.05}" on:change={(e) =>  changeEffect(e.detail.value, "contrast")} />
            </div>
            <div class="flex flex-col">
                <p class="text-xs text-gray-100">Radius (Ketajaman)</p>
                <RangeSlider min={0} max={100} float={true} values={[effect.radius]} step="{1}" on:change={(e) =>  changeEffect(e.detail.value, "radius")} />
            </div>
            <div class="flex flex-col">
                <p class="text-xs text-gray-100">Strengh (Ketajaman)</p>
                <RangeSlider min={0} max={5} float={true} values={[effect.strength]} step="{0.05}" on:change={(e) =>  changeEffect(e.detail.value, "strength")} />
            </div>
            <button on:click={() => resetEffect()} class="text-center text-gray-100 w-full">reset</button>
        </div>
        {/if}
    </div>
    <div class="h-[5vh] mt-1 flex justify-center items-center text-base-content" transition:slide|local={{duration : 200}}>
        {#if showImage}
        <div class="flex-1 flex  justify-center items-center">
            <button class="btn btn-xs btn-ghost btn-square" on:click="{() => openEditEffect = !openEditEffect}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
            </button>
        </div>
        <div class="flex-1 flex justify-center items-center" on:click="{() => startCrop()}">
            <button class="btn btn-xs btn-ghost btn-square ">
                <svg viewBox="331.725 20.247 21.853 22.492" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg"><path d="M3 7V4a1 1 0 0 1 1-1h3" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" transform="translate(329.784989 18.425963)"/><path data-name="primary" d="M352.417 25.97v-3.408c0-.627-.489-1.136-1.091-1.136h-3.272m-15.269 15.903v3.408c0 .628.488 1.136 1.091 1.136h3.272m15.269-4.544v3.408c0 .628-.489 1.136-1.091 1.136h-3.272" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            </button>
        </div>
        {:else} 
        <h1 class="text-xs text-gray-400 text-center w-full {!$SUPPORT_CAMERA.permission ? 'hidden' : ''}">Ambil gambar yang mengadung Bahasa Jepang</h1>
        {/if}
    </div>
</div>
<div class="w-full flex items-center {showImage ? 'justify-between space-x-2':'justify-around'} h-[10vh]">
{#if !showImage}
    <button on:click="{() => handleShowModal("example")}" in:fly={{y:200 ,duration : 300}}  class="btn btn-ghost btn-sm btn-square text-base-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M12.05 8h-.1M3 12a9 9 0 0 1 9-9h0a9 9 0 0 1 9 9h0a9 9 0 0 1-9 9h0a9 9 0 0 1-9-9Zm9 1v3"/></svg>
    </button>
    <button disabled={!$SUPPORT_CAMERA.support} in:fly={{y:200 ,duration : 300}} class="btn btn-circle shadow btn-primary btn-lg" on:click="{() => takeaPicture()}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-10 w-10"><path d="M21 7v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4l.72-1.45a1 1 0 0 1 .9-.55h4.76a1 1 0 0 1 .9.55L16 6h4a1 1 0 0 1 1 1Zm-9 3a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
    </button>
    <button on:click="{fileinput.click()}" in:fly={{y:200 ,duration : 300}} class="btn btn-ghost btn-sm btn-square text-base-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6" ><path d="M5 20h15a1 1 0 0 0 1-1V8" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path data-name="primary" d="M11.24 12.17 7.41 16H4a1 1 0 0 1-1-1v-1.56l4.76-4.76Zm2.84-2.84L7.41 16H16a1 1 0 0 0 1-1v-2.74ZM4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
    </button>
    <input style="display:none" type="file" max-size="1000" max-files="1" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
{:else}
    <button in:fly={{y:200 ,duration : 300}} class="flex-1 btn btn-ghost text-base-content" on:click="{async () => await startVideo(false)}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path d="M7 17.29A8 8 0 1 0 5.06 11" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/><path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m3 6 2 5 5-2"/></svg>
    </button>
    <button in:fly={{y:200 ,duration : 300}} class="flex-1 btn btn-primary gap-2" on:click="{() => scanDoc()}">
        Pindai
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    </button>
{/if}
</div>