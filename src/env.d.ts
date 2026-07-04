// oxlint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />

declare module "*?filepath" {
  const value: string;
  export default value;
}
