/**
 * Utility functions for time calculations and formatting
 */

export interface TimeRemaining {
  isLocked: boolean;
  displayText: string;
  daysLeft: number;
  hoursLeft: number;
}

/**
 * Calculates and formats the time remaining until a note unlocks
 */
export function getTimeRemaining(unlockAt: number): TimeRemaining {
  const now = Date.now();
  const timeDiff = unlockAt - now;
  
  // If already unlocked
  if (timeDiff <= 0) {
    return {
      isLocked: false,
      displayText: 'Unlocked',
      daysLeft: 0,
      hoursLeft: 0,
    };
  }
  
  // Calculate days and hours with ceil for days (so newer posts can show 30 days)
  const DAY_MS = 1000 * 60 * 60 * 24;
  const daysLeftCeil = Math.ceil(timeDiff / DAY_MS);
  const hoursLeft = Math.floor((timeDiff % DAY_MS) / (1000 * 60 * 60));
  
  let displayText: string;
  
  if (timeDiff >= DAY_MS) {
    displayText = `${daysLeftCeil} day${daysLeftCeil !== 1 ? 's' : ''} left`;
  } else if (hoursLeft > 0) {
    displayText = `${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''} left`;
  } else {
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    if (minutesLeft > 0) {
      displayText = `${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} left`;
    } else {
      displayText = 'Less than 1 minute left';
    }
  }
  
  return {
    isLocked: true,
    displayText,
    daysLeft: daysLeftCeil,
    hoursLeft,
  };
}

/**
 * Gets a short version of time remaining for compact display
 */
export function getShortTimeRemaining(unlockAt: number): string {
  const timeInfo = getTimeRemaining(unlockAt);
  
  if (!timeInfo.isLocked) {
    return '🔓 Unlocked';
  }
  
  return `🔒 ${timeInfo.displayText}`;
}