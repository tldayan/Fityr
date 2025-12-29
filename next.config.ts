import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, 
  },

images: {
  domains: [
    "api.dicebear.com",
    "ui-avatars.com",
    "www.bentleymotors.com",
    "fitness-project-tldayan.s3.us-east-1.amazonaws.com", 
    "event-banners-tldayan-project.s3.us-east-1.amazonaws.com",
  ],
},



  webpack(config: WebpackConfig) {

    config.module?.rules?.forEach((rule: any) => {
      if (rule?.test?.toString().includes("svg")) {
        rule.exclude = /\.svg$/i;
      }
    });


    config.module?.rules?.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
