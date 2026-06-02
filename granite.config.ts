import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 콘솔의 appName과 동일해야 해요 (딥링크 intoss://ddongssalddae)
  appName: 'ddongssalddae',
  brand: {
    displayName: '똥쌀때',
    primaryColor: '#3182F6',
    icon: 'https://ddongssalddae.vercel.app/favicon.svg',
  },
  // 카메라·위치 등 네이티브 권한을 쓰지 않는 순수 웹앱이라 비워둬요.
  permissions: [],
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  // vite 기본 출력 디렉터리
  outdir: 'dist',
});
