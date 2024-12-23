export const END_POINTS = {
  BASE: '/api',
  FILE: {
    BASE: '/api/file',
    UPLOAD: '/upload',
    DOWNLOAD: '/download/:key',
    DELETE: '/delete/:key',
    PURGE: '/purge/:key',
  },
  MINIO: {
    BASE: "/api/minio",
    NOTIFY_URL: "/notify"
  }

}