<script lang="ts">
  import "./styles.css";
  import Header from "$lib/nav/Header.svelte";
  import Footer from "$lib/nav/Footer.svelte";
  import PageTransition from "$lib/helpers/PageTransition.svelte";
  import BackToTop from "$lib/ui/BackToTop.svelte";

  export let data;

  let pages = data.pages ?? [];
  $: pages = data.pages ?? [];

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

<Header {pages}></Header>

<div class="app">
  <main>
    <PageTransition pathname={data.pathname}>
      <slot />
    </PageTransition>
  </main>
</div>

<Footer {pages} />

<BackToTop />

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
    align-items: center;
    padding: 0;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
