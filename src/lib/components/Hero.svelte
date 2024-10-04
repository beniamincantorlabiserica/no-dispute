<script>
    import heroImage from '$lib/images/hero.png'
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
        class="max-w-sm  bg-base-100" />
        <div class="hero-content text-left">
            <div>
              <h1 class="text-5xl font-bold">Welcome to No Dispute 🤝</h1>
              <p class="py-6">
                🕰️ Save time and avoid arguments! 🚀 Make quick decisions with friends.<br>
                🎲 Resolve conflicts fairly. 🤗 Keep friendships strong.<br>
                👥 Perfect for groups, roommates, and families!
              </p>
              <button class="btn btn-primary" on:click={scrollToSection}>Get Started 🎉</button>
            </div>
          </div>
    </div>
  </div>