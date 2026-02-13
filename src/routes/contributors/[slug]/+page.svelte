<script lang="ts">
  import { PortableText } from "@portabletext/svelte";
  import ContributorCard from "$lib/display/ContributorCard.svelte";
  import StoryCard from "$lib/display/StoryCard.svelte";
  import { formatContributorName } from "$lib/helpers/formatContributorName";
  import { getContributorEntries } from "$lib/helpers/formatByline";

  export let data: { contributor?: any };

  const contributor = data?.contributor ?? null;
  const stories = contributor?.stories ?? [];

  const collaboratorMap = new Map<string, any>();
  for (const story of stories) {
    const participants = [story.author, story.illustrator].filter(Boolean);
    for (const person of participants) {
      if (person._id && person._id !== contributor?._id) {
        collaboratorMap.set(person._id, person);
      }
    }
  }

  const collaborators = Array.from(collaboratorMap.values());

  const displayName = formatContributorName(contributor);

  const promptedCount = contributor?.promptedCount ?? 0;
  const respondedCount = contributor?.respondedCount ?? 0;

  const statsText =
    promptedCount > 0 || respondedCount > 0
      ? `${promptedCount} prompted, ${respondedCount} responded`
      : contributor?.storyCount !== undefined &&
          contributor?.storyCount !== null
        ? `${contributor.storyCount} stories contributed`
        : null;

  const buildStoryLink = (story: any) => {
    const issueSegment = story.issue?.slug?.current ?? story.issue?.issueNumber;
    if (issueSegment) return `/issues/${issueSegment}/${story.slug?.current}`;
    return story.slug?.current ? `/${story.slug.current}` : "#";
  };

  const buildContributors = (story: any) =>
    getContributorEntries({
      author: story.author ?? story.authorDisplayName,
      illustrator: story.illustrator ?? story.illustratorDisplayName,
      promptedByRole: story.promptedBy,
      formatName: (value) =>
        typeof value === "string" ? value : formatContributorName(value),
    });
</script>

<svelte:head>
  <title>{displayName || "Contributor"} — Let's Worm</title>
  <meta
    name="description"
    content={displayName
      ? `Stories and collaborations by ${displayName}.`
      : "Contributor profile"}
  />
</svelte:head>

{#if contributor}
  <main class="contributor-page">
    <section class="profile-hero">
      <ContributorCard {contributor} variant="hero" link={false} {statsText} />

      {#if contributor.bio}
        <h2>Biography</h2>
        <article class="bio">
          <PortableText value={contributor.bio} components={{}} />
        </article>
      {/if}
    </section>

    <section class="stories">
      <div class="section-header">
        <h2>Stories</h2>
        <span>{stories.length} total</span>
      </div>
      {#if stories.length === 0}
        <div class="empty-state">No stories yet.</div>
      {:else}
        <div class="story-grid">
          {#each stories as story (story._id)}
            {@const entries = buildContributors(story)}
            <StoryCard
              {story}
              href={buildStoryLink(story)}
              contributors={entries}
              byline={entries.map((entry) => entry.name)}
              showContributorAvatars={true}
            />
          {/each}
        </div>
      {/if}
    </section>

    <section class="collaborators">
      <div class="section-header">
        <h2>Collaborators</h2>
        <span>{collaborators.length} people</span>
      </div>
      {#if collaborators.length === 0}
        <div class="empty-state">No collaborations yet.</div>
      {:else}
        <div class="collaborator-grid">
          {#each collaborators as person (person._id)}
            <ContributorCard contributor={person} compact={true} />
          {/each}
        </div>
      {/if}
    </section>
  </main>
{:else}
  <main class="contributor-page">
    <p>Loading contributor...</p>
  </main>
{/if}

<style>
  .contributor-page {
    width: min(100%, 80rem);
    padding: 2rem 1.5rem 4rem;
    margin: 0 auto;
  }

  .profile-hero {
    display: grid;
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .bio {
    max-width: 60ch;
    font-size: 1.05rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .section-header span {
    font-size: 0.9rem;
    color: var(--color-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }

  .story-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .collaborators {
    margin-top: 3rem;
  }

  .collaborator-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.25rem;
  }

  .empty-state {
    padding: 1.5rem;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    color: var(--color-text-subtle);
  }

  @media (max-width: 720px) {
    .section-header {
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
    }
  }
</style>
