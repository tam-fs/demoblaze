import { readFileSync } from 'fs';
import path from 'path';

export class JSONHandling {
  readJSONFile(relativeOrAbsolutePath: string): any {
    try {
      const absolutePath = path.isAbsolute(relativeOrAbsolutePath)
        ? relativeOrAbsolutePath
        : path.resolve(process.cwd(), relativeOrAbsolutePath);

      const raw = readFileSync(absolutePath, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error(`JSONHandling.readJSONFile failed for ${relativeOrAbsolutePath}:`, err);
      throw err;
    }
  }
}
