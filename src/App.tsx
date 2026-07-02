import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LessonPage } from './pages/LessonPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useProgressStore } from './store/useProgressStore';

export default function App() {
  const syncHearts = useProgressStore((s) => s.syncHearts);

  // Regeneración perezosa de corazones: al montar y cada minuto
  useEffect(() => {
    syncHearts();
    const id = window.setInterval(syncHearts, 60_000);
    return () => window.clearInterval(id);
  }, [syncHearts]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lesson/:unitId/:lessonId" element={<LessonPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
