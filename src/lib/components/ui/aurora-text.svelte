<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		class?: string;
		colors?: string[];
		speed?: number;
	}

	let {
		children,
		class: className = '',
		colors = ['#FF0080', '#7928CA', '#0070F3', '#38bdf8'],
		speed = 1
	}: Props = $props();

	const gradientStyle = `
		background-image: linear-gradient(135deg, ${colors.join(', ')}, ${colors[0]});
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation-duration: ${5 / speed}s;
	`;
</script>

<span class="relative inline-block {className}">
	<span class="sr-only">{@render children()}</span>
	<span
		class="animate-aurora relative bg-clip-text text-transparent"
		style={gradientStyle}
		aria-hidden="true"
	>
		{@render children()}
	</span>
</span>

<style>
	@keyframes aurora {
		0% {
			background-position: 0% center;
		}
		100% {
			background-position: 200% center;
		}
	}

	.animate-aurora {
		animation: aurora linear infinite;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
