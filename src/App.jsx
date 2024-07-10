import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GermanForm from "./pages/GermanForm";
import AdehyemanForm from "./pages/AdehyemanForm";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { fetchGraphData } from "./store/graphDataSlice";
import Applicants from "./pages/Applicants";
import Analysis from "./pages/Analysis";

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applicants" element={<Applicants />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/forms" element={<Landing />} />
          <Route path="/german" element={<GermanForm />} />
          <Route path="/adehyeman" element={<AdehyemanForm />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
