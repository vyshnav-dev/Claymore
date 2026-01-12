import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAlert } from "./component/Alerts/AlertContext";
import Loader from "./component/Loader/Loader";
import RoutePath from "./RoutePath";
import { FolderPath } from "./config/config";

function App() {
  const { loader } = useAlert();
  const base = import.meta.env.MODE === 'production' ? FolderPath : '/'
  return (
    <>
      <Loader loader={loader} />
      <BrowserRouter basename={base}>
        <Routes>
          <Route path="/*" element={<RoutePath />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
