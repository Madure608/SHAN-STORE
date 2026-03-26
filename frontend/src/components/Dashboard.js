import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        todaySales: 0,
        todayRevenue: 0,
        lowStockItems: 0,
        expiringItems: 0
    });
    const [alerts, setAlerts] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const productsRes = await axios.get(`${API_URL}/products`);
            const customersRes = await axios.get(`${API_URL}/customers`);
            const salesRes = await axios.get(`${API_URL}/sales/daily`);
            const alertsRes = await axios.get(`${API_URL}/alerts`);
            
            const products = productsRes.data;
            const lowStock = products.filter(p => p.quantity < 10);
            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            const expiring = products.filter(p => {
                const expireDate = new Date(p.expireDate);
                return expireDate <= thirtyDaysFromNow && expireDate >= today;
            });
            
            setStats({
                totalProducts: products.length,
                totalCustomers: customersRes.data.length,
                todaySales: salesRes.data.count || 0,
                todayRevenue: salesRes.data.totalSales || 0,
                lowStockItems: lowStock.length,
                expiringItems: expiring.length
            });
            
            setAlerts(alertsRes.data);
            setRecentSales(salesRes.data.sales || []);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load dashboard');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-title">Total Products</div>
                    <div className="stat-card-value">{stats.totalProducts}</div>
                    <div className="stat-card-sub">
                        <Link to="/products" style={{ color: '#3b82f6', textDecoration: 'none' }}>View All →</Link>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-card-title">Total Customers</div>
                    <div className="stat-card-value">{stats.totalCustomers}</div>
                    <div className="stat-card-sub">
                        <Link to="/customers" style={{ color: '#3b82f6', textDecoration: 'none' }}>View All →</Link>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-card-title">Today's Sales</div>
                    <div className="stat-card-value">{stats.todaySales}</div>
                    <div className="stat-card-sub" style={{ color: '#10b981' }}>
                        Revenue: ₹{stats.todayRevenue.toFixed(2)}
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-card-title">Alerts</div>
                    <div className="stat-card-value">{alerts.length}</div>
                    <div className="stat-card-sub">
                        <span style={{ color: '#ea580c' }}>Low Stock: {stats.lowStockItems}</span><br />
                        <span style={{ color: '#dc2626' }}>Expiring: {stats.expiringItems}</span>
                    </div>
                </div>
            </div>
            
            {alerts.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header">⚠️ Active Alerts</div>
                    {alerts.slice(0, 5).map(alert => (
                        <div key={alert._id} className="alert alert-warning">
                            {alert.message}
                        </div>
                    ))}
                </div>
            )}
            
            <div className="card">
                <div className="card-header">Recent Sales</div>
                {recentSales.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map(sale => (
                                    <tr key={sale._id}>
                                        <td>{sale.invoiceNumber}</td>
                                        <td>{sale.customer ? sale.customer.name : 'Walk-in Customer'}</td>
                                        <td style={{ color: '#10b981', fontWeight: '600' }}>₹{sale.total.toFixed(2)}</td>
                                        <td>{sale.paymentMethod}</td>
                                        <td>{new Date(sale.saleDate).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '2rem', color: '#6b7280' }}>
                        No sales recorded today
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;