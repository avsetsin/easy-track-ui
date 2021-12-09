const { createSecureHeaders } = require('next-secure-headers')

const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN
const supportedChains = process.env.SUPPORTED_CHAINS

let cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS || 'https://*.lido.fi'
const cspReportOnly = process.env.CSP_REPORT_ONLY === 'true'
const cspReportUri = process.env.CSP_REPORT_URI

module.exports = {
  basePath,
  webpack5: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg.react$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: { plugins: [{ removeViewBox: false }] },
            titleProp: true,
          },
        },
      ],
    })

    return config
  },
  async headers() {
    cspTrustedHosts = cspTrustedHosts.split(',')

    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              styleSrc: ["'self'", "'unsafe-inline'"],
              fontSrc: [
                "'self'",
                // 'https://fonts.gstatic.com',
                ...cspTrustedHosts,
              ],
              imgSrc: ["'self'", 'data:', ...cspTrustedHosts],
              scriptSrc: ["'self'", ...cspTrustedHosts],
              connectSrc: [
                "'self'",
                // 'https://api.thegraph.com',
                ...cspTrustedHosts,
              ],
              defaultSrc: ["'self'", ...cspTrustedHosts],
              reportURI: cspReportUri,
            },
          },
          reportOnly: cspReportOnly,
        }),
      },
    ]
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      }

      return config
    }
  },
  serverRuntimeConfig: {
    basePath,
    infuraApiKey,
    alchemyApiKey,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
  },
}
