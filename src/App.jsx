// IBM Plex Sans - All Weights
import '@fontsource/ibm-plex-sans/400.css';  // Normal weight
import '@fontsource/ibm-plex-sans/500.css';  // Medium weight
import '@fontsource/ibm-plex-sans/600.css';  // Semi-bold weight
import '@fontsource/ibm-plex-sans/700.css';  // Bold weight

// IBM Plex Serif - Only Normal and Bold
import '@fontsource/ibm-plex-serif/400.css';  // Normal weight
import '@fontsource/ibm-plex-serif/700.css';  // Bold weight

// IBM Plex Mono - Only Normal and Bold
import '@fontsource/ibm-plex-mono/400.css';  // Normal weight
import '@fontsource/ibm-plex-mono/700.css';  // Bold weight

import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import GermanForm from "./pages/GermanForm";
import AdehyemanForm from "./pages/AdehyemanForm";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { Provider } from 'react-redux';
import store from './store/store';
import Applicants from "./pages/Applicants";
import Analysis from "./pages/Analysis";
import Products from './pages/Products';
import ApplicantAnalysis from './pages/ApplicantAnalysis';
import Loans from './pages/Loans';
import Login from './pages/Login';
import UserContext from './contexts/UserContext';
import { useState, useContext } from 'react';
import Register from './pages/Register';

function ProtectedLayout() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/" />;
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Provider store={store}>
      <UserContext.Provider value={{ user, setUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/products" element={<Products />} />
              <Route path="/loans" element={<Loans />} />
              <Route path="/applicant-analysis" element={<ApplicantAnalysis />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/forms" element={<Landing />} />
              <Route path="/german" element={<GermanForm />} />
              <Route path="/adehyeman" element={<AdehyemanForm />} />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
