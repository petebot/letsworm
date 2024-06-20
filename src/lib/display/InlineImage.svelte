<script lang="ts">
  import { urlFor } from "../../sanity";
  export let portableText: any;

  console.log(portableText.value);
  let imageUrl = "";
  let alignment = "";

  if (
    portableText.value &&
    portableText.value.asset &&
    portableText.value.asset._ref
  ) {
    imageUrl = urlFor(portableText.value).url();
    alignment = portableText.value.alignment || "left";
  }
</script>

{#if imageUrl}
  <figure class={alignment}>
    <img src={imageUrl} alt={portableText.value.alt || ""} />
    {#if portableText.value.caption}
      <figcaption>{portableText.value.caption}</figcaption>
    {/if}
  </figure>
{/if}

<style>
  img {
    max-width: 100%;
  }
  figure {
    max-width: 50vw;
    margin: 2rem 0 1rem;
  }
  figure.left {
    float: left;
    margin-right: 2rem;
  }
  figure.right {
    float: right;
    margin-left: 2rem;
  }
  figure.full-width {
    width: 100%;
    margin: 2rem 0;
    max-width: 100%;
    display: block;
  }
  figure figcaption {
    font-size: 1em;
    text-align: center;
    font-style: italic;
    border-bottom: 1px solid
      color-mix(in srgb, var(--color-text) 10%, white 90%);
    padding: 0 0 0.5em;
  }
  @media (max-width: 700px) {
    figure {
      max-width: 100%;

      margin: 1rem 0;
    }
  }
</style>
