import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'

const tamaguiConfig = {
  components: ['tamagui'],
  config: 'src/tamagui.config.ts',
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    tamaguiPlugin(tamaguiConfig),
    process.env.NODE_ENV === 'production' ? tamaguiExtractPlugin(tamaguiConfig) : null,
  ].filter(Boolean),
})
