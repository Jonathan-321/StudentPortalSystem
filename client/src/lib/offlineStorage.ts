import { openDB, IDBPDatabase } from 'idb';

// Define the database schema
interface UniversityPortalDB {
  user: {
    key: string;
    value: any;
  };
  courses: {
    key: number;
    value: any;
    indexes: { 'by-name': string };
  };
  academics: {
    key: number;
    value: any;
    indexes: { 'by-user': number };
  };
  tasks: {
    key: number;
    value: any;
    indexes: { 'by-user': number, 'by-due-date': Date };
  };
  notifications: {
    key: number;
    value: any;
    indexes: { 'by-user': number, 'read': boolean };
  };
  finances: {
    key: number;
    value: any;
    indexes: { 'by-user': number, 'by-due-date': Date };
  };
  announcements: {
    key: number;
    value: any;
  };
  offlineRequests: {
    key: string;
    value: {
      url: string;
      method: string;
      body: any;
      timestamp: number;
    };
  };
}

// Database version
const DB_VERSION = 1;
const DB_NAME = 'university-portal';

let dbPromise: Promise<IDBPDatabase<UniversityPortalDB>> | null = null;

// Initialize and get the database
async function getDB(): Promise<IDBPDatabase<UniversityPortalDB>> {
  if (!dbPromise) {
    dbPromise = openDB<UniversityPortalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores for all our data
        if (!db.objectStoreNames.contains('user')) {
          db.createObjectStore('user');
        }

        if (!db.objectStoreNames.contains('courses')) {
          const courseStore = db.createObjectStore('courses', { keyPath: 'id' });
          courseStore.createIndex('by-name', 'name');
        }

        if (!db.objectStoreNames.contains('academics')) {
          const academicsStore = db.createObjectStore('academics', { keyPath: 'id' });
          academicsStore.createIndex('by-user', 'userId');
        }

        if (!db.objectStoreNames.contains('tasks')) {
          const tasksStore = db.createObjectStore('tasks', { keyPath: 'id' });
          tasksStore.createIndex('by-user', 'userId');
          tasksStore.createIndex('by-due-date', 'dueDate');
        }

        if (!db.objectStoreNames.contains('notifications')) {
          const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
          notificationsStore.createIndex('by-user', 'userId');
          notificationsStore.createIndex('read', 'read');
        }

        if (!db.objectStoreNames.contains('finances')) {
          const financesStore = db.createObjectStore('finances', { keyPath: 'id' });
          financesStore.createIndex('by-user', 'userId');
          financesStore.createIndex('by-due-date', 'dueDate');
        }

        if (!db.objectStoreNames.contains('announcements')) {
          db.createObjectStore('announcements', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('offlineRequests')) {
          db.createObjectStore('offlineRequests', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }
  return dbPromise;
}

// Helper functions for common operations

// Cache user data
export async function cacheUser(userData: any): Promise<void> {
  const db = await getDB();
  await db.put('user', userData, 'currentUser');
}

// Get cached user data
export async function getCachedUser(): Promise<any | undefined> {
  const db = await getDB();
  return await db.get('user', 'currentUser');
}

// Store offline request to be synced later
export async function storeOfflineRequest(url: string, method: string, body: any): Promise<void> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains('offlineRequests')) {
      console.warn('offlineRequests store not found, creating it now');
      // We need to close the database to upgrade it
      db.close();
      
      // Increment the version and reopen
      dbPromise = openDB<UniversityPortalDB>(DB_NAME, DB_VERSION + 1, {
        upgrade(db) {
          // Create the missing object store
          if (!db.objectStoreNames.contains('offlineRequests')) {
            db.createObjectStore('offlineRequests', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      
      const newDb = await dbPromise;
      
      // Try adding the request again
      await newDb.add('offlineRequests', {
        url,
        method,
        body,
        timestamp: Date.now(),
      });
      
      return;
    }
    
    await db.add('offlineRequests', {
      url,
      method,
      body,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error storing offline request:', error);
  }
}

// Get all stored offline requests
export async function getOfflineRequests(): Promise<any[]> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains('offlineRequests')) {
      console.warn('offlineRequests store not found, creating it now');
      // We need to close the database to upgrade it
      db.close();
      
      // Increment the version and reopen
      dbPromise = openDB<UniversityPortalDB>(DB_NAME, DB_VERSION + 1, {
        upgrade(db) {
          // Create the missing object store
          if (!db.objectStoreNames.contains('offlineRequests')) {
            db.createObjectStore('offlineRequests', { keyPath: 'id', autoIncrement: true });
          }
        },
      });
      
      const newDb = await dbPromise;
      return [];
    }
    
    return await db.getAll('offlineRequests');
  } catch (error) {
    console.error('Error getting offline requests:', error);
    return [];
  }
}

// Delete an offline request after it's been processed
export async function deleteOfflineRequest(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('offlineRequests', id);
}

// Generic functions to cache and retrieve data

// Cache items in a store
export async function cacheItems(storeName: keyof UniversityPortalDB, items: any[]): Promise<void> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`${storeName} store not found, skipping cache operation`);
      return;
    }
    
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    
    for (const item of items) {
      await store.put(item);
    }
    
    await tx.done;
  } catch (error) {
    console.error(`Error caching items in ${storeName}:`, error);
  }
}

// Get all items from a store
export async function getAllItems<T>(storeName: keyof UniversityPortalDB): Promise<T[]> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`${storeName} store not found, returning empty array`);
      return [];
    }
    
    return await db.getAll(storeName);
  } catch (error) {
    console.error(`Error getting all items from ${storeName}:`, error);
    return [];
  }
}

// Get an item by ID
export async function getItemById<T>(storeName: keyof UniversityPortalDB, id: number): Promise<T | undefined> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`${storeName} store not found, returning undefined`);
      return undefined;
    }
    
    return await db.get(storeName, id);
  } catch (error) {
    console.error(`Error getting item by ID from ${storeName}:`, error);
    return undefined;
  }
}

// Delete an item
export async function deleteItem(storeName: keyof UniversityPortalDB, id: number): Promise<void> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains(storeName)) {
      console.warn(`${storeName} store not found, cannot delete item`);
      return;
    }
    
    await db.delete(storeName, id);
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
  }
}

// Clear all data
export async function clearAllData(): Promise<void> {
  try {
    const db = await getDB();
    const storeNames = Array.from(db.objectStoreNames);
    
    for (const storeName of storeNames) {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
      } catch (error) {
        console.error(`Error clearing ${storeName} store:`, error);
      }
    }
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

// Used during the logout process
export async function clearUserData(): Promise<void> {
  try {
    const db = await getDB();
    
    // Check if the object store exists
    if (!db.objectStoreNames.contains('user')) {
      console.warn('user store not found, cannot clear user data');
      return;
    }
    
    await db.delete('user', 'currentUser');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}

// Export the database helpers
export default {
  cacheUser,
  getCachedUser,
  storeOfflineRequest,
  getOfflineRequests,
  deleteOfflineRequest,
  cacheItems,
  getAllItems,
  getItemById,
  deleteItem,
  clearAllData,
  clearUserData,
};