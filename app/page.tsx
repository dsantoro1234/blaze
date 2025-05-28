import React, { useState, useMemo } from 'react';
import { Search, User, ShoppingBag, Calendar, TrendingUp, Package, Mail, MousePointer, ShoppingCart, Filter, ChevronDown, ChevronRight, Eye, Download, Plus, Edit2, MoreVertical, Globe, Store } from 'lucide-react';

// Tipi TypeScript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  totalSpent: number;
  orderCount: number;
  lastPurchase: string;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  preferredChannel: 'online' | 'store' | 'both';
}

interface Order {
  id: string;
  customerId: string;
  date: string;
  total: number;
  channel: 'online' | 'store';
  items: OrderItem[];
  status: 'completed' | 'processing' | 'shipped' | 'delivered';
}

interface OrderItem {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
}

interface Journey {
  id: string;
  customerId: string;
  timestamp: string;
  type: 'visit' | 'email_open' | 'purchase' | 'add_to_cart' | 'store_visit';
  details: string;
  channel: 'online' | 'store' | 'email';
  value?: number;
}

// Dati Mock
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Giovanna Battaglia',
    email: 'giovanna.battaglia@email.com',
    phone: '+39 02 1234567',
    registrationDate: '2023-01-15',
    totalSpent: 28500,
    orderCount: 12,
    lastPurchase: '2025-05-20',
    loyaltyTier: 'Platinum',
    preferredChannel: 'both'
  },
  {
    id: '2',
    name: 'Isabella Rossellini',
    email: 'isabella.r@email.com',
    phone: '+39 02 7654321',
    registrationDate: '2023-06-20',
    totalSpent: 15200,
    orderCount: 8,
    lastPurchase: '2025-05-18',
    loyaltyTier: 'Gold',
    preferredChannel: 'online'
  },
  {
    id: '3',
    name: 'Luisa Ferragni',
    email: 'luisa.f@email.com',
    phone: '+39 02 5555555',
    registrationDate: '2024-01-10',
    totalSpent: 42300,
    orderCount: 15,
    lastPurchase: '2025-05-25',
    loyaltyTier: 'Platinum',
    preferredChannel: 'store'
  },
  {
    id: '4',
    name: 'Sofia Coppola',
    email: 'sofia.c@email.com',
    phone: '+39 02 9999999',
    registrationDate: '2024-03-15',
    totalSpent: 8900,
    orderCount: 4,
    lastPurchase: '2025-05-10',
    loyaltyTier: 'Silver',
    preferredChannel: 'online'
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: '1',
    date: '2025-05-20',
    total: 3500,
    channel: 'online',
    status: 'delivered',
    items: [
      { name: 'Everyday Blazer - Rosé', sku: 'BLZ-001', price: 2200, quantity: 1, category: 'Blazer' },
      { name: 'Silk Scarf - Midnight', sku: 'ACC-005', price: 1300, quantity: 1, category: 'Accessories' }
    ]
  },
  {
    id: 'ORD002',
    customerId: '1',
    date: '2025-05-15',
    total: 4800,
    channel: 'store',
    status: 'completed',
    items: [
      { name: 'Charmer Blazer - Noir', sku: 'BLZ-003', price: 2800, quantity: 1, category: 'Blazer' },
      { name: 'Silk Blouse - Ivory', sku: 'TOP-002', price: 2000, quantity: 1, category: 'Top' }
    ]
  },
  {
    id: 'ORD003',
    customerId: '2',
    date: '2025-05-18',
    total: 2200,
    channel: 'online',
    status: 'processing',
    items: [
      { name: 'Everyday Blazer - Blush', sku: 'BLZ-002', price: 2200, quantity: 1, category: 'Blazer' }
    ]
  },
  {
    id: 'ORD004',
    customerId: '3',
    date: '2025-05-25',
    total: 6500,
    channel: 'store',
    status: 'completed',
    items: [
      { name: 'Limited Edition Blazer', sku: 'BLZ-LTD', price: 4500, quantity: 1, category: 'Limited Edition' },
      { name: 'Silk Pocket Square Set', sku: 'ACC-010', price: 2000, quantity: 1, category: 'Accessories' }
    ]
  }
];

