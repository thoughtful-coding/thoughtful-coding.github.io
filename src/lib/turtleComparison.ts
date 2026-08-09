import pixelmatch from "pixelmatch";

/**
 * Result of comparing two turtle graphics images
 */
export interface TurtleComparisonResult {
  /** Similarity score between 0.0 (completely different) and 1.0 (identical) */
  similarity: number;
  /** Whether the comparison passed based on the threshold */
  passed: boolean;
  /** Number of pixels that differ between the images */
  numDiffPixels: number;
  /** Total number of pixels compared */
  totalPixels: number;
  /** Optional diff image data showing differences (if requested) */
  diffImageData?: ImageData;
}

/**
 * Options for turtle image comparison
 */
export interface TurtleComparisonOptions {
  /** Similarity threshold (0.0-1.0) required to pass. Default: 0.95 */
  threshold?: number;
  /** Whether to generate a diff image highlighting differences. Default: false */
  includeDiff?: boolean;
  /** Pixel difference threshold for pixelmatch (0.0-1.0). Default: 0.1 */
  pixelThreshold?: number;
}

/**
 * Loads an image from a URL or data URL and converts it to ImageData
 */
async function loadImageData(imageSrc: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Handle CORS if needed

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get 2D context for image loading"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image from: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
}

/**
 * Compares a student's turtle drawing against a reference image
 *
 * @param studentCanvasDataURL - Data URL from student's turtle canvas (PNG format)
 * @param referenceImagePath - Path to reference image (e.g., "data/07_loops_advanced/images/turtle-square-100.png")
 * @param options - Comparison options including threshold and diff generation
 * @returns Comparison result with similarity score and pass/fail status
 *
 * @example
 * ```typescript
 * const result = await compareTurtleImages(
 *   studentCanvas.toDataURL('image/png'),
 *   'data/07_loops_advanced/images/turtle-square-100.png',
 *   { threshold: 0.95, includeDiff: true }
 * );
 *
 * if (result.passed) {
 *   console.log(`Test passed! ${(result.similarity * 100).toFixed(1)}% match`);
 * } else {
 *   console.log(`Test failed. Only ${(result.similarity * 100).toFixed(1)}% match`);
 * }
 * ```
 */
export async function compareTurtleImages(
  studentCanvasDataURL: string,
  referenceImagePath: string,
  options: TurtleComparisonOptions = {}
): Promise<TurtleComparisonResult> {
  const {
    threshold = 0.95,
    includeDiff = false,
    pixelThreshold = 0.1,
  } = options;

  // Load both images
  const [studentImageData, referenceImageData] = await Promise.all([
    loadImageData(studentCanvasDataURL),
    loadImageData(referenceImagePath),
  ]);

  // Validate dimensions match
  if (
    studentImageData.width !== referenceImageData.width ||
    studentImageData.height !== referenceImageData.height
  ) {
    throw new Error(
      `Image dimensions don't match. Student: ${studentImageData.width}x${studentImageData.height}, Reference: ${referenceImageData.width}x${referenceImageData.height}`
    );
  }

  const width = studentImageData.width;
  const height = studentImageData.height;
  const totalPixels = width * height;

  // Create diff image data if requested
  let diffImageData: ImageData | undefined;
  let diffData: Uint8ClampedArray | null = null;

  if (includeDiff) {
    diffImageData = new ImageData(width, height);
    diffData = diffImageData.data;
  }

  // Compare images using pixelmatch
  const numDiffPixels = pixelmatch(
    studentImageData.data,
    referenceImageData.data,
    diffData ?? undefined,
    width,
    height,
    {
      threshold: pixelThreshold,
      includeAA: true, // Include anti-aliasing differences
    }
  );

  // Calculate similarity score
  const similarity = 1 - numDiffPixels / totalPixels;
  const passed = similarity >= threshold;

  return {
    similarity,
    passed,
    numDiffPixels,
    totalPixels,
    diffImageData,
  };
}

/**
 * Converts ImageData to a data URL for display
 * Useful for showing the diff image in the UI
 */
export function imageDataToDataURL(imageData: ImageData): string {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context for ImageData conversion");
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
