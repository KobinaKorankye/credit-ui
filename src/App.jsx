import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GermanForm from "./pages/GermanForm";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route
          path="forms/"
          element={user && !isAdmin ? <MainApp /> : <Navigate to={"/"} />}
        >
          <Route index path="" element={<Analytics />} />
          <Route path="layers" element={<Layers />} />
        </Route> */}
        <Route path="/forms" element={<Landing />} />
        <Route path="/german" element={<GermanForm />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