const mockJourneys: Journey[] = [
  // Giovanna Battaglia - Platinum, 12 ordini, €28,500
  { id: 'J001', customerId: '1', timestamp: '2025-05-27 10:30', type: 'visit', details: 'Visualizzato collezione SS25', channel: 'online' },
  { id: 'J002', customerId: '1', timestamp: '2025-05-26 14:20', type: 'email_open', details: 'Newsletter Nuova Collezione', channel: 'email' },
  { id: 'J003', customerId: '1', timestamp: '2025-05-25 16:45', type: 'add_to_cart', details: 'Charmer Blazer - Noir', channel: 'online' },
  { id: 'J004', customerId: '1', timestamp: '2025-05-20 11:00', type: 'purchase', details: 'Ordine #ORD001', channel: 'online', value: 3500 },
  { id: 'J005', customerId: '1', timestamp: '2025-05-15 15:30', type: 'store_visit', details: 'Visita boutique Milano', channel: 'store' },
  { id: 'J006', customerId: '1', timestamp: '2025-05-15 16:00', type: 'purchase', details: 'Ordine #ORD002', channel: 'store', value: 4800 },
  { id: 'J007', customerId: '1', timestamp: '2025-05-10 09:15', type: 'email_open', details: 'Private Sale Invitation', channel: 'email' },
  { id: 'J008', customerId: '1', timestamp: '2025-04-28 14:00', type: 'purchase', details: 'Limited Edition Blazer', channel: 'store', value: 5200 },
  { id: 'J009', customerId: '1', timestamp: '2025-04-20 11:30', type: 'visit', details: 'Configuratore blazer personalizzato', channel: 'online' },
  { id: 'J010', customerId: '1', timestamp: '2025-03-15 16:00', type: 'store_visit', details: 'Evento VIP Spring Collection', channel: 'store' },
  
  // Isabella Rossellini - Gold, 8 ordini, €15,200
  { id: 'J011', customerId: '2', timestamp: '2025-05-27 08:45', type: 'visit', details: 'Homepage e New Arrivals', channel: 'online' },
  { id: 'J012', customerId: '2', timestamp: '2025-05-25 19:20', type: 'add_to_cart', details: 'Silk Blouse - Pearl', channel: 'online' },
  { id: 'J013', customerId: '2', timestamp: '2025-05-23 10:00', type: 'email_open', details: 'Birthday Special Offer', channel: 'email' },
  { id: 'J014', customerId: '2', timestamp: '2025-05-18 14:30', type: 'purchase', details: 'Ordine #ORD003', channel: 'online', value: 2200 },
  { id: 'J015', customerId: '2', timestamp: '2025-05-05 11:15', type: 'visit', details: 'Collezione Resort 2025', channel: 'online' },
  { id: 'J016', customerId: '2', timestamp: '2025-04-22 15:45', type: 'purchase', details: 'Blazer + Accessori', channel: 'online', value: 3800 },
  { id: 'J017', customerId: '2', timestamp: '2025-04-10 09:30', type: 'email_open', details: 'Exclusive Online Preview', channel: 'email' },
  { id: 'J018', customerId: '2', timestamp: '2025-03-28 16:20', type: 'add_to_cart', details: 'Charmer Blazer - Blush', channel: 'online' },
  
  // Luisa Ferragni - Platinum, 15 ordini, €42,300
  { id: 'J019', customerId: '3', timestamp: '2025-05-27 11:00', type: 'store_visit', details: 'Personal Shopping Appointment', channel: 'store' },
  { id: 'J020', customerId: '3', timestamp: '2025-05-26 09:30', type: 'email_open', details: 'VIP Preview FW25', channel: 'email' },
  { id: 'J021', customerId: '3', timestamp: '2025-05-25 15:00', type: 'purchase', details: 'Ordine #ORD004', channel: 'store', value: 6500 },
  { id: 'J022', customerId: '3', timestamp: '2025-05-22 14:00', type: 'store_visit', details: 'Fitting personalizzato', channel: 'store' },
  { id: 'J023', customerId: '3', timestamp: '2025-05-20 10:30', type: 'email_open', details: 'Thank You - Recent Purchase', channel: 'email' },
  { id: 'J024', customerId: '3', timestamp: '2025-05-15 16:30', type: 'purchase', details: 'Capsule Collection Items', channel: 'store', value: 8900 },
  { id: 'J025', customerId: '3', timestamp: '2025-05-10 11:00', type: 'store_visit', details: 'Preview nuova collezione', channel: 'store' },
  { id: 'J026', customerId: '3', timestamp: '2025-05-05 09:15', type: 'visit', details: 'Wishlist management', channel: 'online' },
  { id: 'J027', customerId: '3', timestamp: '2025-04-28 15:30', type: 'purchase', details: 'Birthday Shopping', channel: 'store', value: 12000 },
  { id: 'J028', customerId: '3', timestamp: '2025-04-20 14:00', type: 'store_visit', details: 'Style consultation', channel: 'store' },
  { id: 'J029', customerId: '3', timestamp: '2025-04-15 10:00', type: 'email_open', details: 'Exclusive Invitation - Milan Fashion Week', channel: 'email' },
  { id: 'J030', customerId: '3', timestamp: '2025-03-30 16:00', type: 'purchase', details: 'Pre-order SS25', channel: 'store', value: 7500 },
  
  // Sofia Coppola - Silver, 4 ordini, €8,900
  { id: 'J031', customerId: '4', timestamp: '2025-05-26 20:30', type: 'visit', details: 'Browsing Evening Collection', channel: 'online' },
  { id: 'J032', customerId: '4', timestamp: '2025-05-24 18:45', type: 'add_to_cart', details: 'Silk Scarf Set', channel: 'online' },
  { id: 'J033', customerId: '4', timestamp: '2025-05-20 12:00', type: 'email_open', details: 'Welcome to Silver Tier', channel: 'email' },
  { id: 'J034', customerId: '4', timestamp: '2025-05-10 10:30', type: 'purchase', details: 'First Blazer Purchase', channel: 'online', value: 2200 },
  { id: 'J035', customerId: '4', timestamp: '2025-04-25 14:15', type: 'visit', details: 'Size guide consultation', channel: 'online' },
  { id: 'J036', customerId: '4', timestamp: '2025-04-15 11:00', type: 'purchase', details: 'Accessories Bundle', channel: 'online', value: 1800 },
  { id: 'J037', customerId: '4', timestamp: '2025-03-20 09:30', type: 'visit', details: 'First website visit', channel: 'online' },
  { id: 'J038', customerId: '4', timestamp: '2025-03-15 16:00', type: 'add_to_cart', details: 'Everyday Blazer', channel: 'online' },
];

