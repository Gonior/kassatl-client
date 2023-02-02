<script>
	import Header from "./Header.svelte";
	import Sidebar from './Sidebar.svelte'
    import Homepage from './Homepage.svelte'
    import ListFavorites from './ListFavorites.svelte'
    import {onMount} from 'svelte'
    import { Lang } from "../models/lang";
    
	let options = [
        {
            component : Homepage
        },
        {
            component : ListFavorites
        }
    ]
    
    let source

    onMount(() => {
        source = new Lang().getSource().code
    })

    // $: console.log(source)
    const handleSwitchLang = (e) => {
        source = e.detail.source.code
        // console.log(source)
    }
    let selected = options[0]
    let optNum = 0
    const handlePage = (e) => {
        selected = options[e.detail.option]
        optNum = e.detail.option
        document.getElementById('my-drawer').click()
    }
    
</script>

<input id="my-drawer" type="checkbox" class="drawer-toggle">
<div class="drawer-content max-w-md w-full mx-auto">
    <Header {optNum} on:switchLang={handleSwitchLang}>
        <label for="my-drawer" class="btn btn-ghost btn-square rounded-xl bg-base-200 drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="text-base-content h-6 w-6" ><path d="M9 18h12M3 12h18M3 6h12" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
        </label>
    </Header>
   <!--Dynamic content here, Homepage (default) and Favorite page-->
   <svelte:component this={selected.component} {source} />
</div>
<div class="drawer-side ">
    <label for="my-drawer" class="drawer-overlay"></label>
    <Sidebar on:opt={(e) => handlePage(e)}/>
</div>


