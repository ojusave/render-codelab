/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_SESSION_CODE: string;
  readonly VITE_GITHUB_REPO_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
