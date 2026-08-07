import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ONNX Runtime WASM files to be served and enable SharedArrayBuffer
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  // Make sure .onnx and .wasm files are served from public/
  serverExternalPackages: ["onnxruntime-node"],
};

export default nextConfig;
