<script>
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/translations';
  import { onMount } from 'svelte';
 
  let videoElement;
 
  function scrollToSection() {
    const element = document.getElementById('target-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
 
  onMount(() => {
    if (videoElement) {
      videoElement.play();
    }
  });
 </script>
 
 <div class="hero bg-base-100 min-h-[50dvh] mt-8">
   <div class="hero-content flex-col lg:flex-row-reverse">
     <video
       bind:this={videoElement}
       src='https://pocketbase-vso44okw4woow8co0ckc4s8c.netsaas.dev/api/files/vc4qa9eyu6sjfek/ezz05dar4x56uu1/nodispute_wDtfzvBOpq.mp4'
       class="w-[40%] m-auto bg-base-100"
       autoplay
       loop
       muted
       playsinline
     />
     <div class="hero-content text-left">
       <div>
         <h1 class="text-5xl font-bold">
           {translations[$language]?.heroWelcome || translations.en.heroWelcome}
         </h1>
         <p class="py-6">
           {@html translations[$language]?.heroDescription || translations.en.heroDescription}
         </p>
         <div class="py-6 text-xs">
           <div>No Dispute is in testing and wants to continuously improve.</div>
           <div>
             If you find any bugs write them down in this NoDispute
             <a href="https://nodispute.beniamin.io/no-dispute-bugs" class="underline" target="_blank">link</a>
           </div>
         </div>
         <button class="btn btn-primary" on:click={scrollToSection}>
           {translations[$language]?.heroButton || translations.en.heroButton} 🎉
         </button>
       </div>
     </div>
   </div>
 </div>