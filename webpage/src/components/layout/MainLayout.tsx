import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./Footer";

const MainLayout: React.FC = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
