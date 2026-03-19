// Inter - All Weights
import '@fontsource/inter/400.css';  // Normal weight
import '@fontsource/inter/500.css';  // Medium weight
import '@fontsource/inter/600.css';  // Semi-bold weight
import '@fontsource/inter/700.css';  // Bold weight

// Manrope - All Weights
import '@fontsource/manrope/400.css';  // Normal weight
import '@fontsource/manrope/500.css';  // Medium weight
import '@fontsource/manrope/600.css';  // Semi-bold weight
import '@fontsource/manrope/700.css';  // Bold weight

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
import AddApplicant from './pages/AddApplicant';
import Settings from './pages/Settings';
import { ThemeProvider } from './contexts/ThemeContext';

function ProtectedLayout() {
  const { user } = useContext(UserContext);
  return user ? <Outlet /> : <Navigate to="/" />;
}

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('credit-ui-user');
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='transflow-light' storageKey='credit-ui-theme'>
        <UserContext.Provider value={{ user, setUser }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/applicants" element={<Applicants />} />
                <Route path="/add-applicant" element={<AddApplicant />} />
                <Route path="/products" element={<Products />} />
                <Route path="/loans" element={<Loans />} />
                <Route path="/applicant-analysis" element={<ApplicantAnalysis />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/forms" element={<Landing />} />
                <Route path="/german" element={<GermanForm />} />
                <Route path="/adehyeman" element={<AdehyemanForm />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </UserContext.Provider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
