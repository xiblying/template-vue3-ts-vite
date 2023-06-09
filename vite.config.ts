import type { PluginOption } from 'vite'
import { join } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue' // vue文件编译
import vueJsx from '@vitejs/plugin-vue-jsx' // JSX语法编写组件
import { createHtmlPlugin } from 'vite-plugin-html' // HTML 压缩能力;EJS 模版能力;多页应用支持;支持自定义entry;支持自定义template
import { viteMockServe } from 'vite-plugin-mock' // https://github.com/vbenjs/vite-plugin-mock
import compress from 'vite-plugin-compression' // https://github.com/anncwb/vite-plugin-compression
import visualizer from 'rollup-plugin-visualizer'
import dayjs from 'dayjs'
import pkg from './package.json'

// 应用信息
const __APP_INFO__ = {
  name: pkg.name, // 应用名
  pkgName: pkg.name, // 包名
  version: pkg.version, // 版本号
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss') // 打包时间
}

// 加载插件
const loadPlugins = options => {
  const { command, mode } = options
  const isBuild = command === 'build'
  const env = loadEnv(mode, process.cwd())

  const plugins: PluginOption = [
    vue(),
    vueJsx(),
    createHtmlPlugin({
      minify: isBuild,
      inject: {
        data: {
          title: __APP_INFO__.name
        }
      }
    })
  ]
  // Mock
  if (env.VITE_ENABLE_MOCK === 'true') {
    plugins.push(
      viteMockServe({
        mockPath: 'mock',
        ignore: /^_/
      })
    )
  }
  if (isBuild) {
    // 文件压缩
    plugins.push(
      // gzip
      compress({
        ext: '.gz',
        deleteOriginFile: false
      }),
      // brotli
      compress({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile: false
      })
    )
  }
  // 打包分析
  if (mode === 'analyze') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true
      }) as PluginOption
    )
  }

  return plugins
}

// https://vitejs.dev/config/
export default defineConfig(options => {
  const { mode } = options
  const env = loadEnv(mode, process.cwd())

  // 更新应用名
  if (env.VITE_APP_NAME) {
    __APP_INFO__.name = env.VITE_APP_NAME
  }

  return {
    base: '/vue3/',
    // 定义全局常量
    define: {
      __APP_INFO__
    },
    plugins: loadPlugins(options),
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: join(process.cwd(), '/src/')
        },
        {
          find: /#\//,
          replacement: join(process.cwd(), '/types/')
        }
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    // 开发服务器
    server: {
      host: true,
      port: 8888,
      strictPort: true,
      open: true,
      // 代理
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: 'http://localhost:8080/api',
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp('^' + env.VITE_API_BASE_URL), '')
        }
      }
    },
    esbuild: {
      pure: ['console.log', 'debugger']
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      chunkSizeWarningLimit: 1000,
      // https://rollupjs.org/configuration-options/
      rollupOptions: {
        output: {
          // 自定义公共 chunk
          manualChunks: {
            vue3: ['vue', 'vue-router', 'pinia']
          },
          // 用于指定 chunks 的入口文件模式
          entryFileNames: 'js/[name]-[hash].js',
          // 用于对代码分割中产生的 chunk 自定义命名
          chunkFileNames: 'js/[name]-[hash].js',
          // 用于自定义构建结果中的静态资源名称 https://cn.rollupjs.org/configuration-options/#output-assetfilenames
          assetFileNames: assetInfo => {
            const name = assetInfo.name || ''
            // css
            if (name.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            // assets
            const index = name.indexOf('assets/')
            if (index > -1) {
              // 按所在路径输出
              return name.substring(index, name.lastIndexOf('/') + 1) + '[name]-[hash][extname]'
            }
            return 'assets/[ext]/[name]-[hash][extname]'
          }
        }
      }
    }
  }
})
