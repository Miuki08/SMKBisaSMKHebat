"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import Login from '../../app/auth/login/page';
import Register from '../../app/auth/register/page';

interface LayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentNavigationStyle, setCurrentNavigationStyle] = useState('default');
  const [headerStyle, setHeaderStyle] = useState('default');
  const [currentDirection, setCurrentDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [currentLayout, setCurrentLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [menuStyle, setMenuStyle] = useState('default');
  const [sidemenuLayout, setSidemenuLayout] = useState('default');
  const [pageStyle, setPageStyle] = useState('default');
  const [layoutWidth, setLayoutWidth] = useState('default');
  const [menuPosition, setMenuPosition] = useState('default');
  const [headerPosition, setHeaderPosition] = useState('default');
  const [loaderEnabled, setLoaderEnabled] = useState(false);
  const [themeBackground, setThemeBackground] = useState('default');
  const [menuBackground, setMenuBackground] = useState('default');

  // Toggle sidebar function
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);

    if (!token && !['/login', '/register'].includes(pathname)) {
      router.push('/login');
    }
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {showLogin ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {showLogin ? (
              <Login onToggleForm={() => setShowLogin(false)} />
            ) : (
              <Register onToggleForm={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          setSidebarOpen={setSidebarOpen}
          toggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          onNavigationStyleChange={setCurrentNavigationStyle}
          currentNavigationStyle={currentNavigationStyle}
          headerStyle={headerStyle}
          onHeaderStyleChange={setHeaderStyle}
          onDirectionChange={setCurrentDirection}
          onLayoutChange={setCurrentLayout}
          currentDirection={currentDirection}
          currentLayout={currentLayout}
          onThemeChange={setCurrentTheme}
          currentTheme={currentTheme}
          onMenuStyleChange={setMenuStyle}
          menuStyle={menuStyle}
          onSidemenuLayoutChange={setSidemenuLayout}
          sidemenuLayout={sidemenuLayout}
          onPageStyleChange={setPageStyle}
          pageStyle={pageStyle}
          onLayoutWidthChange={setLayoutWidth}
          layoutWidth={layoutWidth}
          onMenuPositionChange={setMenuPosition}
          menuPosition={menuPosition}
          onHeaderPositionChange={setHeaderPosition}
          headerPosition={headerPosition}
          onLoaderChange={setLoaderEnabled}
          loaderEnabled={loaderEnabled}
          onThemeBackgroundChange={setThemeBackground}
          themeBackground={themeBackground}
          onMenuBackgroundChange={setMenuBackground}
          menuBackground={menuBackground}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}