// Uploaded avatars have nowhere to live on the server yet (the Students model
// has no avatar column), so they are cached per-browser under a single key.
const readStore = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

export function loadStoredAvatars(key) {
  return readStore(key);
}

export function withStoredAvatars(key, list) {
  const stored = readStore(key);
  return list.map((s) => (stored[s.id] ? { ...s, avatar: stored[s.id] } : s));
}

/**
 * Best-effort write; returns true when the avatar was stored.
 *
 * localStorage is a hard ~5MB per origin, so this can fail. Losing a cached
 * thumbnail is recoverable, losing the student record is not — evict older
 * entries and retry rather than letting the exception abort the caller.
 */
export function persistAvatar(key, id, dataUrl) {
  const stored = readStore(key);
  if (dataUrl) stored[id] = dataUrl;
  else delete stored[id];

  const evictable = Object.keys(stored).filter((k) => k !== id);

  for (;;) {
    try {
      localStorage.setItem(key, JSON.stringify(stored));
      return true;
    } catch (error) {
      if (evictable.length === 0) {
        console.warn("Could not cache avatar locally", error);
        return false;
      }
      delete stored[evictable.shift()];
    }
  }
}
