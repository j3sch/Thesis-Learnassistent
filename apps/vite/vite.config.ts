import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tamaguiConfig from './src/tamagui.config.ts'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        TanStackRouterVite(),
        tamaguiPlugin(tamaguiConfig),
        process.env.NODE_ENV === 'production' ? tamaguiExtractPlugin(tamaguiConfig) : null,
    ].filter(Boolean),
})
