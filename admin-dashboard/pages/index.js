import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { adminAPI } from '../lib/api';
import { toast } from 'react-hot-toast';
import {
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiMenu,
  FiLogOut
} from 'react-icons/fi';

export default function Dashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchDashboard();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/login');
    }
  };

  const fetchDashboard = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setMetrics(data);
      
      // Fetch recent orders
      const ordersRes = await adminAPI.getOrders({ limit: 10 });
      setOrders(ordersRes.data.orders);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncInventory = async () => {
    try {
      await adminAPI.syncInventory();
      toast.success('Inventory sync started');
    } catch (error) {
      toast.error('Failed to sync inventory');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge badge-warning',
      confirmed: 'badge badge-info',
      processing: 'badge badge-info',
      shipped: 'badge badge-success',
      delivered: 'badge badge-success',
      cancelled: 'badge badge-danger',
    };
    return badges[status] || 'badge';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - DropShip</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="px-4 space-y-2">
            <Link href="/" className="block px-4 py-3 rounded bg-blue-600">
              Dashboard
            </Link>
            <Link href="/orders" className="block px-4 py-3 rounded hover:bg-gray-800">
              Orders
            </Link>
            <Link href="/products" className="block px-4 py-3 rounded hover:bg-gray-800">
              Products
            </Link>
            <Link href="/customers" className="block px-4 py-3 rounded hover:bg-gray-800">
              Customers
            </Link>
            <Link href="/suppliers" className="block px-4 py-3 rounded hover:bg-gray-800">
              Suppliers
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="absolute bottom-6 left-6 right-6 flex items-center space-x-2 px-4 py-3 rounded hover:bg-gray-800"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <button onClick={handleSyncInventory} className="btn btn-primary">
              Sync Inventory
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Orders</p>
                  <p className="text-3xl font-bold">{metrics?.todayOrders || 0}</p>
                </div>
                <FiShoppingBag className="text-4xl text-blue-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today's Sales</p>
                  <p className="text-3xl font-bold">₹{metrics?.todaySales?.toFixed(2) || 0}</p>
                </div>
                <FiDollarSign className="text-4xl text-green-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Orders</p>
                  <p className="text-3xl font-bold">{metrics?.pendingOrders || 0}</p>
                </div>
                <FiPackage className="text-4xl text-yellow-600" />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{metrics?.totalRevenue?.toFixed(2) || 0}</p>
                </div>
                <FiTrendingUp className="text-4xl text-purple-600" />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Order Number</th>
                    <th className="text-left py-3">Customer</th>
                    <th className="text-left py-3">Amount</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Date</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{order.orderNumber}</td>
                      <td className="py-3">{order.customerEmail}</td>
                      <td className="py-3">₹{order.total}</td>
                      <td className="py-3">
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          {metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 && (
            <div className="card mt-6">
              <h3 className="text-xl font-bold mb-4 text-red-600">
                Low Stock Alert ({metrics.lowStockCount})
              </h3>
              
              <div className="space-y-2">
                {metrics.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <span className="badge badge-danger">
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
