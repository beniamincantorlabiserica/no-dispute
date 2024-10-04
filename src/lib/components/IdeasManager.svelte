<script>
    export let subjectId;
    import { addIdea } from '$lib/storage.js';
    import { onMount } from 'svelte';
    import { getAllIdeas } from '$lib/storage.js';
    import { vote } from "$lib/vote";
    import { page } from '$app/stores';
    import toast from 'svelte-french-toast';


    import PocketBase from 'pocketbase';
	import DottedCallOut from './DottedCallOut.svelte';

    const pb = new PocketBase('https://pine-plus.pockethost.io');
    
    $: ideas = new Set();
    // $: voted = localStorage.getItem('voted') || false;

    let idea = '';
    $: title = '';

    let textarea;
    const minHeight = '3rem';

    function resizeTextarea() {
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(parseInt(minHeight), textarea.scrollHeight)}px`;
      }
    }

  function resetTextarea() {
    idea = '';
    if (textarea) {
      textarea.style.height = minHeight;
    }
  }

    $: if (textarea) {
      resizeTextarea();
    }
  
    async function handleSubmit() {
      let ideaId = generateUniqueId();
      ideas = [...ideas,{id: ideaId, content: idea, votes: 0}];
      let ideaToSend = idea;
      idea = '';
      resetTextarea();
      let response = await addIdea(subjectId, ideaToSend, ideaId);
      
      if(!response) {

      //revome added idea if the request fails

      //   const index = ideas.indexOf(ideaId);
      //     if (index > -1) { // only splice array when item is found
      //       ideas.splice(index, 1); // 2nd parameter means remove one item only
      //     }
      }

      console.log("ALL IDEAS AFTER THE ADD BUTTON: ", ideas);
    }


    onMount(async () => {
      title = $page.url.searchParams.get('title');
      console.log('Subject ID:', subjectId);
      ideas = await getAllIdeas(subjectId);
      ideas = ideas.sort((a, b) => b.votes - a.votes)
      resizeTextarea();
      console.log("Ideas at onMount: ", ideas);

      pb.collection('subjects').subscribe(subjectId, function (e) {
          console.log('Ideas pulled from db:', e.record.ideas);
          ideas = mergeUniqueIdeas(ideas, e.record.ideas);

          ideas = [... ideas];
          ideas = ideas.sort((a, b) => b.votes - a.votes)
      }, { /* other options like expand, custom headers, etc. */ });

      });

    function mergeUniqueIdeas(existingIdeas, recordIdeas) {
        const idMap = new Map(existingIdeas.map(idea => [idea.id, idea]));
        
        recordIdeas.forEach(newIdea => {
            if (!idMap.has(newIdea.id)) {
                idMap.set(newIdea.id, newIdea);
                console.log("New idea added: ", newIdea);
            } else {
                const existingIdea = idMap.get(newIdea.id);
                if (existingIdea.votes !== newIdea.votes) {
                    existingIdea.votes = newIdea.votes;
                    idMap.set(newIdea.id, existingIdea);
                    console.log("Votes updated for idea: ", existingIdea);
                }
            }
        });
        
        return Array.from(idMap.values());
    }

    async function userVote(id, voteType) {
      console.log("ENTERING VOTING FUNC")
      const storageKey = `${id}`;
      console.log("Current vote: ", voteType);
      let currentVote = voteType === 'up' ? 1 : -1;
      let userVote = parseInt(localStorage.getItem(storageKey) || '0');


      if (localStorage.getItem(storageKey) && userVote === currentVote) {
        console.log("Item exists in the local storage.")  
        localStorage.removeItem(storageKey);
        
        voteType = voteType === 'up' ? 'down' : 'up';
        currentVote = voteType === 'up' ? 1 : -1;

        ideas.find(idea => {
        if (idea.id === id) {
          idea.votes += currentVote;
        }
      });

      ideas = ideas.sort((a, b) => b.votes - a.votes)
      ideas = [...ideas];

        let response = await vote(subjectId, id, voteType);
        return;
    }

      console.log("current vote type: ", voteType);
      console.log("updating votes")
      ideas.find(idea => {
        if (idea.id === id) {
          idea.votes += currentVote;
        }
      });

      ideas = [...ideas];
      localStorage.setItem(storageKey, currentVote);

      let response = await vote(subjectId, id, voteType);
      if (response === null) {
        // location.reload();
        // Update the votes in the local storage
        // localStorage.removeItem(storageKey, currentVote);
      }

    }

    function generateUniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('Link copied to clipboard!', {
          position: 'top-center',
          duration: 2000,
        });
      })
      .catch((error) => {
        console.error('Failed to copy: ', error);
        toast.error('Failed to copy link. Please try again.', {
          position: 'top-center',
          duration: 2000,
        });
      });
  }



  </script>

  <DottedCallOut text={title}/>
  <button
    on:click={copyLinkToClipboard}
    class="absolute top-2 right-2 btn btn-sm btn-ghost"
    aria-label="Copy link to clipboard"
  >
  📲 Share with friends 
  </button>

  <div class="text-center">
    <p class="text-xl font-semibold mb-2">Share Your Innovative Ideas! 💡🚀</p>
    <p class="text-lg mb-4">Type your thoughts in the box below 👇</p>
    <span class="text-4xl animate-bounce">⬇️</span>
  </div>




  <div class="flex justify-center">
    <form on:submit|preventDefault={handleSubmit} class="form-control mt-8">
      <div class="flex flex-col space-y-4 max-w-2xl mx-auto p-4">
        <textarea
          bind:value={idea}
          bind:this={textarea}
          on:input={resizeTextarea}
          placeholder="Enter your idea"
          required
          class="textarea textarea-bordered w-full text-lg min-h-[2rem] resize-none overflow-hidden"
        ></textarea>
        <button type="submit" class="btn btn-primary self-end w-full">
          Add Idea
        </button>
      </div>
    </form>
  </div>
  
  

  <ul class="space-y-4 mx-8 my-10">
    {#key ideas}
      {#each ideas as idea, index}
      <li class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden max-w-[600px] m-auto mt-4">
        <div class="card-body p-6 flex flex-row items-stretch">
          <!-- Left side: Idea content -->
          <div class="flex-grow pr-6">
            <p class="text-lg">{idea.content}</p>
          </div>
          
          <!-- Right side: Voting -->
          <div class="flex flex-col justify-center items-center space-y-2 min-w-[80px]">
            <!-- Upvote button -->
            <button 
              class="btn btn-circle btn-sm {localStorage.getItem(idea.id) === '1' ? 'btn-primary' : 'btn-outline'}" 
              on:click={() => userVote(idea.id, 'up')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <!-- Vote count -->
            <span class="text-xl font-bold">{idea.votes}</span>
            
            <!-- Downvote button -->
            <button 
              class="btn btn-circle btn-sm {localStorage.getItem(idea.id) === '-1' ? 'btn-error' : 'btn-outline'}" 
              on:click={() => userVote(idea.id, 'down')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </li>
      {/each}
    {/key}
  </ul>