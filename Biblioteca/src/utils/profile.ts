export const isUsernameMissing = (username?: string | null) => {
  if (!username) return true;
  return username.trim().toLowerCase() === "usuario";
};
