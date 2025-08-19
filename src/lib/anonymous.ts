import AsyncStorage from '@react-native-async-storage/async-storage';

const ANONYMOUS_USER_KEY = 'anonymous_user_id';

/**
 * Generates a unique anonymous user ID
 * Format: anon_${timestamp}_${randomString}
 */
function generateAnonymousId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomString}`;
}

/**
 * Gets the stored anonymous user ID or creates a new one
 * This ID persists across app sessions for consistent reaction tracking
 */
export async function getAnonymousUserId(): Promise<string> {
  try {
    let anonymousId = await AsyncStorage.getItem(ANONYMOUS_USER_KEY);
    
    if (!anonymousId) {
      anonymousId = generateAnonymousId();
      await AsyncStorage.setItem(ANONYMOUS_USER_KEY, anonymousId);
    }
    
    return anonymousId;
  } catch (error) {
    console.error('Error getting anonymous user ID:', error);
    // Fallback to session-only ID if AsyncStorage fails
    return generateAnonymousId();
  }
}

/**
 * Clears the stored anonymous user ID (useful for testing or reset)
 */
export async function clearAnonymousUserId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ANONYMOUS_USER_KEY);
  } catch (error) {
    console.error('Error clearing anonymous user ID:', error);
  }
}