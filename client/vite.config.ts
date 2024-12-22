import {defineConfig} from 'vite'
import {dirname} from "path";
import {fileURLToPath} from "url";
import solid from 'vite-plugin-solid'

import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
})

