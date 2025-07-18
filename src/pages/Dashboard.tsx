
import { Car, Wifi, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

// Declare Leaflet types for TypeScript
declare global {
  interface Window {
    L: any;
  }
}

const Dashboard = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  
  // Mock vehicle data - in real app this would come from API
  const [vehicles] = useState([
    { id: 1, name: 'Vehicle-001', status: 'online', lat: 40.7128, lng: -74.0060, speed: 45, battery: 85 },
    { id: 2, name: 'Vehicle-002', status: 'idle', lat: 40.7589, lng: -73.9851, speed: 0, battery: 65 },
    { id: 3, name: 'Vehicle-003', status: 'offline', lat: 40.6892, lng: -74.0445, speed: 0, battery: 15 },
    { id: 4, name: 'Vehicle-004', status: 'online', lat: 40.7505, lng: -73.9934, speed: 32, battery: 72 },
    { id: 5, name: 'Vehicle-005', status: 'online', lat: 40.7282, lng: -73.7949, speed: 28, battery: 91 },
  ]);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        leafletCSS.crossOrigin = '';
        document.head.appendChild(leafletCSS);
      }

      // Add Leaflet JS
      if (!window.L) {
        return new Promise((resolve) => {
          const leafletJS = document.createElement('script');
          leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          leafletJS.crossOrigin = '';
          leafletJS.onload = resolve;
          document.head.appendChild(leafletJS);
        });
      }
    };

    const initializeMap = async () => {
      await loadLeaflet();
      
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Initialize map centered on New York
        mapInstanceRef.current = window.L.map(mapRef.current).setView([40.7128, -74.0060], 11);
        
        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add markers for vehicles
        vehicles.forEach(vehicle => {
          const getMarkerColor = (status: string) => {
            switch (status) {
              case 'online': return '#22c55e';
              case 'idle': return '#eab308';
              case 'offline': return '#6b7280';
              default: return '#6b7280';
            }
          };

          const customIcon = window.L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${getMarkerColor(vehicle.status)}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
              <div style="color: white; font-size: 10px; font-weight: bold;">${vehicle.id}</div>
            </div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });

          const popupContent = `
            <div style="padding: 8px;">
              <h4 style="margin: 0 0 8px 0; font-weight: bold;">${vehicle.name}</h4>
              <p style="margin: 0; font-size: 12px;"><strong>Status:</strong> ${vehicle.status}</p>
              <p style="margin: 0; font-size: 12px;"><strong>Speed:</strong> ${vehicle.speed} km/h</p>
              <p style="margin: 0; font-size: 12px;"><strong>Battery:</strong> ${vehicle.battery}%</p>
            </div>
          `;

          window.L.marker([vehicle.lat, vehicle.lng], { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(popupContent);
        });

        // Invalidate size after a short delay to ensure proper rendering
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg md:text-2xl font-bold text-gray-800">Vehicle Dashboard</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full font-medium">8 Online</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">2 Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">10</p>
                <p className="text-xs text-green-600 mt-1">+2 this month</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                <Car className="text-blue-600 text-2xl h-7 w-7" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Online Now</p>
                <p className="text-3xl font-bold text-green-600 mt-1">8</p>
                <p className="text-xs text-gray-500 mt-1">80% active rate</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center">
                <Wifi className="text-green-600 text-2xl h-7 w-7" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600 mt-1">3</p>
                <p className="text-xs text-red-600 mt-1">Needs attention</p>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                <span
                  className="text-red-600 text-2xl h-7 w-7 flex items-center justify-center"
                  aria-label="Alert"
                  role="img"
                >⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Distance Today</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">1,247</p>
                <p className="text-xs text-gray-500 mt-1">km traveled</p>
              </div>
              <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center">
                <Route className="text-yellow-600 text-2xl h-7 w-7" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm h-[650px] overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Live Vehicle Tracking</h2>
                  <p className="text-sm text-gray-600 mt-1">Real-time monitoring of your fleet</p>
                </div>
                <div className="flex space-x-2">
                  <Button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">All Vehicles</Button>
                  <Button variant="outline" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">Active Only</Button>
                </div>
              </div>
              <div className="h-full bg-gray-50 relative">
                <div ref={mapRef} className="w-full h-full z-0"></div>
                <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 z-10">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Online: 8 vehicles</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <span className="font-medium">Offline: 2 vehicles</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-medium">Alerts: 3 active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Device Cards */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Vehicle Status</h3>
                  <p className="text-sm text-gray-600">Live device monitoring</p>
                </div>
                <button className="text-blue-600 text-sm hover:underline font-medium">View All</button>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                <div className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-gray-800">Vehicle-001</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">Online</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Speed:</span>
                      <span className="font-medium">45 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Battery:</span>
                      <span className="font-medium text-green-600">85%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    📍 Downtown Area, City Center
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">Vehicle-002</span>
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">Idle</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-medium">0 km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className="font-medium text-yellow-600">65%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      📍 Parking Lot B, Main Street
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">Vehicle-003</span>
                    <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">Offline</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Speed:</span>
                      <span className="font-medium">-- km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Battery:</span>
                      <span className="font-medium text-red-600">15%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      📍 Last seen: Industrial Zone
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Recent Alerts</h3>
                <button className="text-blue-600 text-sm hover:underline">View All</button>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-500 mt-1 h-4 w-4 text-lg" aria-label="Alert" role="img">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Overspeed Alert</p>
                    <p className="text-xs text-gray-600">Vehicle-001 exceeded 60 km/h</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-500 mt-1">📍</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Geofence Exit</p>
                    <p className="text-xs text-gray-600">Vehicle-002 left authorized zone</p>
                    <p className="text-xs text-gray-500 mt-1">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-red-500 mt-1">🔋</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Low Battery</p>
                    <p className="text-xs text-gray-600">Vehicle-003 battery below 20%</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
