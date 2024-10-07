<script>
    import heroImage from '$lib/images/hero.png'
    import { language } from '$lib/stores/language';
    import { translations } from '$lib/translations';

    function scrollToSection() {
    const element = document.getElementById('target-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
</script>

<div class="hero bg-base-100 min-[50dvh] mt-8">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <img
        src={heroImage}
        class="w-[80%] m-auto  bg-base-100" />
        <div class="hero-content text-left">
            <div>
              <h1 class="text-5xl font-bold"> {translations[$language]?.heroWelcome || translations.en.heroWelcome} </h1>
              <p class="py-6">
                {@html translations[$language]?.heroDescription || translations.en.heroDescription}
              </p>
              <div class="py-6 text-xs">
                <div>No Dispute is in testing and wants to continuously improve.</div>
                <div>If you find any bugs write them down in this NoDispute <a href="https://nodispute.beniamin.io/softwarebugsnod?title=Open%20list%20for%20any%20bugs%20in%20the%20web-app%2C%20please%20feel%20free%20to%20share%20them%20😁" class="underline" target="_blank">link</a></div>

              </div>
              <button class="btn btn-primary" on:click={scrollToSection}>{translations[$language]?.heroButton || translations.en.heroButton} 🎉</button>
            </div>
          </div>
    </div>
  </div>