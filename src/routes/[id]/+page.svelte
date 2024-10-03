<script>
    import { page } from '$app/stores';
	import IdeasManager from '../../lib/components/IdeasManager.svelte';
  
    
      const id = $page.params.id;
      console.log(`Current page ID: ${id}`);
      // Perform other operations with id

  </script>


<IdeasManager subjectId={id} />