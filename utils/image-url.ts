/**
 * Utility function to handle token image URLs
 * Handles both full S3 URLs and relative paths for backwards compatibility
 */
export function getTokenImageUrl(
  imageField: string | null | undefined,
): string {
  if (!imageField) {
    return '';
  }

  // If it's already a full URL (starts with http:// or https://), return as-is
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField;
  }

  // If it's a relative path, construct the full path
  // This handles legacy data that might still have just filenames
  if (!imageField.startsWith('/')) {
    return `/images/tokens/${imageField}`;
  }

  // If it starts with /, it's already a valid path
  return imageField;
}

/**
 * Utility function to handle flywheel image URLs
 * Handles both full S3 URLs and relative paths for backwards compatibility
 */
export function getFlywheelImageUrl(
  imageField: string | null | undefined,
): string {
  if (!imageField) {
    return '';
  }

  // If it's already a full URL (starts with http:// or https://), return as-is
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField;
  }

  // If it's a relative path, construct the full path
  // This handles legacy data that might still have just filenames
  if (!imageField.startsWith('/')) {
    return `/images/flywheels/${imageField}`;
  }

  // If it starts with /, it's already a valid path
  return imageField;
}

/**
 * Utility function to handle technical analysis image URLs
 * Handles both full S3 URLs and relative paths for backwards compatibility
 */
export function getTechnicalAnalysisImageUrl(
  imageField: string | null | undefined,
): string {
  if (!imageField) {
    return '';
  }

  // If it's already a full URL (starts with http:// or https://), return as-is
  if (imageField.startsWith('http://') || imageField.startsWith('https://')) {
    return imageField;
  }

  // If it's a relative path, construct the full path
  // This handles legacy data that might still have just filenames
  if (!imageField.startsWith('/')) {
    return `/images/technical-analysis/${imageField}`;
  }

  // If it starts with /, it's already a valid path
  return imageField;
}
