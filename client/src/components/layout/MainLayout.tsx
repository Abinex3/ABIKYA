import { Outlet } from "react-router-dom";

import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* TOP ANNOUNCEMENT */}
      <AnnouncementBar />

      {/* MAIN HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* SITE FOOTER */}
      <Footer />
    </div>
  );
}

export default MainLayout;