import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import QueryWorkspace from './pages/QueryWorkspace';
import QueryHistory from './pages/QueryHistory';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workspace" element={<QueryWorkspace />} />
          <Route path="/history" element={<QueryHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;