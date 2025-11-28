<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Alert from '$lib/components/ui/alert';
	import { Lock, AlertCircle, Loader2 } from 'lucide-svelte';

	let username = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';

		try {
			const response = await fetch('/api/admin-login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Credenciales incorrectas';
				loading = false;
				return;
			}

			const redirectTo = $page.url.searchParams.get('redirect') || '/admin-dashboard';
			await goto(redirectTo);
		} catch (err) {
			error = 'Error al iniciar sesión. Intenta de nuevo.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Dev Resources</title>
</svelte:head>

<div
	class="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted/20 p-4"
>
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center space-y-2">
			<div class="flex justify-center mb-4">
				<div class="p-3 rounded-full bg-primary/10">
					<Lock class="h-8 w-8 text-primary" />
				</div>
			</div>
			<Card.Title class="text-2xl">Admin Dashboard</Card.Title>
			<Card.Description>Ingresa tus credenciales para continuar</Card.Description>
		</Card.Header>

		<Card.Content>
			{#if error}
				<Alert.Root variant="destructive" class="mb-4">
					<AlertCircle class="h-4 w-4" />
					<Alert.Description>{error}</Alert.Description>
				</Alert.Root>
			{/if}

			<form onsubmit={handleLogin} class="space-y-4">
				<div class="space-y-2">
					<Label for="username">Usuario</Label>
					<Input
						id="username"
						type="text"
						bind:value={username}
						placeholder="admin"
						required
						disabled={loading}
						autocomplete="username"
					/>
				</div>

				<div class="space-y-2">
					<Label for="password">Contraseña</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••"
						required
						disabled={loading}
						autocomplete="current-password"
					/>
				</div>

				<Button type="submit" class="w-full" disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Iniciando sesión...
					{:else}
						<Lock class="mr-2 h-4 w-4" />
						Iniciar Sesión
					{/if}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="flex justify-center">
			<Button variant="ghost" href="/" size="sm">← Volver al inicio</Button>
		</Card.Footer>
	</Card.Root>
</div>
