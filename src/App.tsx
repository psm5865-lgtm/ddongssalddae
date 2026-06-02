import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Session } from './screens/Session';
import { Complete } from './screens/Complete';
import { Settings } from './screens/Settings';
import { Journal } from './screens/Journal';
import { useSettings } from './store/settings';

function Gate({ element }: { element: JSX.Element }) {
  const [settings] = useSettings();
  if (!settings.onboarded) return <Navigate to="/" replace />;
  return element;
}

function Root() {
  const [settings] = useSettings();
  return settings.onboarded ? <Navigate to="/home" replace /> : <Onboarding />;
}

// 화면 이동 시 스크롤을 항상 맨 위로 — 스크롤 내린 채 이동하면
// 새 화면도 내려간 상태로 떠서 '안 넘어간 것처럼' 보이던 문제 해결
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    const frame = document.querySelector<HTMLElement>('.app-frame');
    frame?.scrollTo({ top: 0, left: 0 });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="app-frame">
      <ScrollReset />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/home" element={<Gate element={<Home />} />} />
        <Route path="/session" element={<Gate element={<Session />} />} />
        <Route path="/complete" element={<Gate element={<Complete />} />} />
        <Route path="/settings" element={<Gate element={<Settings />} />} />
        <Route path="/journal" element={<Gate element={<Journal />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
