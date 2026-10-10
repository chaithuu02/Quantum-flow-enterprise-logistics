import copy
from typing import List, Dict, Tuple
from models import Warehouse, Destination, MatrixEntry

class DataStore:
    def __init__(self):
        self.reset_to_default()

    def reset_to_default(self):
        self.warehouses: Dict[str, Warehouse] = {
            "wh-1": Warehouse(
                id="wh-1",
                name="Hyderabad Mega Hub",
                location="Telangana, India",
                lat=17.3850,
                lng=78.4867,
                inventory=1200,
                capacity=1500,
                outbound_capacity=850
            ),
            "wh-2": Warehouse(
                id="wh-2",
                name="Bengaluru Distribution Center",
                location="Karnataka, India",
                lat=12.9716,
                lng=77.5946,
                inventory=1400,
                capacity=1800,
                outbound_capacity=1000
            ),
            "wh-3": Warehouse(
                id="wh-3",
                name="Chennai Coastal Logistics",
                location="Tamil Nadu, India",
                lat=13.0827,
                lng=80.2707,
                inventory=950,
                capacity=1200,
                outbound_capacity=750
            ),
            "wh-4": Warehouse(
                id="wh-4",
                name="Mumbai Port Gateway",
                location="Maharashtra, India",
                lat=19.0760,
                lng=72.8777,
                inventory=1600,
                capacity=2000,
                outbound_capacity=1200
            ),
            "wh-5": Warehouse(
                id="wh-5",
                name="Delhi NCR Terminal",
                location="Haryana, India",
                lat=28.6139,
                lng=77.2090,
                inventory=1100,
                capacity=1400,
                outbound_capacity=900
            )
        }

        self.destinations: Dict[str, Destination] = {
            "dst-1": Destination(
                id="dst-1",
                name="Pune Fulfillment Center",
                location="Maharashtra, India",
                lat=18.5204,
                lng=73.8567,
                demand=550,
                priority="High",
                delivered_qty=0,
                product_name="Tomatoes (Fresh Produce)",
                current_stock=120,
                safety_stock=50,
                incoming_stock=0,
                historical_sales=500,
                shop_capacity=1000,
                required_delivery_date="2026-10-12"
            ),
            "dst-2": Destination(
                id="dst-2",
                name="Whitefield Smart Shop",
                location="Karnataka, India",
                lat=12.9698,
                lng=77.7500,
                demand=80,
                priority="High",
                delivered_qty=0,
                product_name="Tomatoes (Fresh Produce)",
                current_stock=20,
                safety_stock=10,
                incoming_stock=0,
                historical_sales=75,
                shop_capacity=300,
                required_delivery_date="2026-10-11"
            ),
            "dst-3": Destination(
                id="dst-3",
                name="Kolkata Commercial Depot",
                location="West Bengal, India",
                lat=22.5726,
                lng=88.3639,
                demand=600,
                priority="High",
                delivered_qty=0,
                product_name="Organic Dairy Quanta",
                current_stock=150,
                safety_stock=60,
                incoming_stock=50,
                historical_sales=550,
                shop_capacity=1200,
                required_delivery_date="2026-10-13"
            ),
            "dst-4": Destination(
                id="dst-4",
                name="Kochi Port Station",
                location="Kerala, India",
                lat=9.9312,
                lng=76.2673,
                demand=350,
                priority="Low",
                delivered_qty=0,
                product_name="Cold Storage Cargo",
                current_stock=300,
                safety_stock=50,
                incoming_stock=50,
                historical_sales=320,
                shop_capacity=800,
                required_delivery_date="2026-10-15"
            ),
            "dst-5": Destination(
                id="dst-5",
                name="Jaipur Retail Hub",
                location="Rajasthan, India",
                lat=26.9124,
                lng=75.7873,
                demand=450,
                priority="Medium",
                delivered_qty=0,
                product_name="FMCG Staples",
                current_stock=80,
                safety_stock=40,
                incoming_stock=0,
                historical_sales=420,
                shop_capacity=900,
                required_delivery_date="2026-10-12"
            ),
            "dst-6": Destination(
                id="dst-6",
                name="Nagpur Central Node",
                location="Maharashtra, India",
                lat=21.1458,
                lng=79.0882,
                demand=300,
                priority="Low",
                delivered_qty=0,
                product_name="Electronics & Sensors",
                current_stock=50,
                safety_stock=20,
                incoming_stock=0,
                historical_sales=280,
                shop_capacity=600,
                required_delivery_date="2026-10-14"
            )
        }

        raw_matrix_costs = {
            ("wh-1", "dst-1"): (12.5, 500, True),
            ("wh-1", "dst-2"): (10.0, 400, True),
            ("wh-1", "dst-3"): (22.0, 450, True),
            ("wh-1", "dst-4"): (14.0, 350, True),
            ("wh-1", "dst-5"): (19.5, 400, True),
            ("wh-1", "dst-6"): (8.5,  500, True),

            ("wh-2", "dst-1"): (15.0, 500, True),
            ("wh-2", "dst-2"): (7.5,  400, True),
            ("wh-2", "dst-3"): (26.0, 350, True),
            ("wh-2", "dst-4"): (9.0,  450, True),
            ("wh-2", "dst-5"): (23.0, 400, True),
            ("wh-2", "dst-6"): (14.0, 400, True),

            ("wh-3", "dst-1"): (20.0, 450, True),
            ("wh-3", "dst-2"): (18.0, 300, True),
            ("wh-3", "dst-3"): (21.0, 500, True),
            ("wh-3", "dst-4"): (11.0, 450, True),
            ("wh-3", "dst-5"): (27.0, 300, True),
            ("wh-3", "dst-6"): (16.5, 400, True),

            ("wh-4", "dst-1"): (6.5,  600, True),
            ("wh-4", "dst-2"): (14.0, 550, True),
            ("wh-4", "dst-3"): (25.0, 400, True),
            ("wh-4", "dst-4"): (18.0, 350, True),
            ("wh-4", "dst-5"): (16.0, 450, True),
            ("wh-4", "dst-6"): (13.0, 450, True),

            ("wh-5", "dst-1"): (21.0, 400, True),
            ("wh-5", "dst-2"): (22.0, 500, True),
            ("wh-5", "dst-3"): (19.0, 550, True),
            ("wh-5", "dst-4"): (32.0, 300, True),
            ("wh-5", "dst-5"): (7.5,  600, True),
            ("wh-5", "dst-6"): (15.0, 450, True)
        }

        self.matrix: Dict[Tuple[str, str], MatrixEntry] = {}
        for (w_id, d_id), (cost, cap, active) in raw_matrix_costs.items():
            self.matrix[(w_id, d_id)] = MatrixEntry(
                warehouse_id=w_id,
                destination_id=d_id,
                cost_per_unit=cost,
                route_capacity=cap,
                active=active
            )

        self.last_optimization_result = None
        self.last_replenishment_plan = None

    def get_all_warehouses(self) -> List[Warehouse]:
        return list(self.warehouses.values())

    def get_all_destinations(self) -> List[Destination]:
        return list(self.destinations.values())

    def get_matrix_entries(self) -> List[MatrixEntry]:
        return list(self.matrix.values())

    def update_warehouse(self, wh: Warehouse):
        self.warehouses[wh.id] = wh

    def delete_warehouse(self, wh_id: str):
        if wh_id in self.warehouses:
            del self.warehouses[wh_id]
            self.matrix = {k: v for k, v in self.matrix.items() if k[0] != wh_id}

    def update_destination(self, dst: Destination):
        self.destinations[dst.id] = dst

    def delete_destination(self, dst_id: str):
        if dst_id in self.destinations:
            del self.destinations[dst_id]
            self.matrix = {k: v for k, v in self.matrix.items() if k[1] != dst_id}

    def update_matrix(self, entries: List[MatrixEntry]):
        for entry in entries:
            self.matrix[(entry.warehouse_id, entry.destination_id)] = entry

store = DataStore()
