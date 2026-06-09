import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HRCompassButton from './components/hrCompass/HRCompassButton';
import HRCompassDrawer from './components/hrCompass/HRCompassDrawer';
import HRDashboard from './pages/HRDashboard';
import NewHireView from './pages/NewHireView';
import ManagerView from './pages/ManagerView';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import HRCompassPage from './pages/HRCompassPage';

const COMPASS_INITIAL = [{
  role: 'assistant',
  content: "Hello! I'm HR Compass, your dedicated HR assistant for Acme Manufacturing Co. I can answer questions about your benefits, Arizona and federal employment law, payroll, PTO, and onboarding. What can I help you with today?",
  sources: [],
}];

export default function App() {
  const location = useLocation();
  const [compassOpen, setCompassOpen] = useState(false);
  const [compassMessages, setCompassMessages] = useState(COMPASS_INITIAL);

  const isCompassPage = location.pathname === '/compass';

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HRDashboard />} />
          <Route path="/hire/:employeeId" element={<NewHireView />} />
          <Route path="/manager" element={<ManagerView />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route
            path="/compass"
            element={
              <HRCompassPage
                sharedMessages={compassMessages}
                setSharedMessages={setCompassMessages}
              />
            }
          />
        </Routes>
      </Layout>

      {!isCompassPage && (
        <>
          <HRCompassButton onClick={() => setCompassOpen(true)} />
          <HRCompassDrawer
            isOpen={compassOpen}
            onClose={() => setCompassOpen(false)}
            messages={compassMessages}
            setMessages={setCompassMessages}
          />
        </>
      )}
    </>
  );
}
