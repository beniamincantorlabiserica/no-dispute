<script>
    import { goto } from '$app/navigation';
    import { createSubject } from '$lib/storage.js';
  
    let title = '';
    let error = '';
  
    async function handleSubmit() {
      let data = await createSubject(title)
      console.log("DATA = ", data);
    //   goto('/' + data.id);
    goto(`/${data.id}?title=${encodeURIComponent(title)}`);

    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="form-control">
    <div class="input-group">
      <input 
        bind:value={title} 
        placeholder="Enter subject title" 
        required
        class="input input-bordered flex-grow"
      />
      <button type="submit" class="btn btn-primary">Create Subject</button>
    </div>
  </form>
  
  {#if error}
    <div class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{error}</span>
    </div>
  {/if}