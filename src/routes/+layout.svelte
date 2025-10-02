<script>
    import "../app.css";
    import { theme } from '$lib/stores/theme';


    import { fontStore } from '$lib/stores/fontStore';
    import { onMount } from 'svelte';
	import ThemeToggle from "../lib/components/ThemeToggle.svelte";
	import OfflineBanner from "../lib/components/OfflineBanner.svelte";

    let fontLink;

    onMount(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        fontStore.subscribe(value => {
            link.href = value.fontUrl;
            fontLink = link;
        });
        document.head.appendChild(link);
    });
</script>

<svelte:head>
    {#if fontLink}
        <link rel="stylesheet" href={fontLink.href}>
    {/if}
</svelte:head>

  
  <div data-theme={$theme} style="font-family: {$fontStore.fontFamily}">
    <OfflineBanner />
    <ThemeToggle />
    <slot />
  </div>