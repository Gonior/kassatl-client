<script>
    import {SyncLoader} from 'svelte-loading-spinners'
    // import {fade} from 'svelte/transition'
    export let state = 'memuat'
</script>

<div class="h-full bg-base-100 flex items-center justify-center">
    <div class="flex flex-col items-center">
        <SyncLoader color="#5B31CE" size="5" unit="rem" />
        <span class="text-base-content text-opacity-80 capitalize">{state}</span>
    </div>
</div>