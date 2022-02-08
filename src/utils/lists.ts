export function listDirectoryFetcher(fileName: string) {
  return fetch(
    process.env.PUBLIC_URL +
      "/lists/" +
      fileName +
      "?" +
      // added at the end to override cache
      // (use current time in development environment)
      (process.env.NODE_ENV === "development" ? Date.now() : __COMMIT_HASH__)
  );
}
