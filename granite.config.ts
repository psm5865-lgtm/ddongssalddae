import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  // 콘솔의 appName과 동일해야 해요 (딥링크 intoss://ddongssalddae)
  appName: 'ddongssalddae',
  brand: {
    displayName: '똥쌀때',
    primaryColor: '#3182F6',
    // Vercel 배포가 죽어 SVG가 404 → 로고 안 뜸. 공개 GitHub repo를 jsDelivr CDN으로
    // 안정 서빙하는 PNG로 교체(Vercel 의존 제거).
    icon: 'https://cdn.jsdelivr.net/gh/psm5865-lgtm/ddongssalddae@main/public/icon-512.png',
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
