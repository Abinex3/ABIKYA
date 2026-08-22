import { Outlet } from "react-router-dom";

import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-black">
      <AnnouncementBar />
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;