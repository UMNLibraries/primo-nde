const ILLIAD_BASE_URL = 'https://umn.illiad.oclc.org/illiad/illiad.dll';
const PROXY_BASE_URL = 'https://ezproxy.lib.umn.edu/login?qurl=';

function proxyUrl(url: string): string {
  return PROXY_BASE_URL + encodeURIComponent(url);
}

/**
 * Returns the ILLiad URL for a given request (or the "on order requests" page
 * if no transaction number is provided).
 * @param {number} txnNum (optional) An ILLiad transaction number for a request
 */
export function requestPageUrl(txnNum?: number): string {
  return txnNum
    ? proxyUrl(`${ILLIAD_BASE_URL}?Action=10&Form=63&Value=${txnNum}`)
    : proxyUrl(`${ILLIAD_BASE_URL}?Action=10&Form=62`);
}

/**
 * Returns the URL for a given article (or the "available online" page if no
 * transaction number is provided).
 * @param {number} txnNum (optional) An ILLiad transaction number for an article
 */
export function articlePageUrl(txnNum?: number): string {
  return txnNum
    ? proxyUrl(`${ILLIAD_BASE_URL}?Action=10&Form=75&Value=${txnNum}`)
    : proxyUrl(`${ILLIAD_BASE_URL}?Action=10&Form=64`);
}
