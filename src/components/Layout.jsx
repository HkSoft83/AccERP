import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Menu, X, Users, ShoppingCart, FileText, BarChart3, Briefcase, Building, Users2, Settings, LogOut, ChevronDown, ChevronRight, Package, Factory, ShoppingBag, PieChart, Sun, Moon, Dot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Chart of Accounts', path: '/chart-of-accounts', icon: BarChart3 },
  { name: 'Products/Services', path: '/products-services', icon: ShoppingCart },
  { name: 'Vendor', path: '/vendor', icon: Building },
  { name: 'Customer Center', path: '/customer-center', icon: Users },
  {
    name: 'Sales', path: '/sales', icon: FileText,
    subItems: [
      { name: 'Sales Invoice', path: '/sales/invoice' },
      { name: 'Sales Return', path: '/sales/return' },
      { name: 'Sales Order', path: '/sales/sales-orders' },
      { name: 'Estimate', path: '/sales/estimate' },
    ]
  },
  {
    name: 'Purchase', path: '/purchase', icon: ShoppingBag,
    subItems: [
      { name: 'Purchase Bill', path: '/purchase/bill' },
      { name: 'Purchase Order', path: '/purchase/order' },
      { name: 'Purchase Return', path: '/purchase/return' },
    ]
  },
  {
    name: 'Transactions', path: '/transactions', icon: Briefcase,
    subItems: [
      { name: 'Receipt', path: '/transactions/receipt' },
      { name: 'Payment', path: '/transactions/payment' },
      { name: 'Contra', path: '/transactions/contra' },
      { name: 'Debit Note', path: '/transactions/debit-note' },
      { name: 'Credit Note', path: '/transactions/credit-note' },
      { name: 'Manual Journal', path: '/transactions/manual-journal' },
      { name: 'Recurring & Adjustments', path: '/transactions/recurring-adjustments' },
      { name: 'Txn Transfer', path: '/transactions/txn-transfer' },
    ]
  },
  { name: 'Fixed Asset Management', path: '/fixed-asset-management', icon: Briefcase },
  {
    name: 'Payroll Management', path: '/employee', icon: Users2,
    subItems: [
      { name: 'Employee Database', path: '/employee/database' },
      { name: 'Salary Setup', path: '/employee/salary-setup' },
      { name: 'Payroll run', path: '/employee/payroll-run' },
      { name: 'Salary report', path: '/employee/salary-report' },
      { name: 'Payslip', path: '/employee/payslip' },
    ]
  },
  { name: 'Production', path: '/production', icon: Factory },
  {
    name: 'Reports', path: '/reports', icon: PieChart,
    subItems: [
      { name: 'Income Statement', path: '/reports/income-statement' },
      { name: 'Balance Sheet', path: '/reports/balance-sheet' },
      { name: 'Trial Balance', path: '/reports/trial-balance' },
      { name: 'Owners Equity', path: '/reports/owners-equity' },
      { name: 'Stock Report', path: '/reports/stock-report' },
      { name: 'Cash Flow Statement', path: '/reports/cash-flow-statement' },
      {
        name: 'Other Report', path: '/reports/other',
        subItems: [
          // Add other reports here later
        ]
      },
      { name: 'Vendor Ledger', path: '/reports/vendor-ledger' },
    ]
  },
];

