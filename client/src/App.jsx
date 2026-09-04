import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Landing from './pages/Landing';
import ReportFormPage from './pages/ReportFormPage';
import ReportsListPage from './pages/ReportsListPage';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/report" element={<ReportFormPage />} />
        <Route path="/reports" element={<ReportsListPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
