import {error} from '@sveltejs/kit'
import type {PageServerLoad} from './$types'
import client from '../../sanity'

const SUBMISSION_GUIDELINES_QUERY = `*[_type == "submissionGuidelines" && slug.current == "submission-guidelines"][0]{
  _id,
  title,
  intro,
  storyToggleLabel,
  artToggleLabel,
  storyTagline,
  artTagline,
  storyHeading,
  artHeading,
  storyGuidelines,
  artGuidelines,
  slug
}`

export const load: PageServerLoad = async () => {
  const guidelines = await client.fetch(SUBMISSION_GUIDELINES_QUERY)

  if (!guidelines) {
    throw error(
      404,
      'Submission guidelines content is not published yet. Add a Submission Guidelines document in Sanity.'
    )
  }

  return {guidelines}
}
