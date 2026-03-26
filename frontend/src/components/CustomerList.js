import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${API_URL}/customers`);
            setCustomers(response.data);
        } catch (error) {
            toast.error('Failed to load customers');
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm('Delete this customer?')) {
            try {
                await axios.delete(`${API_URL}/customers/${id}`);
                toast.success('Customer deleted');
                fetchCustomers();
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customers</h1>
                <Link to="/add-customer" className="bg-blue-600 text-white px-4 py-2 rounded-lg">+ Add Customer</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map(customer => (
                    <div key={customer._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-semibold">{customer.name}</h3>
                            <button onClick={() => deleteCustomer(customer._id)} className="text-red-600">Delete</button>
                        </div>
                        <p className="text-gray-600 mt-2">Phone: {customer.phone}</p>
                        {customer.email && <p className="text-gray-600">Email: {customer.email}</p>}
                        <p className="text-gray-600">Total Purchases: {customer.totalPurchases}</p>
                        <p className="text-green-600 font-semibold">Total Spent: ₹{customer.totalAmount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerList;