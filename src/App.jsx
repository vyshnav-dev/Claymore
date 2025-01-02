import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAlert } from "./component/Alerts/AlertContext";
import Loader from "./component/Loader/Loader";
import RoutePath from "./RoutePath";

function App() {
  const { loader } = useAlert();

  return (
    <>
      <Loader loader={loader} />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<RoutePath />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
