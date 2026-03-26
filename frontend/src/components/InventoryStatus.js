import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function InventoryStatus() {
    const [products, setProducts] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const productsRes = await axios.get(`${API_URL}/products`);
        const alertsRes = await axios.get(`${API_URL}/alerts`);
        setProducts(productsRes.data);
        setAlerts(alertsRes.data);
    };

    const lowStock = products.filter(p => p.quantity < 10);
    const expired = products.filter(p => new Date(p.expireDate) < new Date());

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Inventory Status</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6"><p className="text-gray-500">Total Products</p><p className="text-2xl font-bold">{products.length}</p></div>
                <div className="bg-white rounded-lg shadow-md p-6"><p className="text-gray-500">Low Stock</p><p className="text-2xl font-bold text-orange-600">{lowStock.length}</p></div>
                <div className="bg-white rounded-lg shadow-md p-6"><p className="text-gray-500">Expired</p><p className="text-2xl font-bold text-red-600">{expired.length}</p></div>
            </div>
            
            {alerts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">⚠️ Alerts</h2>
                    {alerts.map(alert => (
                        <div key={alert._id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded mb-2">
                            <p>{alert.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default InventoryStatus;