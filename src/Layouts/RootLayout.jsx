import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { SidebarProvider } from "../context/SidebarProvider";

const RootLayout = () => {
  return (
    <SidebarProvider>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f7fb" }}>
        <Sidebar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default RootLayout;