/**
 * Removes every CDK overlay container from the document.
 *
 * The runner may execute several spec files sequentially in ONE worker —
 * one shared jsdom document — and worker assignment depends on machine
 * core count, so a leak from a neighboring file is an ordering-dependent
 * failure that can appear only in CI. Overlay specs call this in BOTH
 * beforeEach (a file cannot trust its neighbors' hygiene) and afterEach
 * (leave the document as found). querySelectorAll, not querySelector:
 * containers accumulate, and removing only the oldest strands the one
 * that actually holds the leaked panel.
 *
 * Panel queries in overlay specs must also scope under
 * `.cdk-overlay-container` — a bare [data-slot=…] document query can
 * match a neighboring file's leaked fixture host, which no container
 * cleanup can ever remove.
 */
export const purgeOverlays = (): void => {
  document.querySelectorAll('.cdk-overlay-container').forEach((el) => el.remove());
};