// Componenti
const Sidebar = ({ activeView, setActiveView }: { activeView: string; setActiveView: (view: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'customers', label: 'Clienti', icon: User },
    { id: 'orders', label: 'Ordini', icon: ShoppingBag },
  ];

  return (
    <div className="w-64 bg-black text-white h-screen fixed left-0 top-0">
      <div className="p-4 bg-gradient-to-br from-white to-gray-100 m-3 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-transparent opacity-50 rounded-xl blur-xl"></div>
          <div className="relative z-10 px-2">
            <div className="font-bold tracking-wider" style={{ fontSize: '18px', letterSpacing: '0.15em', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span className="text-black">BLAZÉ MILANO</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">CRM - Luxury Fashion Management</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-gray-500 mr-2">powered by</span>
              <span 
                className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
                style={{ letterSpacing: '0.05em' }}
              >
                connecteed
              </span>
            </div>
          </div>
        </div>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full px-6 py-4 flex items-center space-x-3 transition-all duration-200
                ${activeView === item.id 
                  ? 'bg-white text-black' 
                  : 'hover:bg-gray-900 text-gray-300 hover:text-white'}`}
            >
              <Icon size={20} />
              <span className="font-light tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

const Dashboard = ({ customers, orders }: { customers: Customer[]; orders: Order[] }) => {
  const [dateFilter, setDateFilter] = useState(14);
  
  const stats = useMemo(() => {
    const now = new Date();
    const filterDate = new Date(now.getTime() - dateFilter * 24 * 60 * 60 * 1000);
    
    const filteredOrders = orders.filter(order => new Date(order.date) >= filterDate);
    
    return {
      totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
      orderCount: filteredOrders.length,
      avgOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length 
        : 0,
      newCustomers: customers.filter(c => new Date(c.registrationDate) >= filterDate).length,
      onlineOrders: filteredOrders.filter(o => o.channel === 'online').length,
      storeOrders: filteredOrders.filter(o => o.channel === 'store').length,
    };
  }, [customers, orders, dateFilter]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Filter size={20} />
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(Number(e.target.value))}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value={7}>Ultimi 7 giorni</option>
            <option value={14}>Ultimi 14 giorni</option>
            <option value={30}>Ultimi 30 giorni</option>
            <option value={90}>Ultimi 90 giorni</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Fatturato Totale</p>
              <p className="text-3xl font-light mt-2">€{stats.totalRevenue.toLocaleString('it-IT')}</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Ordini Totali</p>
              <p className="text-3xl font-light mt-2">{stats.orderCount}</p>
            </div>
            <ShoppingBag className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Valore Medio Ordine</p>
              <p className="text-3xl font-light mt-2">€{Math.round(stats.avgOrderValue).toLocaleString('it-IT')}</p>
            </div>
            <Package className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-light mb-4">Canali di Vendita</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="text-blue-500" size={20} />
                <span>Online</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(stats.onlineOrders / stats.orderCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{stats.onlineOrders} ordini</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Store className="text-green-500" size={20} />
                <span>Negozio</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(stats.storeOrders / stats.orderCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{stats.storeOrders} ordini</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-light mb-4">Top Clienti</h3>
          <div className="space-y-3">
            {customers
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((customer) => (
                <div key={customer.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.loyaltyTier}</p>
                  </div>
                  <p className="font-light">€{customer.totalSpent.toLocaleString('it-IT')}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerList = ({ customers, onSelectCustomer }: { customers: Customer[]; onSelectCustomer: (customer: Customer) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'bg-gray-900 text-white';
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Silver': return 'bg-gray-400 text-white';
      default: return 'bg-orange-600 text-white';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light">Clienti</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Aggiungi Cliente</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cerca clienti..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                <th className="text-left p-4 font-medium text-gray-700">Tier</th>
                <th className="text-left p-4 font-medium text-gray-700">Totale Speso</th>
                <th className="text-left p-4 font-medium text-gray-700">Ordini</th>
                <th className="text-left p-4 font-medium text-gray-700">Ultimo Acquisto</th>
                <th className="text-left p-4 font-medium text-gray-700">Canale Preferito</th>
                <th className="text-left p-4 font-medium text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${getTierColor(customer.loyaltyTier)}`}>
                      {customer.loyaltyTier}
                    </span>
                  </td>
                  <td className="p-4">€{customer.totalSpent.toLocaleString('it-IT')}</td>
                  <td className="p-4">{customer.orderCount}</td>
                  <td className="p-4">{new Date(customer.lastPurchase).toLocaleDateString('it-IT')}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {customer.preferredChannel === 'online' && <Globe size={16} />}
                      {customer.preferredChannel === 'store' && <Store size={16} />}
                      {customer.preferredChannel === 'both' && (
                        <>
                          <Globe size={16} />
                          <Store size={16} />
                        </>
                      )}
                      <span className="text-sm capitalize">{customer.preferredChannel}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onSelectCustomer(customer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-light mb-6">Aggiungi Nuovo Cliente</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="tel"
                placeholder="Telefono"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderList = ({ orders, customers }: { orders: Order[]; customers: Customer[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Cliente sconosciuto';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-light">Ordini</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Aggiungi Ordine</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cerca ordini..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-700">ID Ordine</th>
                <th className="text-left p-4 font-medium text-gray-700">Cliente</th>
                <th className="text-left p-4 font-medium text-gray-700">Data</th>
                <th className="text-left p-4 font-medium text-gray-700">Totale</th>
                <th className="text-left p-4 font-medium text-gray-700">Canale</th>
                <th className="text-left p-4 font-medium text-gray-700">Stato</th>
                <th className="text-left p-4 font-medium text-gray-700">Dettagli</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{getCustomerName(order.customerId)}</td>
                    <td className="p-4">{new Date(order.date).toLocaleDateString('it-IT')}</td>
                    <td className="p-4">€{order.total.toLocaleString('it-IT')}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {order.channel === 'online' ? <Globe size={16} /> : <Store size={16} />}
                        <span className="text-sm capitalize">{order.channel}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {expandedOrder === order.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={7} className="p-4 bg-gray-50">
                        <div className="space-y-2">
                          <h4 className="font-medium mb-3">Articoli ordinati:</h4>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">SKU: {item.sku} | Categoria: {item.category}</p>
                              </div>
                              <div className="text-right">
                                <p>€{item.price.toLocaleString('it-IT')} x {item.quantity}</p>
                                <p className="font-medium">€{(item.price * item.quantity).toLocaleString('it-IT')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-light mb-6">Aggiungi Nuovo Ordine</h3>
            <div className="space-y-4">
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                <option value="">Seleziona Cliente</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Totale Ordine (€)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                <option value="online">Online</option>
                <option value="store">Negozio</option>
              </select>
              <div className="flex space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annulla
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Aggiungi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerJourney = ({ customer, journeys, orders, customers, onSelectCustomer }: { 
  customer: Customer | null; 
  journeys: Journey[]; 
  orders: Order[];
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getJourneyIcon = (type: Journey['type']) => {
    switch (type) {
      case 'visit': return <MousePointer className="text-blue-500" size={20} />;
      case 'email_open': return <Mail className="text-purple-500" size={20} />;
      case 'purchase': return <ShoppingBag className="text-green-500" size={20} />;
      case 'add_to_cart': return <ShoppingCart className="text-orange-500" size={20} />;
      case 'store_visit': return <Store className="text-indigo-500" size={20} />;
    }
  };

  const getJourneyLabel = (type: Journey['type']) => {
    switch (type) {
      case 'visit': return 'Visita Sito';
      case 'email_open': return 'Email Aperta';
      case 'purchase': return 'Acquisto';
      case 'add_to_cart': return 'Aggiunto al Carrello';
      case 'store_visit': return 'Visita Negozio';
    }
  };

  const customerJourneys = customer ? journeys
    .filter(j => j.customerId === customer.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-light mb-8">Customer Journey</h2>
      
      {/* Search Bar - Always visible */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cerca cliente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        
        {showSearchDropdown && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCustomer(c);
                    setSearchTerm('');
                    setShowSearchDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.email}</p>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500">Nessun cliente trovato</div>
            )}
          </div>
        )}
      </div>

      {!customer ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Cerca e seleziona un cliente per visualizzare la sua journey</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-light">{customer.name}</h3>
                <p className="text-gray-500">{customer.email} • {customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Cliente dal</p>
                <p className="font-medium">{new Date(customer.registrationDate).toLocaleDateString('it-IT')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Totale Speso</p>
                <p className="text-xl font-light">€{customer.totalSpent.toLocaleString('it-IT')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ordini Totali</p>
                <p className="text-xl font-light">{customer.orderCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tier</p>
                <p className="text-xl font-light">{customer.loyaltyTier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Canale Preferito</p>
                <p className="text-xl font-light capitalize">{customer.preferredChannel}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-light mb-6">Timeline Interazioni</h3>
            <div className="space-y-6">
              {customerJourneys.map((journey, index) => (
                <div key={journey.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getJourneyIcon(journey.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{getJourneyLabel(journey.type)}</p>
                        <p className="text-sm text-gray-500">{journey.details}</p>
                        {journey.value && (
                          <p className="text-sm font-medium mt-1">€{journey.value.toLocaleString('it-IT')}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(journey.timestamp).toLocaleDateString('it-IT')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(journey.timestamp).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Main App Component
export default function LuxuryFashionCRM() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveView('journey');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 ml-64 overflow-y-auto">
        {activeView === 'dashboard' && <Dashboard customers={mockCustomers} orders={mockOrders} />}
        {activeView === 'customers' && <CustomerList customers={mockCustomers} onSelectCustomer={handleSelectCustomer} />}
        {activeView === 'orders' && <OrderList orders={mockOrders} customers={mockCustomers} />}
        {activeView === 'journey' && <CustomerJourney customer={selectedCustomer} journeys={mockJourneys} orders={mockOrders} customers={mockCustomers} onSelectCustomer={handleSelectCustomer} />}
      </div>
    </div>
  );
}
