// Seed data (database/data.json) stores avatars as bare filenames (e.g. "stu001.jpg")
// that live in src/assets/imgs. Uploaded avatars are stored as "/uploads/<file>",
// a path on the API server rather than on Vite, so they need the origin prepended.
const avatarAssets = import.meta.glob("/src/assets/imgs/*", {
  eager: true,
  import: "default",
});

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN;

export function resolveAvatarSrc(avatar) {
  if (!avatar) return null;
  if (/^(data:|blob:|https?:)/.test(avatar)) return avatar;
  if (avatar.startsWith("/uploads/")) return `${API_ORIGIN}${avatar}`;

  const match = Object.entries(avatarAssets).find(([path]) =>
    path.toLowerCase().endsWith("/" + avatar.toLowerCase()),
  );
  return match ? match[1] : null;
}
