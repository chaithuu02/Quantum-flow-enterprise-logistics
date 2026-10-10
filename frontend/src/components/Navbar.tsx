import React, { useState } from 'react';
import {
  Cpu, LayoutDashboard, Warehouse, MapPin, Grid, Zap,
  Atom, BarChart3, Map, Sliders, FileSpreadsheet, Bell,
  Settings, Menu, X, ChevronDown, PackageCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'shipment-planner', label: 'Shipment Planner', icon: PackageCheck },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'transportation', label: 'Transportation', icon: Grid },
    { id: 'optimize', label: 'Optimize', icon: Zap },
    { id: 'quantum-lab', label: 'Quantum Lab', icon: Atom },
    { id: 'comparison', label: 'Compare', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'map', label: 'Route Map', icon: Map },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#080B16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#32D5F5] to-[#8B5CF6] p-[1px] shadow-[0_0_15px_rgba(50,213,245,0.4)]">
              <div className="w-full h-full bg-[#080B16] rounded-[11px] flex items-center justify-center">
                <Atom className="w-6 h-6 text-[#32D5F5] animate-spin-slow" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5">
                QUANTUM<span className="cyan-gradient-text">FLOW</span>
              </span>
              <span className="text-[10px] tracking-widest text-[#32D5F5] block font-mono uppercase">
                Enterprise Logistics AI
              </span>
            </div>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#32D5F5]/20 to-[#8B5CF6]/20 text-[#32D5F5] border border-[#32D5F5]/40 shadow-[0_0_10px_rgba(50,213,245,0.2)]'
                      : 'text-[#A8B3C7] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#32D5F5]' : 'text-[#A8B3C7]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Icon */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-[#A8B3C7] hover:text-white hover:bg-white/5 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#32D5F5] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#32D5F5]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl glass-panel-glow p-4 shadow-2xl z-50 border border-[#32D5F5]/30">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</span>
                    <span className="text-[10px] bg-[#32D5F5]/20 text-[#32D5F5] px-2 py-0.5 rounded-full font-mono">Live</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded bg-white/5 border border-white/5">
                      <p className="text-white font-medium">QAOA Quantum Solver Ready</p>
                      <p className="text-[10px] text-[#A8B3C7]">Aer Statevector simulator online with 24 qubit capacity.</p>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/5">
                      <p className="text-white font-medium">Warehouse Network Optimal</p>
                      <p className="text-[10px] text-[#A8B3C7]">All 5 distribution hubs connected with full inventory data.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <button
              id="settings-btn"
              onClick={() => setActiveTab('optimize')}
              className="p-2 rounded-lg text-[#A8B3C7] hover:text-white hover:bg-white/5 transition-colors"
              title="Optimizer Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                id="user-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#32D5F5]/40 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#32D5F5] to-[#8B5CF6] flex items-center justify-center font-bold text-xs text-[#080B16]">
                  QC
                </div>
                <div className="text-left text-xs hidden xl:block">
                  <p className="font-semibold text-white leading-tight">Quantum Ops</p>
                  <p className="text-[10px] text-[#32D5F5] leading-none">Admin</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#A8B3C7]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel-glow p-3 shadow-2xl z-50 border border-white/10">
                  <div className="pb-2 border-b border-white/10 mb-2">
                    <p className="text-xs font-bold text-white">Chief Supply Officer</p>
                    <p className="text-[10px] text-[#A8B3C7]">cso@quantumflow.ai</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <button onClick={() => setActiveTab('quantum-lab')} className="w-full text-left px-2 py-1.5 rounded text-[#A8B3C7] hover:text-white hover:bg-white/5 flex items-center gap-2">
                      <Atom className="w-3.5 h-3.5 text-[#32D5F5]" /> Quantum Engine Status
                    </button>
                    <button onClick={() => setActiveTab('reports')} className="w-full text-left px-2 py-1.5 rounded text-[#A8B3C7] hover:text-white hover:bg-white/5 flex items-center gap-2">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-[#8B5CF6]" /> Export Logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#A8B3C7] hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#32D5F5]/20 to-[#8B5CF6]/20 text-[#32D5F5] border border-[#32D5F5]/30'
                    : 'text-[#A8B3C7] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5 text-[#32D5F5]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
