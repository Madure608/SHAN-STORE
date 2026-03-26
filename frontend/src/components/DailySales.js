import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function DailySales() {
    const [sales, setSales] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchDailySales();
    }, []);

    const fetchDailySales = async () => {
        const response = await axios.get(`${API_URL}/sales/daily`);
        setSales(response.data.sales || []);
        setTotal(response.data.totalSales || 0);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Daily Sales Report</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <p className="text-2xl font-bold">Today's Total: ₹{total.toFixed(2)}</p>
                <p className="text-gray-600">Total Transactions: {sales.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr><th className="px-6 py-3 text-left">Invoice</th><th className="px-6 py-3 text-left">Items</th><th className="px-6 py-3 text-left">Amount</th><th className="px-6 py-3 text-left">Time</th></tr>
                    </thead>
                    <tbody>
                        {sales.map(sale => (
                            <tr key={sale._id}>
                                <td className="px-6 py-4">{sale.invoiceNumber}</td>
                                <td className="px-6 py-4">{sale.items.length} items</td>
                                <td className="px-6 py-4">₹{sale.total}</td>
                                <td className="px-6 py-4">{new Date(sale.saleDate).toLocaleTimeString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DailySales;