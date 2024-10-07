<script>
    import { slide } from 'svelte/transition';
  	import { language } from '$lib/stores/language';
    import { translations } from '$lib/translations';

    let faqs = [
      {
        question: translations[$language].faqQuestionOne,
        answer: translations[$language].faqAnswerOne
      },
      {
        question: translations[$language].faqQuestionTwo,
        answer: translations[$language].faqAnswerTwo
      },
      {
        question: translations[$language].faqQuestionThree,
        answer: translations[$language].faqAnswerThree
      },
      {
        question: translations[$language].faqQuestionFour,
        answer: translations[$language].faqAnswerFour
      }
    ];
  
    let activeIndex = -1;
  
    function toggleFaq(index) {
      activeIndex = activeIndex === index ? -1 : index;
    }
  </script>
  
  <div class="container mx-auto p-4 max-w-3xl my-8">
    <h2 class="text-3xl font-bold mb-6 text-center text-primary">{translations[$language].faqTitle}</h2>
    <div class="space-y-4">
      {#each faqs as faq, index}
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body p-4">
            <button 
              on:click={() => toggleFaq(index)}
              class="flex justify-between items-center w-full text-left"
            >
              <h3 class="text-xl font-semibold">{faq.question}</h3>
              <svg 
                class="w-6 h-6 transition-transform duration-200 ease-in-out {activeIndex === index ? 'rotate-180' : ''}" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {#if activeIndex === index}
              <div transition:slide={{ duration: 300 }} class="mt-4 text-base-content/80">
                <p>{faq.answer}</p>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>