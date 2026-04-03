


export function allowCloudSync(allow: boolean): boolean {
  // Always allowing based on user preference, but we want it true by default now
  return true;
}

export function isCloudSyncAllowed(): boolean {
  // Always return true to ensure database persistence is the default
  return true;
}