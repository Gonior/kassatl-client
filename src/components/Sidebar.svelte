<script>
	import { theme } from "../lib/store"
    import {createEventDispatcher} from 'svelte'
    import SkeletonModal from './SkeletonModal.svelte'

    let dispatch = createEventDispatcher()

    let modal = {
        show : false,
        title : "",
        content : ""
    }
    const setTheme = () => {
		let html = document.querySelector('html')

		if ($theme === "dark") {
			html.setAttribute('data-theme', 'light')
			$theme = 'light'
		} else {
			html.setAttribute('data-theme', 'dark')
			$theme = 'dark'
		}
	}
    const handlePage = (option) => {
        dispatch('opt', {option})
    }

    const handleShowModal = (type) => {
        modal.show = true
        if (type === "about") {
            modal.title = "Tentang Aplikasi"
            modal.content= `<div class="flex flex-col px-6">
            <h3 class="text-lg font-bold">Japan X Indo <span class="text-opacity-80 text-base-content">(v1.0.0)</span></h3>
            <p class="text-base-content text-opacity-80 mt-1">Aplikasi ini adalah aplikasi penerjemah dari bahasa Jepang ke bahasa Indonesia dengan memanfaatkana teknologi kamera mobile.<br/>
                Aplikasi ini dibangun menggunakan SvelteJS, DaisyUI, TailwindCSS dll.<br/>
                Aplikasi ini menjadi salah satu syarat kelulusan di UNIKOM.
            </p>
        </div>`
        } else {
            modal.title = "Cara Menggunakan"
            modal.content = `<div class="px-6 text-base-content text-opacity-80">
            <ol class="list-decimal">
                <li>Ambil/unggah gambar (maksimal gambar 1MB) yang mengandung teks bahasa Jepang</li>
                <li>Pangkas atau edit gambar sesuai kebutuhan</li>
                <li>Klik <strong>Pindai</strong></li>
                <li>TADA!!!</li>
            </ol>
        </div>`
        }

    }
</script>

{#if modal.show}
    <SkeletonModal show={modal.show} title={modal.title} on:close={(e) => modal.show = e.detail.show}>
        {@html modal.content}
    </SkeletonModal>
{/if}

<div class="p-4 overflow-y-hidden justify-between flex w-2/3 lg:w-52 bg-base-100 text-base-content flex-col">
    <!-- Sidebar content here -->
    <div class="w-full mt-2 mb-4 flex items-center space-x-2">
        <img src="favicon.png" class="h-10 w-10 object-cover" alt="Logo JXI Translator">
        <div class="flex flex-col">
            <h4 class="text-xl font-bold text-base-content">J <span class="text-primary">X</span> I</h4>
            <p class="text-base-content text-opacity-80 text-sm -mt-2">Penerjemah</p>
        </div>
    </div>
    <div class="flex-1 space-y-2">
        <button on:click={() => handlePage(0)} class="w-full capitalize font-normal btn-ghost btn flex space-x-2 items-center justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 11v10h-5v-7h-4v7H5V11H3l9-9 9 9h-2z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/>
            </svg>
            <span>Dashboard</span>
        </button>
        <button on:click={() => handlePage(1)} class="w-full capitalize font-normal btn-ghost btn flex space-x-2 items-center justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4 9.22 9.27 3 10.11l4.5 4.1L6.44 20 12 17.27 17.56 20l-1.06-5.79 4.5-4.1-6.22-.84L12 4z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/>
            </svg>
            <span>Favorit Saya</span>
        </button>
        <button class="w-full capitalize font-normal btn-ghost btn flex space-x-2 items-center justify-start" on:click="{ () => setTheme()}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {#if $theme === "light"}
                <path d="M21 12a9 9 0 0 1-17.75 2.13A6.9 6.9 0 0 0 8 16a7 7 0 0 0 3.61-13H12a9 9 0 0 1 9 9Z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/>	
                {:else}
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                {/if}
            </svg>
            <span>{$theme === "dark" ? "light" : "dark"} mode</span>
        </button>
        
        <button on:click="{() => handleShowModal('howToUse')}" class="w-full capitalize font-normal btn-ghost btn flex space-x-2 items-center justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            <span>Cara Menggunakan</span>
        </button>
        <button on:click="{() => handleShowModal('about')}" class="w-full capitalize font-normal btn-ghost btn flex space-x-2 items-center justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Tentang Aplikasi</span>
        </button>
    </div>
    <div class="flex-0 flex items-center space-x-1">
        <span class="text-base-content text-opacity-50 font-semibold">Dedi Cahya</span>
        <a href="https://github.com/Gonior/" class="text-base-content">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" style="fill:currentColor;stroke:none"><path d="M10.9 2.1c-4.6.5-8.3 4.2-8.8 8.7-.5 4.7 2.2 8.9 6.3 10.5.3.1.6-.1.6-.5v-1.6s-.4.1-.9.1c-1.4 0-2-1.2-2.1-1.9-.1-.4-.3-.7-.6-1-.3-.1-.4-.1-.4-.2 0-.2.3-.2.4-.2.6 0 1.1.7 1.3 1 .5.8 1.1 1 1.4 1 .4 0 .7-.1.9-.2.1-.7.4-1.4 1-1.8-2.3-.5-4-1.8-4-4 0-1.1.5-2.2 1.2-3-.1-.2-.2-.7-.2-1.4 0-.4 0-1 .3-1.6 0 0 1.4 0 2.8 1.3.5-.2 1.2-.3 1.9-.3s1.4.1 2 .3C15.3 6 16.8 6 16.8 6c.2.6.2 1.2.2 1.6 0 .8-.1 1.2-.2 1.4.7.8 1.2 1.8 1.2 3 0 2.2-1.7 3.5-4 4 .6.5 1 1.4 1 2.3v2.6c0 .3.3.6.7.5 3.7-1.5 6.3-5.1 6.3-9.3 0-6-5.1-10.7-11.1-10z"/></svg>
        </a>
        <a href="mailto:dedi.10118901@mahasiswa.unikom.ac.id" class="text-base-content">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path d="M21 7.43h0l-4 3.43-5 4.28-5-4.28-4-3.43h0a2.42 2.42 0 0 1 4-1.84h0l5 4.29 5-4.29h0a2.42 2.42 0 0 1 4 1.84ZM17 19h4V7.43l-4 3.43ZM7 10.86 3 7.43V19h4Z" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1"/></svg>
        </a>
    </div>
</div>