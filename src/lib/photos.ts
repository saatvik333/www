import fs from 'fs';
import path from 'path';
import { imageSize } from 'image-size';

export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

/**
 * Auto-discovers images from /public/pics/ directory
 * Just drop images in that folder and they'll appear in the gallery
 */
export function getPhotos(): Photo[] {
  const picsDir = path.join(process.cwd(), 'public', 'pics');

  // Return empty array if directory doesn't exist
  if (!fs.existsSync(picsDir)) {
    return [];
  }

  const files = fs.readdirSync(picsDir);

  const photos: Photo[] = files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_EXTENSIONS.includes(ext);
    })
    .map((file, index) => {
      const filePath = path.join(picsDir, file);
      let width = 800;
      let height = 600;

      try {
        const buffer = fs.readFileSync(filePath);
        const dimensions = imageSize(buffer);
        if (dimensions.width && dimensions.height) {
          width = dimensions.width;
          height = dimensions.height;
        }
      } catch {
        // Use default dimensions if image-size fails
        console.warn(`Could not read dimensions for ${file}, using defaults`);
      }

      // Generate alt text from filename (remove extension, replace dashes/underscores)
      const baseName = path.basename(file, path.extname(file));
      const alt = baseName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

      return {
        id: `${index + 1}`,
        src: file,
        alt: alt || `Photo ${index + 1}`,
        width,
        height,
      };
    })
    // Sort by filename for consistent ordering
    .sort((a, b) => a.src.localeCompare(b.src));

  return photos;
}
