import { useState } from 'react';
import type { ReactNode } from 'react';
import type { PageId } from '../../types';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage: PageId;
  navigate: (id: PageId) => void;
  onLogout: () => void;
}

export default function Layout({ children, currentPage, navigate, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        navigate={navigate}
        onLogout={onLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-area">
        <Header
          currentPage={currentPage}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
        />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}
