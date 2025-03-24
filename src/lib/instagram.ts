// This file is kept for compatibility but no longer contains sensitive credentials
// The Instagram integration has been replaced with a standard gallery component

// Placeholder values - these are not real credentials
const INSTAGRAM_APP_ID = 'placeholder-app-id';
const INSTAGRAM_APP_SECRET = 'placeholder-app-secret';
const INSTAGRAM_REDIRECT_URI = window.location.origin + '/auth/instagram/callback';
let INSTAGRAM_ACCESS_TOKEN = '';

// Add debug logging
const debug = (message: string, data?: any) => {
  console.log(`[Gallery] ${message}`, data || '');
};

/**
 * Placeholder function that would fetch Instagram posts
 * This is kept for compatibility but is no longer used
 */
export async function fetchInstagramPosts() {
  debug('fetchInstagramPosts called - this is a placeholder function');
  return [];
}

/**
 * Placeholder function that would initiate Instagram authentication
 * This is kept for compatibility but is no longer used
 */
export function initiateInstagramAuth() {
  debug('initiateInstagramAuth called - this is a placeholder function');
  console.log('Instagram integration has been replaced with a standard gallery');
}

/**
 * Placeholder function that would handle Instagram callback
 * This is kept for compatibility but is no longer used
 */
export async function handleInstagramCallback(code: string, state: string) {
  debug('handleInstagramCallback called - this is a placeholder function');
  return { success: false, message: 'Instagram integration has been replaced' };
}

/**
 * Placeholder function that would check for Instagram token
 * This is kept for compatibility but is no longer used
 */
export function hasInstagramToken() {
  debug('hasInstagramToken called - this is a placeholder function');
  return false;
}

/**
 * Formats a date string relative to the current date
 * This is kept for compatibility
 */
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
