
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ShoppingCart, User, Utensils, LogOut, Ticket, LayoutDashboard, Boxes, PlusSquare, Menu as MenuIcon } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout, isStaff } = useAuth();
  const { cart, couponAvailable } = useData();
  const location = useLocation();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Helper to determine link styling
  const getLinkClass = (path: string) => {
    const baseClass = "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";
    const activeClass = isStaff 
        ? "bg-stone-800 text-white" 
        : "bg-amber-100 text-amber-700";
    const inactiveClass = "text-stone-500 hover:bg-stone-100 hover:text-stone-900";
    
    return `${baseClass} ${location.pathname === path ? activeClass : inactiveClass}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Universal Top Header */}
      <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-stone-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className={`${isStaff ? 'bg-stone-900' : 'bg-amber-500'} text-white p-1 rounded-md text-sm shadow`}>
              {isStaff ? 'STAFF' : 'MD'}
            </span>
            <span className="hidden sm:inline">미스터 대박</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {isStaff ? (
              // Staff Nav Links
              <>
                <Link to="/" className={getLinkClass('/')}>
                  <LayoutDashboard className="w-4 h-4" />
                  대시보드
                </Link>
                <Link to="/inventory" className={getLinkClass('/inventory')}>
                  <Boxes className="w-4 h-4" />
                  재고 관리
                </Link>
                <Link to="/menu-manage" className={getLinkClass('/menu-manage')}>
                  <PlusSquare className="w-4 h-4" />
                  메뉴 관리
                </Link>
              </>
            ) : (
              // Customer Nav Links
              <>
                <Link to="/" className={getLinkClass('/')}>
                  <Utensils className="w-4 h-4" />
                  메뉴
                </Link>
                <Link to="/orders" className={getLinkClass('/orders')}>
                  <User className="w-4 h-4" />
                  내 정보
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
           {/* Cart Button (Customer Only) */}
           {!isStaff && (
            <Link to="/cart" className="relative p-2 text-stone-600 hover:bg-stone-100 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* User Info & Logout */}
          <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
            {couponAvailable && !isStaff && (
              <div className="hidden sm:flex items-center gap-1 text-amber-600 font-bold text-sm animate-pulse">
                <Ticket className="w-4 h-4" />
                <span>쿠폰보유</span>
              </div>
            )}
            <div className="text-right hidden sm:block">
               <div className="text-sm font-bold text-stone-800">{user?.name}님</div>
               <div className="text-xs text-stone-500">{isStaff ? '관리자' : '일반회원'}</div>
            </div>
            <button 
              onClick={logout} 
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Bar (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-stone-200 overflow-x-auto">
        <nav className="flex items-center px-4 py-2 gap-2 whitespace-nowrap">
           {isStaff ? (
              <>
                <Link to="/" className={getLinkClass('/')}>대시보드</Link>
                <Link to="/inventory" className={getLinkClass('/inventory')}>재고 관리</Link>
                <Link to="/menu-manage" className={getLinkClass('/menu-manage')}>메뉴 관리</Link>
              </>
            ) : (
              <>
                <Link to="/" className={getLinkClass('/')}>메뉴</Link>
                <Link to="/orders" className={getLinkClass('/orders')}>내 정보</Link>
                <Link to="/cart" className={getLinkClass('/cart')}>장바구니</Link>
              </>
            )}
        </nav>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
