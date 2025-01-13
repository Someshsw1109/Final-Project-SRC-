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
        <div className="flex h-screen bg-gradient-to-br from-blue-900 to-violet-950">
            {/* Sidebar */}
            <div className="hidden md:flex w-64 flex-col fixed h-screen bg-gradient-to-b from-violet-950 to-blue-900 border-r border-violet-800/20">
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-violet-100 mb-8">Admin</h1>
                    <div className="flex items-center space-x-3 mb-8">
                        <img 
                            src={user?.photoURL || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adminfy-A6G3wYER4AFhamlxVMiINYyxFG6cCX.png"} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border-2 border-violet-500"
                        />
                        <div>
                            <h2 className="text-violet-100 font-medium">{user?.name || 'Admin User'}</h2>
                            <p className="text-violet-400 text-sm">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 md:ml-64">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-900 to-violet-900 shadow-lg">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center flex-1">
                            <Menu className="md:hidden mr-4 text-violet-100" />
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-violet-900/50 border border-violet-700 focus:outline-none focus:border-violet-500 text-violet-100 placeholder-violet-400"
                                />
                                <Search className="absolute left-3 top-2.5 text-violet-400" size={20} />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-violet-300 hover:text-violet-100">
                                <Bell size={20} />
                            </button>
                            <button className="p-2 text-violet-300 hover:text-violet-100">
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
                            className="p-6 rounded-2xl bg-gradient-to-r from-blue-800 to-violet-800 shadow-lg border border-blue-700/30"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2 text-blue-100">Total Products</h3>
                            <p className="text-3xl font-bold text-blue-50">{getAllProduct.length}</p>
                            <div className="mt-4 h-2 bg-blue-900/50 rounded-full">
                                <div className="h-2 bg-blue-400 rounded-full" style={{width: '70%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-violet-800 to-blue-800 shadow-lg border border-violet-700/30"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2 text-violet-100">Total Orders</h3>
                            <p className="text-3xl font-bold text-violet-50">{getAllOrder.length}</p>
                            <div className="mt-4 h-2 bg-violet-900/50 rounded-full">
                                <div className="h-2 bg-violet-400 rounded-full" style={{width: '85%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-blue-800 to-violet-800 shadow-lg border border-blue-700/30"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2 text-blue-100">Total Users</h3>
                            <p className="text-3xl font-bold text-blue-50">{getAllUser.length}</p>
                            <div className="mt-4 h-2 bg-blue-900/50 rounded-full">
                                <div className="h-2 bg-blue-400 rounded-full" style={{width: '60%'}}></div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="p-6 rounded-2xl bg-gradient-to-r from-violet-800 to-blue-800 shadow-lg border border-violet-700/30"
                            whileHover={{ scale: 1.02 }}
                        >
                            <h3 className="text-lg font-medium mb-2 text-violet-100">Revenue</h3>
                            <p className="text-3xl font-bold text-violet-50">$12,426</p>
                            <div className="mt-4 h-2 bg-violet-900/50 rounded-full">
                                <div className="h-2 bg-violet-400 rounded-full" style={{width: '75%'}}></div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-gradient-to-br from-blue-900 to-violet-900 rounded-2xl shadow-lg border border-violet-800/20 p-6">
                        <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                            <TabList className="flex space-x-4 border-b border-violet-800/30 mb-6">
                                {['Products', 'Orders', 'Users'].map((tab, index) => (
                                    <Tab 
                                        key={index}
                                        className={`pb-4 px-4 text-sm font-medium outline-none cursor-pointer ${
                                            activeTab === index 
                                                ? 'text-violet-200 border-b-2 border-violet-400' 
                                                : 'text-violet-400 hover:text-violet-200'
                                        }`}
                                    >
                                        {tab}
                                    </Tab>
                                ))}
                            </TabList>

                            <div className="bg-gradient-to-br from-blue-900/50 to-violet-900/50 rounded-lg p-4">
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

