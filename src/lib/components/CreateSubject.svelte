<script>
    import { goto } from '$app/navigation';
    import { createSubject } from '$lib/storage.js';
    import { onMount } from 'svelte';
    import confetti from 'canvas-confetti';

    let title = '';
    let error = '';

    let inputElement;

function adjustInputSize() {
  if (inputElement) {
    inputElement.style.height = 'auto';
    inputElement.style.height = inputElement.scrollHeight + 'px';
  }
}
  
    async function handleSubmit() {
        confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      let data = await createSubject(title)
      console.log("DATA = ", data);
    //   goto('/' + data.id);
    goto(`/${data.id}?title=${encodeURIComponent(title)}`);

    }


    onMount(() => {
    adjustInputSize();
  });
  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="form-control">
    <div class="input-group flex  flex-col items-start">
        <textarea
          bind:value={title}
          bind:this={inputElement}
          on:input={adjustInputSize}
          placeholder="Enter subject title"
          required
          class="input input-bordered flex-grow min-h-[4rem] resize-none w-full mb-4 overflow-hidden transition-all duration-200 ease-in-out  placeholder:leading-[3.5rem]"
          rows="1"
        ></textarea>
        <button type="submit" class="btn btn-primary self-stretch">Create Subject</button>
      </div>
  </form>
  
  {#if error}
    <div class="alert alert-error mt-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{error}</span>
    </div>
  {/if}

  <style>
    textarea::placeholder {
      vertical-align: middle;
    }
  </style>