<script>
	import CreateSubject from '$lib/components/CreateSubject.svelte';
	import Hero from '../lib/components/Hero.svelte';
	import FAQ from '../lib/components/FAQ.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import image1 from "$lib/images/1.png";
	import image2 from "$lib/images/2.png";
	import image3 from "$lib/images/4.png";
	import image4 from "$lib/images/3.png";
	import demoImage from "$lib/images/demo.png";
    import { Github, Globe } from 'lucide-svelte';
	import { language } from '$lib/stores/language';
    import { translations } from '$lib/translations';
     
    // Perform other operations with id
    const currentYear = new Date().getFullYear();
	let visible = false;
	
	onMount(() => {
    	visible = true;
  	});



  $: features = [
    { emoji: "🤝", title: translations[$language].collaborativeTitle, description: translations[$language].collaborativeDescription },
    { emoji: "📊", title: translations[$language].transparentTitle, description: translations[$language].transparentDescription },
    { emoji: "⏱️", title: translations[$language].timeSavingTitle, description: translations[$language].timeSavingDescription }
  ];

  $: steps = [
    { emoji: "🎯", title: translations[$language].howToUseStepOne, description: translations[$language].howToUseStepOneDescription, image: image1 },
    { emoji: "💡", title: translations[$language].howToUseStepTwo, description: translations[$language].howToUseStepTwoDescription, image: image2 },
    { emoji: "🗳️", title: translations[$language].howToUseStepThree, description: translations[$language].howToUseStepThreeDescription, image: image3 },
    { emoji: "🏆", title: translations[$language].howToUseStepFour, description: translations[$language].howToUseStepFourDescription, image: image4 }
  ];



  </script>

<Hero />
  
<div class="p-4 my-8" id="target-section">
	<div class="container mx-auto">
	  <div class="bg-base-200 rounded-3xl shadow-lg p-8" in:fade="{{ duration: 500 }}">
		<div class="text-center">
		  <h1 class="text-4xl font-bold mb-6 text-primary">NoDispute</h1>
		  <p class="mb-6 text-base-content">{translations[$language].nodisputeCreation}</p>
		  <CreateSubject />
		</div>
	  </div>
	</div>
  </div>


  <div class="container mx-auto px-4 py-12">
	<h2 class="text-3xl font-bold text-center mb-8">{translations[$language].mainDescriptionTitle}</h2>
	
	<div class="grid md:grid-cols-3 gap-8 mb-16">
	  {#each features as feature}
		<div class="card bg-base-100 shadow-xl">
		  <div class="card-body items-center text-center">
			<span class="text-4xl mb-4">{feature.emoji}</span>
			<h3 class="card-title">{feature.title}</h3>
			<p>{feature.description}</p>
		  </div>
		</div>
	  {/each}
	</div>
  
	<h2 class="text-3xl font-bold text-center mb-8">{translations[$language].howToUse}</h2>
  
	<div class="space-y-16">
		{#each steps as step, index}
		  <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
			<div class="w-full md:w-1/2 order-2 md:order-1">
			  <img src={step.image} alt={step.title} class="rounded-lg shadow-lg w-full" />
			</div>
			<div class="w-full md:w-1/2 order-1 md:order-2">
			  <div class="flex items-center mb-4">
				<span class="text-4xl mr-4">{step.emoji}</span>
				<h3 class="text-2xl font-bold">{index + 1}. {step.title}</h3>
			  </div>
			  <p class="text-lg">{step.description}</p>
			</div>
		  </div>
		{/each}
	  </div>
	
	
	  <div class="mt-16 text-center">
		<h3 class="text-2xl font-bold mb-4">{translations[$language].seeNoDisputeInAction}</h3>
		<div class="aspect-w-16 aspect-h-9">
		  <img src={demoImage} alt="NoDyspute Demo" class="rounded-lg shadow-lg mx-auto border-2 w-[50%]" />
		</div>
		<p class="mt-4 text-sm text-base-content/70">{translations[$language].seeNoDisputeInActionDescription}</p>
	  </div>
  </div>

  <FAQ />


  <footer class="py-6 text-center bg-base-200">
	<div class="flex justify-center space-x-6 mb-4">
	  <a href="https://github.com/beniamincantorlabiserica" class="text-gray-600 hover:text-gray-900 transition-colors duration-300" target="_blank">
		<Github size={24} />
	  </a>
	  <a href="https://beniamin.io" class="text-gray-600 hover:text-gray-900 transition-colors duration-300" target="_blank">
		<Globe size={24} />
	  </a>
	</div>
	<p class="text-sm">&copy; {currentYear} All rights reserved.</p>
	<p class="mt-2 text-sm">
	  Made with ❤️ by 
	  <a href="https://beniamin.io" class="ml-1 font-medium hover:underline transition-all duration-300" target="_blank">
		Beniamin Avramita
	  </a>
	</p>
  </footer>
  
  <style>
	#target-section {
	  min-height: 40dvh;
	  display: flex;
	  align-items: center;
	}
  </style>