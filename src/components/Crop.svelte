<script>
    import {CROP_STATE, ImageCrop} from "@novacbn/svelte-image-crop";
    import { onMount, createEventDispatcher } from "svelte";
    import {fly} from "svelte/transition"
    export let openCrop
    export let img
    const dispatch = createEventDispatcher()
    onMount(() => {
        window.history.pushState({id :1},null,null)
        window.addEventListener('popstate', (e) => {
            e.preventDefault()
            back()
        })
    })
    
    // `blob` — will carry the current instance of our starting image, with every committed crop
    // `image_crop` — will be our binding to the current `ImageCrop` Component instance
    let blob;
    let image_crop;

    // `src` — needs to start with our default image path, later we use it as comparison to
    // control allowing the end-user to reset all their committed crops
    //
    // `state` — we can't directly modify the internal `ImageCrop` state, but we can recieve
    // its current state via eventing to control allowing the end-user to reset their
    // current crop selection / commit the current selection
    let src = img;
    let state = CROP_STATE.default;

    async function on_commit_click(event) {
        // Using our `ImageCrop` Component binding, we can access its `get_cropped_blob`. And use
        // that to cache the current crop selection as a new `Blob` with image data. Then tell the
        // Browser to create a disposable URL pointing to the blob to display
        //
        // And if the currently loaded image doesn't match our default, we need to destroy the
        // disposable URL to prevent memory leaks
        blob = await image_crop.get_cropped_blob();
        if (src !== img) URL.revokeObjectURL(src);
        src = URL.createObjectURL(blob);
        image_crop.reset();
    }

    const back = () => {
        dispatch("close", {openCrop : false})
    }

    const done = () => {
        let reader = new FileReader();
        reader.readAsDataURL(blob); 
        reader.onloadend = function() {
            let image = new Image()
            let base64data = reader.result;                
            image.src = base64data
            dispatch("done", {openCrop : false, img :image})
        }
    }
    function on_clear_click(event) {
        // Next, we can use the `reset` method to remove the current crop selection
        image_crop.reset();
    }

    function on_reset_click(event) {
        // Finally we can reset everything to defaults to start over with the original image.
        if (src !== img) URL.revokeObjectURL(src);
        blob = null;
        src = img;
        image_crop.reset();
    }

    function on_state(event) {
        // For disabling our controls, we need to locally cache any changes to the `ImageCrop`'s state
        state = event.detail.state;
    }

</script>

{#if openCrop}
<div class="absolute inset-0 z-10 h-full bg-base-100 max-w-md w-full mx-auto" in:fly={{y : 100,duration : 100}} >
    <div class="p-2">
        <div class="w-full flex justify-between items-center h-[10vh]">
            <div class="flex items-center space-x-2">
                <button on:click={() => back()} class="btn btn-square btn-ghost bg-base-200 text-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m10 19-7-7 7-7"/><path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M3 12h18"/></svg>
                </button>
                <h1 class="text-xl tracking-tighter text-base-content">Pangkas Gambar</h1>
            </div>
            
            <button disabled={src === img} on:click={() => done()} class="btn btn-primary">
                Selesai
            </button>
        </div>
        <div class="relative h-[80vh] flex items-center justify-center">
            <div class="rounded-lg object-scale-down">
                <ImageCrop bind:this={image_crop} {src} on:state={on_state} />
            </div>
        </div>

        <div class="h-[10vh]">
            <h1 class="text-xs text-gray-400 text-center w-full">Sorot teks yang akan dipangkas</h1>
            <div class="flex flex-0 justify-between items-center">
                <button class="btn btn-ghost" disabled={state === CROP_STATE.default} on:click={on_reset_click}>reset</button>
                <button class="btn btn-secondary" disabled={state === CROP_STATE.default} on:click={on_commit_click}>Pangkas</button>
            </div>
        </div>
    </div>
</div>
{/if}

