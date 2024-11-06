"use strict";

exports.__esModule = true;
exports.getMimeType = getMimeType;
// If send option {extension: true} it will return the extension for the mimeType

function getMimeType(filePath, options = {}) {
  const mimeTypes = {
    // Image files
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    // Document files
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain',
    '.rtf': 'application/rtf',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.csv': 'text/csv',
    '.json': 'application/json',
    '.geojson': 'application/geo+json',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.xml': 'application/xml',
    '.md': 'text/markdown',
    // Audio files
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    // Video files
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.mov': 'video/quicktime',
    '.wmv': 'video/x-ms-wmv',
    '.flv': 'video/x-flv',
    '.webm': 'video/webm',
    '.mpeg': 'video/mpeg',
    // Archive files
    '.zip': 'application/zip',
    '.rar': 'application/vnd.rar',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.7z': 'application/x-7z-compressed',
    // Font files
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    // Executable files
    '.exe': 'application/vnd.microsoft.portable-executable',
    '.bin': 'application/octet-stream',
    '.msi': 'application/x-msdownload',
    '.dll': 'application/x-msdownload',
    // Web files
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jsonld': 'application/ld+json',
    // Database files
    '.db': 'application/x-sqlite3',
    '.sql': 'application/sql',
    '.accdb': 'application/msaccess',
    // CAD files
    '.dwg': 'image/vnd.dwg',
    '.dxf': 'image/vnd.dxf',
    // GIS files
    '.shp': 'application/octet-stream',
    // Config files
    '.ini': 'text/plain',
    '.cfg': 'text/plain',
    '.conf': 'text/plain',
    // Log files
    '.log': 'text/plain',
    // Script files
    '.sh': 'application/x-sh',
    '.bat': 'application/x-msdos-program',
    '.py': 'application/x-python',
    // Application files
    '.apk': 'application/vnd.android.package-archive',
    '.ipa': 'application/octet-stream',
    '.jar': 'application/java-archive',
    // System files
    '.sys': 'application/octet-stream',
    '.bak': 'application/octet-stream',
    // Large data files
    '.zarr': 'application/x-zarr',
    '.nc': 'application/x-netcdf',
    '.h5': 'application/x-hdf5',
    '.hdf': 'application/x-hdf',
    '.h4': 'application/x-hdf4',
    '.bin': 'application/octet-stream',
    '.npz': 'application/x-npz'
  };
  if (options.extension) {
    // Reverse the mimeTypes object to find the extension for the given MIME type
    const mimeTypeToExtension = Object.entries(mimeTypes).reduce((acc, [ext, type]) => {
      acc[type] = ext;
      return acc;
    }, {});
    return mimeTypeToExtension[filePath] || null;
  }

  // Extract the file extension from the file path
  const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();

  // Look up the MIME type based on the file extension
  const mimeType = mimeTypes[extension];

  // Return the MIME type, or a default type if the extension is not recognized
  return mimeType || 'application/octet-stream';
}