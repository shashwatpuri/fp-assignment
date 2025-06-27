import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

const env = loadEnv("production", process.cwd(), '');
const remoteModuleUrl = env.VITE_REMOTE_MODULE_URL || "http://localhost:5174";


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'maincontainer',
      remotes: {
        microfrontend: `${remoteModuleUrl}/assets/remoteEntry.js`
        // microfrontend: `http://localhost:4173/assets/remoteEntry.js`
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
