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

export const getBylinePartsWithLabels = (params: {
  author?: NameLike;
  illustrator?: NameLike;
  promptedByRole?: PromptedByRole;
  formatName?: FormatName;
}): BylinePart[] => {
  const { author, illustrator, promptedByRole, formatName } = params;
  const orderedRoles = getOrderedRoles(promptedByRole);
  
  return orderedRoles
    .map((role, idx) => {
      const name = role === "author" 
        ? resolveName(author, formatName)
        : resolveName(illustrator, formatName);
      
      if (!name) return null;
      
      const isPrompter = idx === 0;
      let label: string;
      
      if (isPrompter) {
        // First person in order is the prompter
        if (role === "author") {
          label = "Prompted and Written by";
        } else {
          label = "Prompted and Illustrated by";
        }
      } else {
        // Second person is the responder
        if (role === "author") {
          label = "Written by";
        } else {
          label = "Illustrated by";
        }
      }
      
      return { name, label };
    })
    .filter((part): part is BylinePart => part !== null);
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
