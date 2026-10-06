declare const __webpack_public_path__: string;

export function getRemoteModuleUrl(path = ''): URL {
  let baseUrl: string | undefined;

  try {
    if (typeof __webpack_public_path__ !== 'undefined') {
      baseUrl = __webpack_public_path__;
    }
  } catch {
    // no __webpack_public_path__ defined; try import.meta.url instead
  }

  if (!baseUrl) {
    try {
      baseUrl = import.meta?.url;
    } catch {
      // no import.meta.url defined; will fallback to current location
    }
  }

  const baseLocation = new URL(
    baseUrl || window.location.origin,
    window.location.href,
  );

  return new URL(path, baseLocation.origin);
}
