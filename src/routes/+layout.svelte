<script lang="ts">
  import "./styles.css";
  import Header from "$lib/nav/Header.svelte";
  import PageTransition from "$lib/helpers/PageTransition.svelte";

  export let data;

  let categories = data.data;

  $: useFly = false;
  $: flyDirection = "";
</script>

<svelte:head>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="manifest" href="/site.webmanifest" />
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
  <meta name="msapplication-TileColor" content="#ffc40d" />
  <meta name="theme-color" content="#ffffff" />
</svelte:head>

<Header {categories}></Header>

<div class="app">
  <main>
    <PageTransition pathname={data.pathname}>
      <slot />
    </PageTransition>
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
