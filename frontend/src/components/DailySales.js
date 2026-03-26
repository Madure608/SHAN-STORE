import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function DailySales() {
    const [dailySales, setDailySales] = useState([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalRevenue: 0,
        averageSale: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailySales();
    }, []);

    const fetchDailySales = async () => {
        try {
            const response = await axios.get(`${API_URL}/sales/daily`);
            setDailySales(response.data.sales || []);
            setStats({
                totalSales: response.data.count || 0,
                totalRevenue: response.data.totalSales || 0,
                averageSale: response.data.count > 0 ? response.data.totalSales / response.data.count : 0
            });
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load daily sales');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading"><div className="spinner"></div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Daily Sales Report</h1>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-title">Total Sales</div>
                    <div className="stat-card-value">{stats.totalSales}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Total Revenue</div>
                    <div className="stat-card-value" style={{ color: '#10b981' }}>₹{stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Average Sale</div>
                    <div className="stat-card-value">₹{stats.averageSale.toFixed(2)}</div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-header">Sales Transactions</div>
                {dailySales.length > 0 ? (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailySales.map(sale => (
                                    <tr key={sale._id}>
                                        <td>{sale.invoiceNumber}</td>
                                        <td>{sale.customer ? sale.customer.name : 'Walk-in Customer'}</td>
                                        <td>{sale.items.length} items</td>
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

export default DailySales;