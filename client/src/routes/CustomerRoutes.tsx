import { Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Collections from "../pages/Collections/Collections";
import Men from "../pages/Men/Men";
import Women from "../pages/Women/Women";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import Wishlist from "../pages/Wishlist/Wishlist";
import Checkout from "../pages/Checkout/Checkout";
import OrderConfirmation from "../pages/OrderConfirmation/OrderConfirmation";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Studio from "../pages/Studio/Studio";
import FAQ from "../pages/FAQ/FAQ";
import Shipping from "../pages/Shipping/Shipping";
import Returns from "../pages/Returns/Returns";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";

const CustomerRoutes = () => {
  return (
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/men" element={<Men />} />
      <Route path="/women" element={<Women />} />

      <Route
        path="/product/:slug"
        element={<ProductDetails />}
      />

      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/checkout" element={<Checkout />} />

      <Route
        path="/order-confirmation"
        element={<OrderConfirmation />}
      />

      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/studio" element={<Studio />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/returns" element={<Returns />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </Route>
  );
};

export default CustomerRoutes;