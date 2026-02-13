export const normalizeIssueNumber = (value?: string | number | null): number | string => {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "number") return value;
  const parsed = parseInt(String(value), 10);
  return Number.isNaN(parsed) ? value : parsed;
};

export default normalizeIssueNumber;
