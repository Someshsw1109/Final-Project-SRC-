import React, { useContext, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { motion } from 'framer-motion';
import ProductDetail from '../../components/admin/ProductDetail';
import OrderDetail from '../../components/admin/OrderDetail';
import UserDetail from '../../components/admin/UserDetail';
import myContext from '../../context/myContext';

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
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 min-h-screen p-8">
            <motion.div {...fadeIn} className="max-w-7xl mx-auto">
                {/* Top */}
                <div className="mb-10">
                    <motion.div 
                        className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-pink-500"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <h1 className="text-3xl font-bold text-pink-600 text-center">Admin Dashboard</h1>
                    </motion.div>
                </div>

                {/* Mid */}
                <motion.div {...fadeIn} className="mb-10">
                    <div className="bg-white shadow-lg rounded-2xl p-8 border border-pink-100">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="mb-6 md:mb-0 md:mr-6">
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/128/2202/2202112.png" 
                                    alt="Admin" 
                                    className="w-32 h-32 rounded-full border-4 border-pink-300"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{user?.name || 'Admin Name'}</h2>
                                <p className="text-gray-600 mb-1"><span className="font-medium">Email:</span> {user?.email || 'admin@example.com'}</p>
                                <p className="text-gray-600 mb-1"><span className="font-medium">Date Joined:</span> {user?.date || 'N/A'}</p>
                                <p className="text-gray-600"><span className="font-medium">Role:</span> <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-sm">{user?.role || 'Administrator'}</span></p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom */}
                <motion.div {...fadeIn}>
                    <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
                        <TabList className="flex flex-wrap mb-8 space-x-2">
                            {[
                                { icon: "shopping-basket", title: "Products", count: getAllProduct.length },
                                { icon: "list-ordered", title: "Orders", count: getAllOrder.length },
                                { icon: "users", title: "Users", count: getAllUser.length }
                            ].map((item, index) => (
                                <Tab 
                                    key={index}
                                    className={`flex-1 cursor-pointer transition-all duration-300 ease-in-out ${activeTab === index ? 'bg-pink-500 text-white' : 'bg-white text-pink-500'} rounded-lg shadow-md p-6 hover:shadow-lg`}
                                >
                                    <motion.div 
                                        className="flex flex-col items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={40}
                                            height={40}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mb-2"
                                        >
                                            {item.icon === "shopping-basket" && (
                                                <>
                                                    <path d="m5 11 4-7" />
                                                    <path d="m19 11-4-7" />
                                                    <path d="M2 11h20" />
                                                    <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8c.9 0 1.8-.7 2-1.6l1.7-7.4" />
                                                    <path d="m9 11 1 9" />
                                                    <path d="M4.5 15.5h15" />
                                                    <path d="m15 11-1 9" />
                                                </>
                                            )}
                                            {item.icon === "list-ordered" && (
                                                <>
                                                    <line x1={10} x2={21} y1={6} y2={6} />
                                                    <line x1={10} x2={21} y1={12} y2={12} />
                                                    <line x1={10} x2={21} y1={18} y2={18} />
                                                    <path d="M4 6h1v4" />
                                                    <path d="M4 10h2" />
                                                    <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
                                                </>
                                            )}
                                            {item.icon === "users" && (
                                                <>
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                    <circle cx={9} cy={7} r={4} />
                                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </>
                                            )}
                                        </svg>
                                        <h2 className="text-2xl font-bold mb-1">{item.count}</h2>
                                        <p className="font-medium">{item.title}</p>
                                    </motion.div>
                                </Tab>
                            ))}
                        </TabList>

                        <div className="bg-white shadow-lg rounded-2xl p-6">
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
                </motion.div>
            </motion.div>
        </div>
    );
}

export default AdminDashboard;
