import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import SoilForm from './pages/SoilAnalysis/SoilForm';
import FertilizerForm from './pages/Fertilizer/FertilizerForm';
import WeatherDashboard from './pages/Weather/WeatherDashboard';
import DiseaseForm from './pages/DiseaseDetection/DiseaseForm';
import MaturityScanner from './pages/Maturity/MaturityScanner';
import PriceDashboard from './pages/PricePrediction/PriceDashboard';
import AgriBot from './pages/Chat/AgriBot';
import SchemesDashboard from './pages/Schemes/SchemesDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CropCalendar from './pages/Calendar/CropCalendar';

import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={<PrivateRoute><Dashboard /></PrivateRoute>} 
        />
        <Route 
          path="/soil" 
          element={<PrivateRoute><SoilForm /></PrivateRoute>} 
        />
        <Route 
          path="/fertilizer" 
          element={<PrivateRoute><FertilizerForm /></PrivateRoute>} 
        />
        <Route 
          path="/weather" 
          element={<PrivateRoute><WeatherDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/disease" 
          element={<PrivateRoute><DiseaseForm /></PrivateRoute>} 
        />
        <Route 
          path="/maturity" 
          element={<PrivateRoute><MaturityScanner /></PrivateRoute>} 
        />
        <Route 
          path="/price" 
          element={<PrivateRoute><PriceDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/chat" 
          element={<PrivateRoute><AgriBot /></PrivateRoute>} 
        />
        <Route 
          path="/schemes" 
          element={<PrivateRoute><SchemesDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/admin" 
          element={<PrivateRoute><AdminDashboard /></PrivateRoute>} 
        />
        <Route 
          path="/calendar" 
          element={<PrivateRoute><CropCalendar /></PrivateRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;
