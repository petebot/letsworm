export type ContributorName = {
  name?: string | null;
  givenName?: string | null;
  middleName?: string | null;
  familyName?: string | null;
  slug?: { current?: string | null } | null;
  image?: Record<string, unknown> | null;
  _id?: string | null;
};

export const formatContributorName = (person?: ContributorName | null): string => {
  if (!person) return "";
  const legacyName = person.name?.trim();
  if (legacyName) return legacyName;
  const parts = [person.givenName, person.middleName, person.familyName]
    .map((part) => part?.trim())
    .filter(Boolean);
  return parts.join(" ");
};

export const getContributorInitials = (person?: ContributorName | null): string => {
  if (!person) return "";
  const given = person.givenName?.trim();
  const family = person.familyName?.trim();
  if (given && family) return `${given[0]}${family[0]}`.toUpperCase();
  const name = formatContributorName(person);
  if (!name) return "";
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase();
  return `${tokens[0][0]}${tokens[tokens.length - 1][0]}`.toUpperCase();
};
