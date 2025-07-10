/**
 * A cache item with data type T and optional expiry time.
 */
interface CacheItem<T> {
  /**
   * The data to be cached.
   */
  data: T;
  /**
   * The expiry unix timestamp (in milliseconds).
   */
  expiry?: number;
}

/**
 * A utility class for managing cached data with expiration support.
 */
export class CacheUtils {
  /**
   * Set cache item.
   * @param key The unique key of the cached item.
   * @param data The data to be cached.
   * @param expiryTime (Optional) The time in milliseconds after which the cache expires.
   */
  static setCache<T>(key: string, data: T, expiryTime?: number): void {
    if (!key) {
      throw new Error("Key is required");
    }

    const cacheItem: CacheItem<T> = {
      data,
    };

    if (expiryTime) {
      cacheItem.expiry = Date.now() + expiryTime;
    }

    try {
      localStorage.setItem(`cache-${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      throw new Error("Failed to set cache");
    }
  }

  /**
   * Retrieve cache item.
   * @param key The unique key of the cached item.
   * @returns The cached data, or null if not found or expired.
   */
  static getCache<T>(key: string): T | null {
    if (!key) {
      throw new Error("key is required");
    }

    try {
      const cacheData = localStorage.getItem(`cache-${key}`);
      if (cacheData) {
        const cacheItem = JSON.parse(cacheData) as CacheItem<T>;
        if (cacheItem.expiry && Date.now() > cacheItem.expiry) {
          CacheUtils.cleanCache(key);
          return null;
        }
        return cacheItem.data;
      }
      return null;
    } catch (error) {
      throw new Error("Failed to get cache");
    }
  }

  /**
   * Remove item from the cache.
   * @param key Key to remove a specific item.
   */
  static cleanCache(key: string): void {
    try {
      localStorage.removeItem(`cache-${key}`);
    } catch (error) {
      throw new Error("Failed to clean cache");
    }
  }
}
