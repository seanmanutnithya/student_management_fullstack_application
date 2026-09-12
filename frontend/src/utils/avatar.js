// Seed data (database/data.json) stores avatars as bare filenames (e.g. "stu001.jpg")
// that live in src/assets/imgs. Uploaded avatars are stored as data: URLs instead.
const avatarAssets = import.meta.glob("/src/assets/imgs/*", {
  eager: true,
  import: "default",
});

export function resolveAvatarSrc(avatar) {
  if (!avatar) return null;
  if (/^(data:|blob:|https?:)/.test(avatar)) return avatar;

  const match = Object.entries(avatarAssets).find(([path]) =>
    path.toLowerCase().endsWith("/" + avatar.toLowerCase()),
  );
  return match ? match[1] : null;
}
