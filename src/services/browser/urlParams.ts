/** Reading and cleaning the page's query string. */

/** Value of a query parameter of the current page, or null. */
export const readQueryParam = (name: string): string | null => new URLSearchParams(location.search).get(name);

/** Removes a query parameter from the address bar without reloading (so a refresh does not repeat the action). */
export function removeQueryParam(name: string): void {
  const url = new URL(location.href);
  url.searchParams.delete(name);
  history.replaceState(null, "", url.pathname + url.search + url.hash);
}

/** The app's address without query string or hash: the base for building links. */
export const appBaseUrl = (): string => location.origin + location.pathname;
