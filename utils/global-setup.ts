import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

type LoadResult = {
  envName: string;
  loadedPath?: string;
  parsed?: dotenv.DotenvParseOutput | undefined;
  error?: string;
};

/**
 * Load environment variables from one of the .env files.
 * Resolution order (first existing one will be used):
 * 1. root/.env.<env> (where env comes from arg, TEST_ENV, npm config or CLI --env)
 * 2. root/.env
 * 3. If none found, nothing is loaded.
 *
 * It sets process.env for the loaded variables and returns a small report.
 */
export function loadEnvironment(envArg?: string): LoadResult {
  const cwd = process.cwd();

  // Determine desired env name from multiple possible sources.
  const cliArg = (() => {
    // support `--env=dev` or `--env dev` in process.argv
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a.startsWith("--env=")) return a.split("=")[1];
      if (a === "--env" && argv[i + 1]) return argv[i + 1];
    }
    return undefined;
  })();

  const envName = (
    envArg ||
    process.env.TEST_ENV ||
    process.env.ENV ||
    process.env.npm_config_env ||
    cliArg ||
    "stg"
  ).toLowerCase();

  if (process.env.CI) {
    // Đảm bảo TEST_ENV vẫn được set để logic phía sau dùng nếu cần
    process.env.TEST_ENV = envName;

    return {
      envName,
      loadedPath: "CI/CD Environment (GitHub Secrets)",
      parsed: process.env as any, // Trả về env hiện tại coi như đã parse xong
    };
  }

  const candidates = [
    path.join(cwd, `.env.${envName}`),
    path.join(cwd, ".env"),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const result = dotenv.config({ path: p });
      if (result.error) {
        return { envName, loadedPath: p, error: String(result.error) };
      }
      // ensure TEST_ENV is set for consistency
      process.env.TEST_ENV = envName;
      return { envName, loadedPath: p, parsed: result.parsed };
    }
  }

  return {
    envName,
    error: "No .env file found for candidates: " + candidates.join(", "),
  };
}

/** Default global setup for Playwright. */
export default async function globalSetup() {
  const res = loadEnvironment();
  if (res.loadedPath) {
    // small, clear logging for test runs
    // Use console.log because Playwright shows it in the run output
    // and it's helpful for debugging which env was loaded.
    // eslint-disable-next-line no-console
    console.log(
      `[global-setup] Loaded env '${res.envName}' from: ${res.loadedPath}`
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      `[global-setup] Did not find an env file for '${res.envName}'. ${
        res.error || ""
      }`
    );
  }

  // If you need to perform additional global setup (like generating storageState),
  // do it here and return a path string that Playwright will use.
  // For now we just load envs.
  return;
}
