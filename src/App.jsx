import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GermanForm from "./pages/GermanForm";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/german" element={<GermanForm />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
