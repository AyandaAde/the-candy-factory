/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com", 
    hostname: "utfs.io"
  }],
  },
};

module.exports = nextConfig;

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  }
}
