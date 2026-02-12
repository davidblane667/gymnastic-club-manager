/**
 * Formats a full name to short form: "Smith J.D."
 * @param fullName - full name (Last First Middle)
 * @returns short name (Last F.M.)
 */
export const formatShortName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const surname = parts[0];
  const initials = parts
    .slice(1)
    .map((part) => `${part[0]}.`)
    .join("");

  return `${surname} ${initials}`;
};
