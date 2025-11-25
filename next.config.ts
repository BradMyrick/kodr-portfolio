import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Turbopack config - empty to silence warning
  turbopack: {},

  // Webpack config for WASM support
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
