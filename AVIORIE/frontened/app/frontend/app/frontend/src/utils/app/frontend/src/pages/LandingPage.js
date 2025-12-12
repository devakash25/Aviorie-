import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Users, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';

const LandingPage = ({ user }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      const roleRoutes = {
        customer: '/customer',
        delivery_partner: '/delivery-partner',
        manager: '/manager',
        admin: '/admin'
      };
      navigate(roleRoutes[user.role] || '/');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-sky-100">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-xl">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Aviorie</h1>
        </div>
        <nav className="flex items-center space-x-4">
          {user ? (
            <Button 
              data-testid="dashboard-button"
              onClick={handleGetStarted} 
              className="bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 rounded-full px-6 py-2">
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button 
                data-testid="login-button"
                onClick={() => navigate('/auth')} 
                variant="ghost" 
                className="text-sky-600 hover:bg-sky-50 rounded-full px-6">
                Login
              </Button>
              <Button 
                data-testid="signup-button"
                onClick={() => navigate('/auth?mode=signup')} 
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 rounded-full px-6 py-2">
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 fade-in">
            <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                Household Essentials
              </span>
              <br />
              <span className="text-gray-800">Delivered to Your Door</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Order cleaning supplies, phenyl, harpic, and more. Fast delivery, cash on delivery available.
            </p>
            <Button 
              data-testid="get-started-btn"
              onClick={handleGetStarted} 
              size="lg" 
              className="bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 rounded-full px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl">
              Get Started
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <FeatureCard 
              icon={<ShoppingBag className="w-12 h-12" />}
              title="Easy Shopping"
              description="Browse and order your favorite household products"
            />
            <FeatureCard 
              icon={<Truck className="w-12 h-12" />}
              title="Fast Delivery"
              description="Quick doorstep delivery with real-time tracking"
            />
            <FeatureCard 
              icon={<Package className="w-12 h-12" />}
              title="Quality Products"
              description="Genuine brands - Phenyl, Harpic, Lizol, and more"
            />
            <FeatureCard 
              icon={<Users className="w-12 h-12" />}
              title="24/7 Support"
              description="Customer support always ready to help"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800">
            How <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">Aviorie</span> Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              number="1"
              title="Browse Products"
              description="Select from our wide range of household cleaning supplies"
            />
            <StepCard 
              number="2"
              title="Place Order"
              description="Add to cart and checkout with Cash on Delivery"
            />
            <StepCard 
              number="3"
              title="Get Delivered"
              description="Receive your products at your doorstep"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Aviorie</h2>
          </div>
          <p className="text-sky-100">Your trusted partner for household essentials delivery</p>
          <p className="mt-4 text-sm text-sky-200">© 2025 Aviorie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-sky-100 hover:border-sky-300 hover:shadow-xl transform hover:-translate-y-2 transition-all">
    <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white p-4 rounded-xl inline-block mb-4">
      {icon}
    </div>
    <h4 className="text-xl font-bold mb-2 text-gray-800">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="bg-gradient-to-br from-sky-400 to-blue-500 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold shadow-lg">
      {number}
    </div>
    <h4 className="text-2xl font-bold mb-3 text-gray-800">{title}</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
