import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import ResearcherManagement from './pages/ResearcherManagement';
import ActivityLog from './pages/ActivityLog';
import AnalystWorkspace from './pages/AnalystWorkspace';
import ProjectDashboard from './pages/ProjectDashboard';
import useStore from './store/useStore';

function App() {
  const { userRole } = useStore();

  return (
    <Router>
      <MainLayout>
        <Routes>
          {userRole === 'admin' ? (
            <>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/researchers" element={<ResearcherManagement />} />
              <Route path="/activity" element={<ActivityLog />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ProjectDashboard />} />
              <Route path="/workspace/:projectId" element={<AnalystWorkspace />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;