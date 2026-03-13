//set the url of the server you want to test your code with and start the development server using the following command:
// ng serve --proxy-config ./proxy/proxy.conf.mjs
const environments = {
  'example': 'https://myPrimoVE.com',
  'sandbox': 'https://umn-psb.primo.exlibrisgroup.com',
  'production': 'https://primo.lib.umn.edu',
}

export const PROXY_TARGET = environments['sandbox'];
