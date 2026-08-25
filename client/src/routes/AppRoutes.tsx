import {
  BrowserRouter,
  Routes,
} from "react-router-dom";

import CustomerRoutes from "./CustomerRoutes";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {CustomerRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;