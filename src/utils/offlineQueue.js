const STORAGE_PREFIX = "offlineQueue:";
export const OFFLINE_QUEUE_TYPES = {
  USER_REGISTRATION: "user-registration",
};

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

const getQueueKey = (type) => `${STORAGE_PREFIX}${type}`;

const parseQueue = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry) => entry && typeof entry === "object" && entry.id);
  } catch {
    return [];
  }
};

const readQueue = (type) => {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(getQueueKey(type));
    return parseQueue(stored);
  } catch {
    return [];
  }
};

const writeQueue = (type, queue) => {
  if (!isBrowser()) return;

  const key = getQueueKey(type);

  try {
    if (!queue.length) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(queue));
  } catch {
    /* empty */
  }
};

const createQueueEntry = (type, payload) => ({
  id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  type,
  payload,
  createdAt: new Date().toISOString(),
});

export const enqueueOfflineRequest = (type, payload) => {
  if (!type) return null;

  const queue = readQueue(type);
  const entry = createQueueEntry(type, payload);
  queue.push(entry);
  writeQueue(type, queue);
  return entry;
};

export const getOfflineQueue = (type) => readQueue(type);

export const removeOfflineEntries = (type, entryIds = []) => {
  if (!entryIds || (Array.isArray(entryIds) && entryIds.length === 0)) return;

  const ids = new Set(Array.isArray(entryIds) ? entryIds : [entryIds]);
  const queue = readQueue(type);
  const updatedQueue = queue.filter((entry) => !ids.has(entry.id));
  writeQueue(type, updatedQueue);
};

export const clearOfflineQueue = (type) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(getQueueKey(type));
  } catch {
    /* empty */
  }
};

export const getAllOfflineEntries = () => {
  if (!isBrowser()) return [];

  try {
    const entries = [];
    Object.values(OFFLINE_QUEUE_TYPES).forEach((type) => {
      const queue = readQueue(type);
      entries.push(...queue);
    });
    return entries;
  } catch {
    return [];
  }
};
