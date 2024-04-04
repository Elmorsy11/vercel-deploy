/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  i18n,
  keySeparator: ".",
  returnEmptyString: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
