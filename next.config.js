const withPWA = require('next-pwa')

module.exports = withPWA({
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV !== 'production'
    },
    webpack: config => {
        config.module.rules.unshift({
            test: /\.worker\.(js|ts)$/,
            loader: 'worker-loader',
            options: {
                name: 'static/[hash].worker.js',
                publicPath: '/_next/'
            }
        })

        config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`

        return config
    }
});