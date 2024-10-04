<script>
    export let subjectId;
    import { addIdea } from '$lib/storage.js';
    import { onMount } from 'svelte';
    import { getAllIdeas } from '$lib/storage.js';
    import { vote } from "$lib/vote";
    import PocketBase from 'pocketbase';

    const pb = new PocketBase('https://pine-plus.pockethost.io');
    
    $: ideas = new Set();
    // $: voted = localStorage.getItem('voted') || false;

    let idea = '';
  
    async function handleSubmit() {
      let ideaId = generateUniqueId();
      ideas = [...ideas,{id: ideaId, content: idea, votes: 0}];
      let ideaToSend = idea;
      idea = '';
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
      console.log('Subject ID:', subjectId);
        ideas = await getAllIdeas(subjectId);
        ideas = ideas.sort((a, b) => b.votes - a.votes)

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

  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="form-control">
    <div class="input-group">
      <input 
        bind:value={idea} 
        placeholder="Enter your idea" 
        required
        class="input input-bordered flex-grow"
      />
      <button type="submit" class="btn btn-primary">Add Idea</button>
    </div>
  </form>

  <ul class="space-y-4">
    {#key ideas}
      {#each ideas as idea, index}
        <li class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <p class="text-lg">{idea.content}</p>
            <div class="card-actions justify-between items-center mt-4">
              <span class="text-sm font-semibold">Votes: {idea.votes}</span>
              <div class="btn-group">
                <button class="btn btn-sm  {localStorage.getItem(idea.id) === '1' ? 'btn-primary' : 'btn-outline'}" on:click={() => userVote(idea.id, 'up')}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button class="btn btn-sm  {localStorage.getItem(idea.id) === '-1' ? 'btn-error' : 'btn-outline'}" on:click={() => userVote(idea.id, 'down')}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      {/each}
    {/key}
  </ul>