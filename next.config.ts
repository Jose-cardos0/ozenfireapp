import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    formats: ["image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ["@google/generative-ai"],
  },
  // Configurações para hospedagem estática
  assetPrefix: "",
  basePath: "",
  // Desabilitar algumas funcionalidades para hospedagem estática
  poweredByHeader: false,
  compress: false,
};

export default nextConfig;
