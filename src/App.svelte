<script>

	import { onMount } from "svelte";
	import {theme, BASE_URL, SUPPORT_CAMERA} from './lib/store'
	import Layout from './components/_layout.svelte'
	import axios from 'axios'
	import LoadingState from './components/LoadingState.svelte'
	import ErrorState from './components/ErrorState.svelte'
	let isLoading = true, isError = false
	let errorstate = true
	$:state = 'memuat'


	onMount(async () => {
		document.querySelector('html').setAttribute('data-theme', $theme)
		await testConnection()

		if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
			
			let media = await navigator.mediaDevices.enumerateDevices()
			let detect = media.find(m => m.kind === 'videoinput')
			if (detect === undefined) $SUPPORT_CAMERA.support = false
			else {
				$SUPPORT_CAMERA.support = true
			}
		}
		
		isLoading = false
	})

	const testConnection = async () => {
		state = "Test koneksi ke server"
		isLoading = true
		try {
			await axios({
				method : "GET",
				url : BASE_URL				
			})
			state = "berhasil tekoneksi dengan server"
			isError = false
		} catch (e) {
			isError = true
			errorstate = e.message === "Network Error" ? "Periksa koneksi internet anda" : e.message
			state = e
		}
	}

	
</script>

<main class="safe-top safe-left safe-right safe-bottom mx-2 h-full relative" >
	<div class="max-h-screen h-full overflow-y-auto disable-scrollbars select-none drawer" on:contextmenu|preventDefault>
		{#if isLoading}
		<LoadingState {state} />
		{:else}
			{#if isError}
			<ErrorState >
				<div class="flex flex-col items-center mt-2">
					<p class="text-base-content text-center max-w-xs text-opacity-80 capitalize">{errorstate}</p>
					<button on:click="{() => testConnection()}" class="btn btn-primary btn-sm">coba lagi</button>
				</div>
			</ErrorState>
			{:else}
				<Layout/>
			{/if}
		{/if}
	</div>
</main>

<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	input {
		@apply outline-none;
	}

	@layer components {
		button {
			@apply outline-none no-tap-highlighting;
		}

	}

	img {
		max-height: 80vh;
	}
	
</style>
