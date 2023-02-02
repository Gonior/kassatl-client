<script>
    import { createEventDispatcher } from 'svelte';
    import {Lang} from '../models/lang'
    const dispatch = createEventDispatcher()

    export let optNum 
    const lang = new Lang()
    let source = lang.getSource()
    let target = lang.getTarget()
    
    const handleSwitchLang = () => {
        lang.switchLang()
        source = lang.getSource()
        target = lang.getTarget()
        dispatch('switchLang',{source})
    }

    
    
</script>

<div class="w-full px-2 flex justify-between items-center h-[10vh]">
    {#if optNum === 0}
    <div class="flex" on:click={() => handleSwitchLang()}>
        <div class="flex space-x-1 items-center">
            <img class="h-5 w-5 object-cover rounded-full border-base-content border-2" src={`icons/${source.flag}`} alt={source.alt}>
            <span class="text-base-content font-medium">{source.text}</span>
        </div>
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="mx-2 h-6 w-6 text-base-content"><path d="M3 12h18m-3 3 3-3-3-3" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
        <div class="flex space-x-1 items-center ">
            <img class="h-5 w-5 object-cover rounded-full border-base-content border-2" src={`icons/${target.flag}`} alt={target.alt}>
            <span class="text-base-content font-medium">{target.text}</span>
        </div>
    </div>
    {:else}
    <div class="flex">
        <h1 class="text-base-content font-semibold">Daftar Terjemahan Favorit</h1>
    </div>

    {/if}
    <div>
        <slot></slot>
    </div>
</div>