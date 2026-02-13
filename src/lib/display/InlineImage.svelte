<script lang="ts">
  import { urlFor } from "../../sanity";
  export let portableText: { value?: Record<string, any> } = {};

  let imageUrl = "";
  let alignment = "";

  const block = portableText?.value;
  if (block?.asset?._ref) {
    imageUrl = urlFor(block).url();
    alignment = block.alignment || "left";
  }
</script>

{#if imageUrl}
  <img src={imageUrl} alt={portableText?.value?.alt || ""} class={alignment} />
{/if}

<style>
  img {
    max-width: 50vw;
  }
  img.left {
    float: left;
    margin-right: 1em;
  }
  img.right {
    float: right;
    margin-left: 1em;
  }
  img.full-width {
    width: 100%;
    display: block;
  }
  @media (max-width: 700px) {
    img {
      max-width: 100%;
    }
  }
</style>
