import { PROXY_TARGET } from '../../libs/vendor/custom-module/proxy/proxy.const.mjs';
import vendorProxyRules from '../../libs/vendor/custom-module/proxy/proxy.conf.mjs';

// extend vendor dev server proxy configuration with custom rules
const customProxyRules = [
  {
    // redirect external login requests
    context: ['/primaws/suprimaExtLogin'],
    target: PROXY_TARGET,
    changeOrigin: true,
    followRedirects: true,
    onProxyReq(_proxyReq, req, res) {
      res.writeHead(302, { location: PROXY_TARGET + req.url });
    },
  },
];

export default [...customProxyRules, ...vendorProxyRules];
