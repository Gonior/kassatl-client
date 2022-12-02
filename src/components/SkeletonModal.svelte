<script>
    import {fly} from 'svelte/transition'
    import {createEventDispatcher} from 'svelte'
    export let title = "This is title"
    export let show = false
    const dispatch = createEventDispatcher()

    const handleClose = () => {
        dispatch('close', {show : false})
    }

</script>

{#if show}
<div class="absolute inset-0 z-20 max-w-md px-6 mx-auto flex bg-base-100 bg-opacity-80 justify-center items-center">
    <div in:fly={{y :200 , duration : 200}} class="rounded-lg bg-base-200 text-base-content flex flex-col p-4">
        <h3 class="font-bold text-lg mb-1">{title}</h3>
            <slot></slot>
        <div class="mt-2 flex justify-center">
            <button on:click={() => handleClose()} class="w-1/2 btn btn-primary btn-sm block rounded-full">Oke</button>
        </div>
    </div>    
</div>
{/if}