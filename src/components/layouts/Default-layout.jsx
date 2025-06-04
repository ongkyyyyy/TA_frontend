import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import MobileSidebar from "../sidebar/MobileSidebar";
import LogoutConfirmationModal from "../sidebar/LogoutConfirmationModal";
import { logoutUser } from "@/api/apiUser";

function DefaultLayout() {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const toggleMobileSidebar = () => setMobileSidebar(prev => !prev);

  const handleLogout = () => {
    logoutUser();
    setConfirmLogout(false);
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        toggleMobileSidebar={toggleMobileSidebar}
        setConfirmLogout={setConfirmLogout}
      />

      <MobileSidebar
        mobileSidebar={mobileSidebar}
        toggleMobileSidebar={toggleMobileSidebar}
        setConfirmLogout={setConfirmLogout}
      />

      <LogoutConfirmationModal
        open={confirmLogout}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default DefaultLayout;
