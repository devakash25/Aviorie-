import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Package, LogOut, MapPin, Users } from 'lucide-react';

const ManagerDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const response = await api.get('/admin/all-users');
      setDeliveryPartners(response.data.filter(u => u.role === 'delivery_partner' && u.is_approved));
    } catch (error) {
      console.error('Failed to load delivery partners');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-xl">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Area Manager</h1>
              <p className="text-sm text-gray-600">{user?.full_name}</p>
            </div>
          </div>
          
          <Button data-testid="logout-btn" onClick={onLogout} variant="ghost" size="sm" className="text-gray-700">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Area Orders</h2>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-600">No orders in your area</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="p-6 border-sky-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-600 mt-1">Customer: {order.customer_name}</p>
                    <p className="text-sm text-gray-600">Address: {order.customer_address}</p>
                    <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} px-4 py-2 rounded-full`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 bg-sky-50 p-4 rounded-xl">
                  <h4 className="font-semibold text-gray-800">Items:</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="text-gray-800 font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-sky-200 pt-2 mt-2 flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-sky-600">₹{order.total_amount}</span>
                  </div>
                </div>

                {order.delivery_partner_id && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">Assigned to delivery partner</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;