import { Route } from "react-router-dom";

import Admin from "../pages/Admin/Admin";
import AdminLogin from "../pages/Admin/AdminLogin";

import AdminProtectedRoute from "../components/admin/AdminProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

//Products
import Products from "../pages/Admin/Products/Products";
import AddProduct from "../pages/Admin/Products/AddProduct";

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route
            path="/admin"
            element={<Admin />}
          />
          <Route
            path="/admin/products"
            element={<Products />}
          />

          <Route
  path="/admin/products/new"
  element={<AddProduct />}
/>
          
        </Route>
      </Route>
    </>
  );
};

export default AdminRoutes;