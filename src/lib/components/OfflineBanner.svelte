<script>
	import { AlertTriangle, Eye, X } from 'lucide-svelte';
	import { language } from '$lib/stores/language';
	import { translations } from '$lib/translations';
	import { createEventDispatcher } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	
	const dispatch = createEventDispatcher();
	let isDismissed = false;
	
	function dismiss() {
		isDismissed = true;
		dispatch('dismiss');
	}
</script>

{#if !isDismissed}
	<div 
		class="alert alert-warning shadow-lg border-0 rounded-none sticky top-0 z-50 backdrop-blur-sm bg-opacity-95"
		transition:slide={{ duration: 300 }}
	>
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center gap-3">
				<AlertTriangle class="h-5 w-5 text-warning shrink-0" />
				<div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
					<span class="font-semibold text-warning-content">
						{translations[$language]?.offlineModeTitle || 'We are offline for now'}
					</span>
					<span class="text-sm text-warning-content opacity-90">
						{translations[$language]?.offlineModeMessage || 'Feel free to explore the app with limitations - creating subjects functionality does not work'}
					</span>
				</div>
			</div>

		</div>
	</div>
{/if}

<style>
	/* Additional custom styling if needed */
	.alert {
		animation: slideInDown 0.3s ease-out;
	}
	
	@keyframes slideInDown {
		from {
			transform: translateY(-100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>