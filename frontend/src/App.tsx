import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewPage } from './pages/OverviewPage';
import { WarehousesPage } from './pages/WarehousesPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { TransportationPage } from './pages/TransportationPage';
import { OptimizationPage } from './pages/OptimizationPage';
import { QuantumLabPage } from './pages/QuantumLabPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MapPage } from './pages/MapPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { ReportsPage } from './pages/ReportsPage';
import { ShipmentPlannerPage } from './pages/ShipmentPlannerPage';

import { api } from './services/api';
import type { OverviewData, Warehouse, Destination, MatrixEntry } from './types';
import { Atom } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [matrix, setMatrix] = useState<MatrixEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ovData, whData, dstData, matData] = await Promise.all([
        api.getOverview(),
        api.getWarehouses(),
        api.getDestinations(),
        api.getMatrix(),
      ]);
      setOverview(ovData);
      setWarehouses(whData);
      setDestinations(dstData);
      setMatrix(matData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async (wh: Partial<Warehouse>) => {
    await api.createWarehouse(wh);
    loadAllData();
  };

  const handleUpdateWarehouse = async (id: string, wh: Partial<Warehouse>) => {
    await api.updateWarehouse(id, wh);
    loadAllData();
  };

  const handleDeleteWarehouse = async (id: string) => {
    await api.deleteWarehouse(id);
    loadAllData();
  };

  const handleCreateDestination = async (dst: Partial<Destination>) => {
    await api.createDestination(dst);
    loadAllData();
  };

  const handleUpdateDestination = async (id: string, dst: Partial<Destination>) => {
    await api.updateDestination(id, dst);
    loadAllData();
  };

  const handleDeleteDestination = async (id: string) => {
    await api.deleteDestination(id);
    loadAllData();
  };

  const handleSaveMatrix = async (entries: MatrixEntry[]) => {
    await api.updateMatrix(entries);
    loadAllData();
  };

  const handleRunOptimization = async (config: any) => {
    const res = await api.runOptimization(config);
    loadAllData();
    return res;
  };

  const handleRunQuantumLab = async (qConfig: any) => {
    const res = await api.runQuantumLab(qConfig);
    loadAllData();
    return res;
  };

  const handleRunComparison = async () => {
    const res = await api.runComparison();
    loadAllData();
    return res;
  };

  const handleSimulateScenario = async (scenConfig: any) => {
    return await api.simulateScenario(scenConfig);
  };

  return (
    <div className="min-h-screen bg-[#080B16] text-[#F5F7FF] flex flex-col selection:bg-[#32D5F5] selection:text-[#080B16]">
      {/* Sticky Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'overview' && (
          <OverviewPage overview={overview} loading={loading} onNavigate={setActiveTab} />
        )}

        {activeTab === 'warehouses' && (
          <WarehousesPage
            warehouses={warehouses}
            loading={loading}
            onRefresh={loadAllData}
            onCreate={handleCreateWarehouse}
            onUpdate={handleUpdateWarehouse}
            onDelete={handleDeleteWarehouse}
          />
        )}

        {activeTab === 'destinations' && (
          <DestinationsPage
            destinations={destinations}
            loading={loading}
            onRefresh={loadAllData}
            onCreate={handleCreateDestination}
            onUpdate={handleUpdateDestination}
            onDelete={handleDeleteDestination}
          />
        )}

        {activeTab === 'transportation' && (
          <TransportationPage
            warehouses={warehouses}
            destinations={destinations}
            matrix={matrix}
            loading={loading}
            onRefresh={loadAllData}
            onSaveMatrix={handleSaveMatrix}
          />
        )}

        {activeTab === 'optimize' && (
          <OptimizationPage
            onRunOptimization={handleRunOptimization}
            lastResult={overview?.last_optimization || null}
          />
        )}

        {activeTab === 'quantum-lab' && (
          <QuantumLabPage
            onRunQuantumLab={handleRunQuantumLab}
            lastResult={overview?.last_optimization || null}
          />
        )}

        {activeTab === 'comparison' && (
          <ComparisonPage onRunComparison={handleRunComparison} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            warehouses={warehouses}
            destinations={destinations}
            optResult={overview?.last_optimization || null}
          />
        )}

        {activeTab === 'map' && (
          <MapPage
            warehouses={warehouses}
            destinations={destinations}
            optResult={overview?.last_optimization || null}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorPage
            warehouses={warehouses}
            destinations={destinations}
            onSimulateScenario={handleSimulateScenario}
          />
        )}

        {activeTab === 'shipment-planner' && <ShipmentPlannerPage />}

        {activeTab === 'reports' && <ReportsPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#080B16] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#A8B3C7]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-[#32D5F5]" />
            <span className="font-bold text-white tracking-wider">QUANTUMFLOW</span>
            <span>&copy; {new Date().getFullYear()} Enterprise Logistics System. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span className="flex items-center gap-1.5 text-[#32D583]">
              <span className="w-2 h-2 rounded-full bg-[#32D583] animate-ping" />
              API Server Online (Port 8000)
            </span>
            <span className="text-[#32D5F5]">Qiskit QAOA v1.02</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
