<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '@/widgets/Header.svelte';
	import Footer from '@/widgets/Footer.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>El Rincón Del Dev</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header />
	<main class="flex-1">{@render children()}</main>
	<Footer />
	<div class="fixed inset-0 -z-10 w-full h-full bg-linear-to-br from-rose-100 to-teal-100">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#bae6fd60,transparent)]"
		></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_800px_at_0%_300px,#fecdd360,transparent)]"
		></div>
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_800px,#a5f3fc60,transparent)]"
		></div>
	</div>
</div>
