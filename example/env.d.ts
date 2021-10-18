interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_MAGIC_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
