<script lang="ts">
    import { createDbService } from "@/lib";
    import type { Resource } from "@/lib/types/database.types";
    import { onMount } from "svelte";

    const resourcesDb = createDbService<Resource>('resources');

    let resources = $state<Resource[]>([]);

    onMount(async () => {
        const { data, error } = await resourcesDb.getAll();
        if (error) {
            console.error(error);
        } else {
            resources = data ?? [];

            console.log(resources);
        }
    });
</script>

<h1 class="text-2xl font-bold text-center">Dev resources</h1>