import { defineConfig } from 'umi'

export default defineConfig({
  hash: true,
  outputPath: '../../output',
  publicPath: './',
  history: {
    type: 'hash',
  },
  title: 'Electron Awesome',
  antd: {},
  webpack5: {},
  dynamicImport: {},
  mfsu: {},
  chainWebpack(config, { webpack }) {
    config
      .target('electron-renderer')
      .plugin('DefinePlugin')
      .use(webpack['DefinePlugin'], [
        {
          $dirname: '__dirname',
        },
      ])
  },
})
