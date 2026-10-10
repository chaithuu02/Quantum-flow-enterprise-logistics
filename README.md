# ⚛️ QUANTUMFLOW — Quantum-Assisted Supply Chain Optimization System

A **premium enterprise-grade** supply chain optimization platform powered by **classical LP (PuLP/CBC)** and **quantum QAOA (Qiskit)**, featuring intelligent demand-based replenishment planning and a modern dark SaaS UI.

---

## ✨ Features

### Core System
| Feature | Description |
|---|---|
| **Warehouse Management** | CRUD for warehouses with inventory, capacity, and outbound limits |
| **Destination / Shop Management** | CRUD for destinations with demand, stock, safety stock, and delivery dates |
| **Transportation Cost Matrix** | Route-level unit cost, capacity, and toggle management |
| **Classical LP Optimizer** | PuLP + CBC primal-simplex solver for minimum-cost flow |
| **Quantum Lab (QAOA)** | Qiskit QAOA multi-layer quantum circuit optimizer with classical fallback |
| **Solver Comparison** | Side-by-side classical vs quantum results with timing benchmarks |
| **Scenario Simulator** | Fuel cost shocks, warehouse shutdowns, demand surges |
| **Analytics** | Charts for cost, utilization, demand fulfillment, route breakdown |
| **Route Map** | Visual warehouse-to-shop allocation overlay |
| **Reports & CSV Export** | One-click CSV export for all data entities |

### 🆕 Demand-Based Smart Supply Distribution
| Feature | Description |
|---|---|
| **Replenishment Calculator** | `max(0, Forecast + SafetyStock − UsableStock − IncomingStock)` |
| **Intelligent Warehouse Allocation** | Multi-objective LP: maximize fulfillment, minimize transport cost |
| **Shortage Detection** | Identifies unfulfillable shops with quantity gaps and reasons |
| **Next Shipment Planner** | Full page: status filters, stockout risk bars, supply badges |
| **Explainable Recommendations** | Natural-language justification for every allocation decision |
| **Priority Statuses** | `Urgent`, `High Priority`, `Normal`, `No Action`, `Partially Fulfillable`, `Insufficient Supply` |
| **Dashboard Integration** | Smart supply summary cards + Stock vs Demand bar chart |
| **Shipment Plan CSV Export** | Download full replenishment plan as CSV |

---

## 🏗️ Tech Stack

```
Backend   FastAPI · PuLP (CBC LP) · Qiskit (QAOA) · Uvicorn · Python 3.10+
Frontend  React 19 · TypeScript · Vite · Tailwind CSS (utility-based) · Recharts · Lucide Icons
```

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install fastapi uvicorn pulp qiskit qiskit-aer qiskit-algorithms
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # development  →  http://localhost:5173
npm run build        # production build
```

> The Vite dev server proxies `/api/*` to `http://localhost:8000`.

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/overview` | Dashboard KPIs + smart supply summary |
| `GET/POST/PUT/DELETE` | `/api/warehouses` | Warehouse CRUD |
| `GET/POST/PUT/DELETE` | `/api/destinations` | Destination / shop CRUD |
| `GET/POST` | `/api/matrix` | Transportation cost matrix |
| `POST` | `/api/optimize` | Run classical LP optimization |
| `POST` | `/api/quantum-lab/run` | Run Qiskit QAOA solver |
| `POST` | `/api/compare` | Classical vs quantum comparison |
| `POST` | `/api/simulate-scenario` | What-if scenario simulation |
| `GET` | `/api/shipment-plan` | **Next shipment & replenishment plan** |
| `GET` | `/api/export/{type}` | CSV export (`warehouses`, `destinations`, `matrix`, `optimization`, `shipment-plan`) |

---

## 🧮 Replenishment Formula

```
Required Replenishment = max(0,
    Forecast Demand
  + Desired Safety Stock
  − Current Usable Stock
  − Confirmed Incoming Stock (arriving within planning period)
)
```

**Example:**
> Shop: Whitefield · Product: Tomatoes  
> Forecast: 80 kg · Stock: 20 kg · Safety stock: 10 kg · Incoming: 0 kg  
> → Replenishment = 80 + 10 − 20 − 0 = **70 kg**

---

## 🧪 Tests

```bash
cd backend
python test_replenishment.py
# ALL BACKEND REPLENISHMENT TESTS PASSED SUCCESSFULLY!
```

Tests cover: replenishment math, stockout detection, multi-shop warehouse competition, shortage detection, partial fulfillment, inventory constraint enforcement.

---

## 📁 Project Structure

```
quan/
├── backend/
│   ├── main.py              # FastAPI app + all endpoints
│   ├── models.py            # Pydantic data models
│   ├── solver.py            # PuLP LP + Qiskit QAOA + replenishment planner
│   ├── data_store.py        # In-memory data store with seed data
│   └── test_replenishment.py # Unit tests
└── frontend/
    └── src/
        ├── App.tsx
        ├── pages/
        │   ├── OverviewPage.tsx        # Dashboard + supply summary
        │   ├── ShipmentPlannerPage.tsx # Next Shipment Planner (NEW)
        │   ├── ReportsPage.tsx         # CSV export center
        │   └── ...all other pages
        ├── components/
        │   ├── Navbar.tsx
        │   └── ...
        ├── services/api.ts
        └── types/index.ts
```

---

## 🎨 Design System

- **Background:** `#080B16` (midnight navy)
- **Accent 1:** `#32D5F5` (quantum cyan)
- **Accent 2:** `#8B5CF6` (violet)
- **Success:** `#32D583` (emerald)
- **Font:** Inter (Google Fonts)
- **Style:** Glassmorphism cards, gradient buttons, micro-animations

---

## ⚠️ Limitations

- The in-memory data store resets on server restart (no persistent DB)
- QAOA is simulated via `AerSimulator`; no real quantum hardware connection
- Route travel times are estimated (no live road-network API)
- Forecast demand is manually entered; historical ML forecasting not yet integrated
