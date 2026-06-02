import { Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <div className="app-frame">
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
