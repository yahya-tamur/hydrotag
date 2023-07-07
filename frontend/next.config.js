const nextConfig = {
    async headers() {
        return [
            {
                // matching all API routes
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" }
                ]
            }
        ]
    }
}

module.exports = {
    nextConfig,
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/posts/login',
                permanent: true,
            }
        ]
    }
}