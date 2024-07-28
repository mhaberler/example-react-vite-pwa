import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";
import { compression } from "vite-plugin-compression2";

// https://vitejs.dev/config/
export default defineConfig({
  base: 'example-react-vite-pwa', // <--- 👀
  // https://stackoverflow.com/questions/71255838/shorten-file-names-in-react-build-directory-to-less-than-32-chars
  // build: {
  //   rollupOptions: {
  //     output: {
  //       assetFileNames: "a/[hash:10][extname]",
  //       chunkFileNames: "c/[hash:10].js",
  //       entryFileNames: "e/[hash:10].js"
  //     }
  //   }
  // },
  plugins: [
    react(),
    svgr(),
    compression({ include: /\.js$/i, deleteOriginalAssets: true }),
    VitePWA({
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,wav,mp3,gltf,bin,eot,ttf,woff,woff2,txt,json}",
        ],
        maximumFileSizeToCacheInBytes: 25097152,
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Example React Vite PWA', // <--- 👀
        short_name: 'React Vite PWA', // <--- 👀
        description: 'Description', // <--- 👀
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})


