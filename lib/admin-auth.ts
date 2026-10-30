export const DEFAULT_ADMIN_EMAILS = [
  "merxodevsolutions@gmail.com",
  "alaminislam3203@gmail.com",
  "ahmedpolash732@gmail.com",
  "talk.polsh@gmail.com",
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const rawEnv = [
    process.env.ADMIN_EMAILS,
    process.env.NEXT_PUBLIC_ADMIN_EMAILS,
  ]
    .filter(Boolean)
    .join(",");
  const envAdmins = rawEnv
    ? rawEnv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : [];
  const allowed = [...DEFAULT_ADMIN_EMAILS, ...envAdmins].map((e) =>
    e.toLowerCase()
  );
  return allowed.includes(email.toLowerCase());
}
