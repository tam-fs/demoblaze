import { readFileSync } from "fs";
import path from "path";

export function readJson<T>(relativePath: string): T {
    const env = (process.env.TEST_ENV || "stg").toLowerCase();
    const absolutePath = path.resolve(process.cwd(), "data", relativePath);
    const raw = readFileSync(absolutePath, "utf-8");
    const data = JSON.parse(raw);
    
    if (!data[env]) {
        throw new Error(`No data found for environment: ${env}`);
    }
    return data[env] as T;
}
