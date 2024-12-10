import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div>
      {/* Header */}
      <Header />

      {/* Main content area - where child components will be rendered */}
      <main>
        <Outlet />  {/* Renders the child route components like HomePage, AboutPage */}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
