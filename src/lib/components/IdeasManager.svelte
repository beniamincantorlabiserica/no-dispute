<script>
    export let subjectId;
    import { addIdea } from '$lib/storage.js';
    import { onMount } from 'svelte';
    import { getAllIdeas } from '$lib/storage.js';
    import { vote } from "$lib/vote";
    import { page } from '$app/stores';
    import toast, { Toaster } from 'svelte-french-toast';
    import confetti from 'canvas-confetti';
    import PocketBase from 'pocketbase';
	  import DottedCallOut from './DottedCallOut.svelte';
  	import { language } from '$lib/stores/language';
    import { translations } from '$lib/translations';

    const pb = new PocketBase('https://pocketbase-vso44okw4woow8co0ckc4s8c.netsaas.dev');

    
    $: ideas = new Set();
    // $: voted = localStorage.getItem('voted') || false;

    let idea = '';
    let userKey 
    let userVotes = [];
    let localUserVotes = [];
    $: title = '';

    let textarea;
    const minHeight = '3rem';

    let owner = false;

      if (subjectId === "no-dispute-bugs") {
        owner = true;
      }

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
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      let ideaId = generateUniqueId();
      ideas = [...ideas,{id: ideaId, content: idea, votes: 0}];
      let ideaToSend = idea;
      idea = '';
      resetTextarea();
      let response = await addIdea(subjectId, ideaToSend, ideaId);
      
      // console.log("ALL IDEAS AFTER THE ADD BUTTON: ", ideas);
    }

    let unsubscribe;
    onMount(async () => {
      const record = await pb.collection('subjects').getOne(subjectId);

    // Extract the title from the record
      title = record.title;
      if (localStorage.getItem('userKey')) {
        userKey = localStorage.getItem('userKey');
        console.log('User key:', userKey);
        // retrieve user votes
      } else {
        console.log('No user key found. Generating new one.');
        userKey = generateUniqueId();
        localStorage.setItem('userKey', userKey);
      }

      const records = await pb.collection('votes').getList(1, 50, {
        filter: `userKey="${userKey}"`,
        sort: '-created' // Optional: sort by creation date, newest first
      });

      // Extract the items from the response
      userVotes = records.items;
      localUserVotes = userVotes;


      // console.log('Subject ID:', subjectId);
      ideas = await getAllIdeas(subjectId);
      ideas = ideas.sort((a, b) => b.votes - a.votes)
      resizeTextarea();
      // console.log("Ideas at onMount: ", ideas);

      pb.collection('subjects').subscribe(subjectId, function (e) {
          // console.log('Ideas pulled from db:', e.record.ideas);
          ideas = mergeUniqueIdeas(ideas, e.record.ideas);

          ideas = [... ideas];
          ideas = ideas.sort((a, b) => b.votes - a.votes)
      }, { /* other options like expand, custom headers, etc. */ });
      subscribeToVotes();
      });

      function subscribeToVotes() {
    unsubscribe = pb.collection('votes').subscribe('*', async ({ action, record }) => {
      if (record.userKey === userKey) {
        if (action === 'create') {
          userVotes = [...userVotes, record];
        } else if (action === 'update') {
          userVotes = userVotes.map(v => v.id === record.id ? record : v);
        } else if (action === 'delete') {
          userVotes = userVotes.filter(v => v.id !== record.id);
        }
      }
    });
  }

    function mergeUniqueIdeas(existingIdeas, recordIdeas) {
        const idMap = new Map(existingIdeas.map(idea => [idea.id, idea]));
        
        recordIdeas.forEach(newIdea => {
            if (!idMap.has(newIdea.id)) {
                idMap.set(newIdea.id, newIdea);
                // console.log("New idea added: ", newIdea);
            } else {
                const existingIdea = idMap.get(newIdea.id);
                if (existingIdea.votes !== newIdea.votes) {
                    existingIdea.votes = newIdea.votes;
                    idMap.set(newIdea.id, existingIdea);
                    // console.log("Votes updated for idea: ", existingIdea);
                }
            }
        });
        
        return Array.from(idMap.values());
    }

    async function userVote(id, voteType) {
      let matchedVote = null;
      const matchedItem = userVotes.find(item => item.ideaId === id);
      let currentVote = voteType === 'up' ? 1 : -1;

      if (matchedItem) {
          matchedVote = matchedItem.vote;
          
          if(matchedVote === currentVote){
            console.log("sending vote for same button pressed: ", currentVote * -1);
              vote(subjectId, id, userKey, currentVote * -1)
              // adapt local list
          } else {
            if (matchedVote !== 0) {
              // call vote with oposite of current vote * 2
              console.log("sending vote for different button pressed: ", matchedVote * -2);
              vote(subjectId, id, userKey, matchedVote * -2)
              // adapt local list
            }else {
              vote(subjectId, id, userKey, currentVote)
            }
          }
      } else {
          // create new entry with the vote
          console.log("sending vote for new button pressed: ", currentVote);
          vote(subjectId, id, userKey, currentVote)
          // adapt the local list 
      }
    }

    function generateUniqueId() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    function copyLinkToClipboard() {

      let text = title + ' - No Dispute \n\n' + window.location.href + ' \n\n\n Share your ideas with the world! 🚀';
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(translations[$language].clipboardSuccess);
      })
      .catch((error) => {
        // console.error('Failed to copy: ', error);
        toast.error(translations[$language].clipboardError);
      });
  }



  </script>

<Toaster />
  <DottedCallOut text={title}/>
  <button
    on:click={copyLinkToClipboard}
    class="absolute top-20 right-2 btn btn-sm btn-ghost"
    aria-label="Copy link to clipboard"
  >
  📲 {translations[$language].shareWithFriends}
  </button>

  {#if owner}
  <div class="text-center">
    <p class="text-xl font-semibold mt-4">{@html translations[$language].customOwnerText}</p>
    <span class="text-4xl animate-bounce">⬇️</span>
  </div>
  {:else}
  <div class="text-center mt-4">
    <p class="text-xl font-semibold mb-2">{translations[$language].ideaDescriptionOne}</p>
    <p class="text-lg mb-2">{translations[$language].ideaDescriptionTwo}</p>
    <span class="text-4xl animate-bounce">⬇️</span>
  </div>
  {/if}

  




  <div class="flex justify-center">
    <form on:submit|preventDefault={handleSubmit} class="form-control mt-2">
      <div class="flex flex-col space-y-4 max-w-2xl mx-auto p-4">
        <textarea
          bind:value={idea}
          bind:this={textarea}
          on:input={resizeTextarea}
          placeholder={translations[$language].ideaInputPlaceholder}
          required
          class="textarea textarea-bordered w-full text-lg min-h-[2rem] resize-none overflow-hidden"
        ></textarea>
        <button type="submit" class="btn btn-primary self-end w-full">
          {translations[$language].ideaSubmitButton}
        </button>
      </div>
    </form>
  </div>
  
  
  <ul class="space-y-4 mx-8 my-4">
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
                class="btn btn-circle btn-sm {userVotes.some(vote => vote.ideaId === idea.id && vote.vote === 1) ? 'btn-primary' : 'btn-outline'}"
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
              class="btn btn-circle btn-sm {userVotes.some(vote => vote.ideaId === idea.id && vote.vote === -1) ? 'btn-error' : 'btn-outline'}"
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