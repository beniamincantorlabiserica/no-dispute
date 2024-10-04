<script>
    import { page } from '$app/stores';
	import IdeasManager from '../../lib/components/IdeasManager.svelte';
    import { Github, Globe } from 'lucide-svelte';
    import { goto } from '$app/navigation';

    
      const id = $page.params.id;
      console.log(`Current page ID: ${id}`);
      // Perform other operations with id
      const currentYear = new Date().getFullYear();
      
      function goToIndex(){
        goto('/');
      }
      
</script>


<IdeasManager subjectId={id} />

<div class="container mx-auto px-4 min-h-[50dvh] flex flex-col justify-between">
    <div class="flex-grow flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-3xl font-bold mb-4">Want to create your own discussion subject? 🚀</h2>
        <p class="text-lg mb-6">Join our community and start engaging conversations today!</p>
        <button class="btn btn-primary btn-lg hover:btn-secondary transition-colors duration-300" on:click={goToIndex}>
          Try Now
        </button>
      </div>
    </div>
  </div>
    
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
 
  
 
