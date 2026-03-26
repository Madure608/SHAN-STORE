import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function InventoryStatus() {
    const [products, setProducts] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, alertsRes] = await Promise.all([
                axios.get(`${API_URL}/products`),
                axios.get(`${API_URL}/alerts`)
            ]);
            setProducts(productsRes.data);
            setAlerts(alertsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to load inventory data');
            setLoading(false);
        }
    };

    const resolveAlert = async (alertId) => {
        try {
            await axios.put(`${API_URL}/alerts/${alertId}/resolve`);
            toast.success('Alert resolved');
            fetchData();
        } catch (error) {
            toast.error('Failed to resolve alert');
        }
    };

    const getExpiryStatus = (expireDate) => {
        const today = new Date();
        const expiry = new Date(expireDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry < 0) return { status: 'Expired', class: 'badge-danger' };
        if (daysUntilExpiry <= 7) return { status: 'Critical', class: 'badge-danger' };
        if (daysUntilExpiry <= 30) return { status: 'Warning', class: 'badge-warning' };
        return { status: 'Good', class: 'badge-success' };
    };

    const lowStockProducts = products.filter(p => p.quantity < 10);
    const expiredProducts = products.filter(p => new Date(p.expireDate) < new Date());

    if (loading) {
        return <div className="loading"><div className="spinner"></div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">Inventory Status</h1>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-title">Total Products</div>
                    <div className="stat-card-value">{products.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Low Stock</div>
                    <div className="stat-card-value" style={{ color: '#ea580c' }}>{lowStockProducts.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-title">Expired</div>
                    <div className="stat-card-value" style={{ color: '#dc2626' }}>{expiredProducts.length}</div>
                </div>
            </div>
            
            {alerts.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header">⚠️ Active Alerts</div>
                    {alerts.map(alert => (
                        <div key={alert._id} className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: '500' }}>{alert.message}</div>
                                <div style={{ fontSize: '0.75rem', color: '#854d0e', marginTop: '0.25rem' }}>
                                    Created: {new Date(alert.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <button
                                onClick={() => resolveAlert(alert._id)}
                                className="btn-primary"
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                            >
                                Resolve
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {lowStockProducts.length > 0 && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <div className="card-header" style={{ color: '#ea580c' }}>⚠️ Low Stock Products</div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map(product => (
                                    <tr key={product._id}>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.category}</td>
                                        <td style={{ color: '#ea580c', fontWeight: '600' }}>{product.quantity} units</td>
                                        <td><span className="badge badge-danger">Low Stock</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="card">
                <div className="card-header">All Products</div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Expiry Status</th>
                                <th>Expiry Date</th>
                                <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const expiryStatus = getExpiryStatus(product.expireDate);
                                return (
                                    <tr key={product._id}>
                                        <td><strong>{product.name}</strong></td>
                                        <td>{product.category}</td>
                                        <td>{product.quantity} units</td>
                                        <td><span className={`badge ${expiryStatus.class}`}>{expiryStatus.status}</span></td>
                                        <td>{new Date(product.expireDate).toLocaleDateString()}</td>
                                        <td style={{ color: '#16a34a', fontWeight: '600' }}>
                                            ₹{((product.sellingPrice - product.buyingPrice) * product.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default InventoryStatus;