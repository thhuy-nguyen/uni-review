/**
 * Storage configuration for the application
 * Contains settings for different storage buckets
 */

export const STORAGE_CONFIG = {
  UNIVERSITY_PHOTOS: {
    BUCKET_NAME: 'university-photos',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/gif']
  },
  RESUME_FILES: {
    BUCKET_NAME: 'resume-files',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
  }
};