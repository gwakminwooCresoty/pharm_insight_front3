import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  html: {
    // 초기 로드 타이틀. 런타임에서 App.tsx의 BRANDING.serviceName으로 덮어씀.
    title: 'PharmInsight',
  },
  plugins: [pluginReact()],
  resolve: {
    alias: { '@': './src' },
  },
});
