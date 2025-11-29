<script lang="ts">
	import AuroraText from '$lib/components/ui/aurora-text.svelte';
</script>

<footer class="bg-transparent text-foreground">
	<div class="container mx-auto px-4 max-w-7xl">
		<div class="flex flex-col md:flex-row justify-center items-center py-4">
			<p class="text-md text-muted-foreground">
				Hecho por <a
					href="https://www.instagram.com/elrincondeldev/"
					class="text-primary"
					target="_blank"
					rel="noopener noreferrer"
					><AuroraText
						colors={['#FF0080', '#7928CA', '#0070F3', '#38bdf8']}
						class="text-md font-bold"
					>
						El Rincón Del Dev
					</AuroraText> 🩵</a
				>
			</p>
		</div>
	</div>
</footer>
