<script>
    import { onMount } from 'svelte';
    import { language } from '$lib/stores/language';
    import { translations } from '$lib/translations';
  
    const languages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'dk', name: 'Dansk', flag: '🇩🇰' },
      { code: 'ro', name: 'Română', flag: '🇷🇴' },
    ];
  
    let isOpen = false;
  
    onMount(() => {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
        language.set(savedLanguage);
      }
    });
  
    function toggleDropdown() {
      isOpen = !isOpen;
    }
  
    function selectLanguage(lang) {
      language.set(lang.code);
      localStorage.setItem('language', lang.code);
      isOpen = false;
    }
  </script>
  
  <div class="relative">
    <button on:click={toggleDropdown} class="btn btn-ghost btn-circle">
      <span class="text-xl">{languages.find(lang => lang.code === $language)?.flag || '🌐'}</span>
    </button>
    
    {#if isOpen}
      <div class="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg z-50">
        {#each languages as lang}
          <button
            on:click={() => selectLanguage(lang)}
            class="block w-full text-left px-4 py-2 hover:bg-base-200"
          >
            <span class="mr-2">{lang.flag}</span>
            {lang.name}
          </button>
        {/each}
      </div>
    {/if}
  </div>