<script>
    export let state = ''
</script>

<div class="h-full bg-base-100 flex items-center justify-center">
    <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-24 w-24 text-base-content text-opacity-80" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 16a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm1-5a1 1 0 0 1-2 0V7a1 1 0 0 1 2 0Z"/></svg>
        <h1 class="font-bold text-xl text-base-content">Terjadi Kesalahan</h1>
        {#if state === ""}
            <slot></slot>
        {:else}
            <span class="text-base-content text-center max-w-xs text-opacity-80 capitalize">{state}</span>
        {/if}
        
    </div>
</div>