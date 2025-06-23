import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import UserDetailsContext from '@/hooks/UserDetailsContext';
import { Home, FileText, CheckSquare, Package, Database, Archive,Store } from 'lucide-react';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userDetails = useContext(UserDetailsContext);
  const userRole = userDetails?.userDetails?.UserRole;
  const accountId = userDetails?.userDetails?.AccountID;

  const addAccountQuery = (path: string) =>
    accountId ? `${path}?account_id=${accountId}` : path;

  const allNavLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { to: '/vendors', label: 'Vendors', icon: <Store size={20} /> }
      // { to: '/vendors', label: 'Vendors', icon: <img src="/icon.png" alt="Vendors" className="w-5 h-5" /> }
      // { to: '/requisitions', label: 'Requisitions', icon: <FileText size={20} /> },
    // { to: '/approvals', label: 'Approvals', icon: <CheckSquare size={20} /> },
    // { to: '/inventory', label: 'Inventory', icon: <Database size={20} /> },
    // { to: '/assets', label: 'Assets', icon: <Archive size={20} /> },
  ];

  const limitedNavLinks = allNavLinks.filter(link =>
    ['/', '/requisitions', '/purchase-orders', '/inventory', '/assets'].includes(link.to)
  );

  const navLinks = userRole === "owner" ? allNavLinks : limitedNavLinks;

  return (
   <div className="d-flex flex-column min-vh-100">
  {/* Sticky Container for both navbars */}
  <div className="position-sticky top-0" style={{ zIndex: 1030 }}>
    {/* Top Navbar */}
    <nav className="navbar navbar-dark bg-primary px-3">
      <span className="navbar-brand mb-0 h1">Purchase Tracker</span>
    </nav>

    {/* Horizontal Nav Links */}
    <div className="bg-light border-bottom shadow-sm">
      <div className="container-fluid overflow-auto py-2 d-flex gap-3">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={addAccountQuery(link.to)}
            className={({ isActive }) =>
              `text-center text-decoration-none px-3 py-2 rounded ${
                isActive ? 'bg-primary text-white' : 'text-dark bg-white border'
              }`
            }
            style={{ minWidth: '100px' }}
          >
            <div className="d-flex flex-column align-items-center">
              {link.icon}
              <span className="small mt-1">{link.label}</span>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  </div>

  {/* Page Content */}
  <main className="flex-1 p-6">{children}</main>
</div>

  );
};

export default Layout;
