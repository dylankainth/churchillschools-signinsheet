export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'signin',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css',
      rel: 'stylesheet',
      integrity:
        'sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor',
      crossorigin: 'anonymous',
    }],
    script: [
      { src:"https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"},
      {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js',
        integrity:
          'sha384-pprn3073KE6tl6bjs2QrFaJGz5/SUsLqktiwsUTF55Jfv3qYSDhgCecCxMW52nD2',
        crossorigin: 'anonymous',
      },
      { src:"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  auth: {
    redirect: {
      callback: '/auth',
      login: '/auth/logon',
    },
    rewriteRedirects: true,
    strategies: {
      aad: {
        scheme: 'oauth2',
        endpoints: {
          authorization:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
          token:
            'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
          userInfo: '',
          logout: false,
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800,
          global: true,
          required: true,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: 'offline',
        // ******** change this for your Application (Client) ID ********
        clientId: '8c54d40a-b5d3-4057-94de-b784f3f5d993',
        codeChallengeMethod: 'S256',
        scope: ['openid', 'profile'],
        autoLogout: false,
      },
    },
  },
  ssr:false,
 
  
}
