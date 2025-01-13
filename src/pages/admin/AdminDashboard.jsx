import React, { useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion } from 'framer-motion';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import myContext from '../../context/myContext';
import { Search, Bell, Settings, Menu } from 'lucide-react';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users') || '{}');
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser } = context;
    const [activeTab, setActiveTab] = useState(0);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 flex-col fixed h-screen bg-gradient-to-b from-gray-900 to-violet-900">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-white mb-8">SRC Mart Admin Dashboard</h1>
                    <div className="flex items-center space-x-3 mb-8">
                        <img 
                            src={user?.photoURL || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adminfy-A6G3wYER4AFhamlxVMiINYyxFG6cCX.png"} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border-2 border-violet-500"
                        />
                        <div>
                            <h2 className="text-white font-medium">{user?.name || 'Admin User'}</h2>
                            <p className="text-gray-400 text-sm">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1">
                            <Menu className="md:hidden mr-4 text-gray-500" />
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-violet-500"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-500 hover:text-violet-600">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-violet-600">
                                <Settings size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2">Total Products</h3>
                            <p className="text-3xl font-bold">{getAllProduct.length}</p>
                            <div className="mt-4 h-2 bg-white/20 rounded-full">
                                <div className="h-2 bg-white rounded-full" style={{width: '70%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2">Total Orders</h3>
                            <p className="text-3xl font-bold">{getAllOrder.length}</p>
                            <div className="mt-4 h-2 bg-white/20 rounded-full">
                                <div className="h-2 bg-white rounded-full" style={{width: '85%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-purple-700 to-blue-600 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2">Total Users</h3>
                            <p className="text-3xl font-bold">{getAllUser.length}</p>
                            <div className="mt-4 h-2 bg-white/20 rounded-full">
                                <div className="h-2 bg-white rounded-full" style={{width: '60%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-800 text-white"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2">Revenue</h3>
                            <p className="text-3xl font-bold">$12,426</p>
                            <div className="mt-4 h-2 bg-white/20 rounded-full">
                                <div className="h-2 bg-white rounded-full" style={{width: '75%'}}></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                            <TabList className="flex space-x-4 border-b border-gray-200 mb-6">
                                {['Products', 'Orders', 'Users'].map((tab, index) => (
                                    <Tab 
                                        key={index}
                                        className={`pb-4 px-4 text-sm font-medium outline-none cursor-pointer ${
                                            activeTab === index 
                                                ? 'text-violet-600 border-b-2 border-violet-600' 
                                                : 'text-gray-500 hover:text-violet-600'
                                        }`}
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </TabList>

                            <div className="bg-white rounded-lg">
                                <TabPanel>
                                    <ProductDetail />
                                </TabPanel>
                                <TabPanel>
                                    <OrderDetail/>
                                </TabPanel>
                                <TabPanel>
                                    <UserDetail/>
                                </TabPanel>
                            </div>
                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;

