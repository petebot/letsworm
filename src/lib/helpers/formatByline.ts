export type PromptedByRole = "art" | "writing" | null | undefined;

type NameLike = string | { name?: string | null; [key: string]: any } | null | undefined;

type FormatName = (value: NameLike) => string;

const resolveName = (value: NameLike, formatName?: FormatName): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (formatName) return formatName(value);
  return value?.name?.trim() ?? "";
};

export const getOrderedRoles = (
  promptedByRole: PromptedByRole,
): Array<"author" | "illustrator"> => {
  if (promptedByRole === "art") return ["illustrator", "author"];
  return ["author", "illustrator"];
};

export const getBylineParts = (params: {
  author?: NameLike;
  illustrator?: NameLike;
  promptedByRole?: PromptedByRole;
  formatName?: FormatName;
}): string[] => {
  const { author, illustrator, promptedByRole, formatName } = params;
  const orderedRoles = getOrderedRoles(promptedByRole);
  const orderedNames = orderedRoles.map((role) =>
    role === "author"
      ? resolveName(author, formatName)
      : resolveName(illustrator, formatName),
  );
  return orderedNames.filter(Boolean);
};

export type BylinePart = {
  name: string;
  label: string;
};

export type ContributorEntry<T = NameLike> = {
  role: "author" | "illustrator";
  name: string;
  label: string;
  person: T | null;
  isPrompter: boolean;
};

export const getContributorEntries = (params: {
  author?: NameLike;
  illustrator?: NameLike;
  promptedByRole?: PromptedByRole;
  formatName?: FormatName;
}): ContributorEntry[] => {
  const { author, illustrator, promptedByRole, formatName } = params;
  const orderedRoles = getOrderedRoles(promptedByRole);

  return orderedRoles
    .map((role, idx) => {
      const source = role === "author" ? author : illustrator;
      const name = resolveName(source, formatName);
      if (!name) return null;

      const isPrompter = idx === 0;
      let label: string;

      if (isPrompter) {
        label = role === "author" ? "Prompted and Written by" : "Prompted and Illustrated by";
      } else {
        label = role === "author" ? "Written by" : "Illustrated by";
      }

      return {
        role,
        name,
        label,
        person:
          source && typeof source === "object" && !Array.isArray(source)
            ? (source as NameLike)
            : null,
        isPrompter,
      } satisfies ContributorEntry;
    })
    .filter((entry): entry is ContributorEntry => entry !== null);
};

export const getBylinePartsWithLabels = (params: {
  author?: NameLike;
  illustrator?: NameLike;
  promptedByRole?: PromptedByRole;
  formatName?: FormatName;
}): BylinePart[] => {
  return getContributorEntries(params).map(({ name, label }) => ({ name, label }));
};

export const getByline = (params: {
  author?: NameLike;
  illustrator?: NameLike;
  promptedByRole?: PromptedByRole;
  formatName?: FormatName;
}): string | undefined => {
  const parts = getBylineParts(params);
  if (parts.length === 0) return undefined;
  if (parts.length === 1) return parts[0];
  return parts.join(" & ");
};
