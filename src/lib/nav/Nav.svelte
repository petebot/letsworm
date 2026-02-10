<script lang="ts">
  import { page } from "$app/stores";
  export let categories: any = [{ title: "Replace" }, { title: "These" }];
</script>

<h1>
  <a class={$page.url.pathname === "/" ? "active" : ""} href="/">Let's Worm</a>
</h1>

<ul class="categories metadata">
  <li>
    <a
      class={$page.url.pathname.startsWith("/worms") ? "active" : ""}
      href="/worms">All Worms</a
    >
  </li>
  {#each categories as category}
    <li>
      <a
        class={$page.url.pathname === `/category/${category.slug.current}`
          ? "active"
          : ""}
        href={`/category/${category.slug.current}`}>{category.title}</a
      >
    </li>
  {/each}
</ul>

<style>
  h1 {
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .metadata {
    gap: 1rem;
    padding: 0;
    list-style: none;
  }
  a {
    position: relative;
  }
  a:hover {
    text-decoration: none;
  }
  a::after {
    content: "";
    display: block;
    background-color: var(--color-text);
    position: absolute;
    width: 100%;
    height: 0.0125rem;
    transform-origin: center;
    transform: scaleX(0);
    transition: 0.4s ease-in-out;
  }
  a:hover::after {
    transform: scaleX(0.25);
  }
  .active::after {
    transform: scaleX(1) !important;
  }
</style>