const SidebarLink = ({ item, sidebarCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = item.subItems
    ? location.pathname.startsWith(item.path)
    : location.pathname === item.path;

  const handleToggle = (e) => {
    e.preventDefault();
    if (item.subItems) {
      if (!sidebarCollapsed) {
        setIsOpen(!isOpen);
      }
    } else {
      navigate(item.path);
    }
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSubMenuClick = () => {
    setIsPopoverOpen(false);
  };

  if (sidebarCollapsed && item.subItems) {
    return (
      <li className="mb-1">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className={
                `w-full p-3 rounded-lg transition-all duration-200 ease-in-out
                 hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-gray-100
                 ${isActive
                   ? 'bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-100 font-semibold shadow-sm'
                   : 'text-gray-700 dark:text-gray-300'}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="right" align="start">
            <h4 className="font-semibold text-sm mb-2 px-2">{item.name}</h4>
            <ul>
              {item.subItems.map(subItem => (
                <li key={subItem.name}>
                  <NavLink
                    to={subItem.path}
                    onClick={handleSubMenuClick}
                    className={({ isActive: subIsActive }) =>
                      `flex items-center p-2 rounded-md text-xs transition-colors duration-200
                       hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-gray-100
                       ${subIsActive
                         ? 'bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-100 font-medium'
                         : 'text-gray-600 dark:text-gray-400'}`
                    }
                  >
                    <Dot className="w-4 h-4 mr-1 flex-shrink-0" />
                    {subItem.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </li>
    );
  }

  return (
    <li className="mb-1">
      <a
        href={item.path}
        onClick={handleToggle}
        className={
          `flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
           hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-gray-100
           ${sidebarCollapsed ? 'justify-center' : 'justify-between'}
           ${isActive
             ? 'bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-100 font-semibold shadow-sm'
             : 'text-gray-700 dark:text-gray-300'}`
        }
      >
        <div className="flex items-center">
          <item.icon className={`w-5 h-5 flex-shrink-0 ${!sidebarCollapsed ? 'mr-3' : ''} ${isActive ? 'text-blue-600 dark:text-gray-100' : ''}`} />
          {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
        </div>
        {item.subItems && !sidebarCollapsed && (isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
      </a>
      {!sidebarCollapsed && item.subItems && isOpen && (
        <motion.ul
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="ml-6 mt-1 space-y-1 overflow-hidden"
        >
          {item.subItems.map(subItem => (
            <li key={subItem.name}>
              <NavLink
                to={subItem.path}
                className={({ isActive: subIsActive }) =>
                  `flex items-center p-2 pl-5 rounded-md text-xs transition-colors duration-200
                   hover:bg-blue-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-gray-100
                   ${subIsActive
                     ? 'bg-blue-100 dark:bg-gray-800 text-blue-600 dark:text-gray-100 font-medium'
                     : 'text-gray-600 dark:text-gray-400'}`
                }
              >
                {subItem.icon && <subItem.icon className="w-4 h-4 mr-2 flex-shrink-0" />}
                {subItem.name}
              </NavLink>
            </li>
          ))}
        </motion.ul>
      )}
    </li>
  );
};

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  let currentPageName = 'Dashboard';
  const currentTopLevelItem = navItems.find(item => location.pathname === item.path || (item.subItems && location.pathname.startsWith(item.path)));
  if (currentTopLevelItem) {
    if (currentTopLevelItem.subItems) {
      const currentSubItem = currentTopLevelItem.subItems.find(sub => location.pathname === sub.path);
      currentPageName = currentSubItem ? currentSubItem.name : currentTopLevelItem.name;
    } else {
      currentPageName = currentTopLevelItem.name;
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarCollapsed ? 64 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 flex flex-col"
        style={{ width: sidebarCollapsed ? '4rem' : '16rem', minWidth: sidebarCollapsed ? '4rem' : '16rem', maxWidth: sidebarCollapsed ? '4rem' : '16rem' }}
      >
        <div className="flex flex-col h-full">
          {/* Top bar */}
          <div className={`flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-blue-600 dark:bg-gray-800 text-white dark:text-gray-100 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
            <NavLink to="/" className="flex items-center" onClick={() => {}}>
              <Package size={28} className="mr-2 text-blue-300"/>
              {!sidebarCollapsed && <span className="text-xl font-bold">Easy CloudBook</span>}
            </NavLink>
            {!sidebarCollapsed && (
              <Button variant="ghost" size="icon" className="md:hidden text-white dark:text-gray-100 hover:bg-blue-700 dark:hover:bg-gray-700" onClick={toggleSidebar}>
                <X size={24} />
              </Button>
            )}
          </div>
          {/* Navigation */}
          <nav className={`flex-1 p-2 overflow-y-auto ${sidebarCollapsed ? 'items-center' : ''}`}>
            <ul>
              {navItems.map(item => (
                <SidebarLink key={item.name} item={item} sidebarCollapsed={sidebarCollapsed} />
              ))}
            </ul>
          </nav>
          {/* Settings/Logout */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-gray-100"
                onClick={() => {
                  toast({ title: "Settings", description: "Settings page coming soon!" });
                }}
              >
                <Settings size={20} className="mr-3" /> Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-gray-100"
                onClick={() => {
                  toast({ title: "Logout", description: "You have been logged out (simulation)." });
                }}
              >
                <LogOut size={20} className="mr-3" /> Logout
              </Button>
            </div>
          )}
          
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          marginLeft: sidebarCollapsed ? '4rem' : '16rem',
          transition: 'margin-left 0.3s',
        }}
      >
        <header className="h-20 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {/* Optionally hide this button if sidebar is collapsed */}
            <Button variant="ghost" size="icon" className="mr-4 text-gray-700 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700" onClick={toggleSidebar}>
              <Menu size={24} />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {currentPageName}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="text-gray-700 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-gray-700"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            <div 
              className="w-10 h-10 bg-blue-600 dark:bg-blue-600 rounded-full flex items-center justify-center text-white dark:text-gray-100 font-semibold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-500"
              onClick={() => toast({ title: "User Profile", description: "User profile actions coming soon!"})}
            >
              U
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="page-enter"
              animate="page-enter-active"
              exit="page-exit-active"
              variants={{
                'page-enter': { opacity: 0, y: 20, scale: 0.98 },
                'page-enter-active': { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
                'page-exit-active': { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2, ease: 'easeIn' } },
              }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;