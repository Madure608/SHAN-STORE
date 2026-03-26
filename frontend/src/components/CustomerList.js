import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${API_URL}/customers`);
            setCustomers(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load customers');
            setLoading(false);
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await axios.delete(`${API_URL}/customers/${id}`);
                toast.success('Customer deleted');
                fetchCustomers();
            } catch (error) {
                toast.error('Failed to delete customer');
            }
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (loading) {
        return <div className="loading"><div className="spinner"></div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h1 className="page-title">Customers</h1>
                <Link to="/add-customer" className="btn-primary">
                    + Add Customer
                </Link>
            </div>
            
            <input
                type="text"
                placeholder="Search customers by name or phone..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="grid grid-cols-3">
                {filteredCustomers.map(customer => (
                    <div key={customer._id} className="card">
                        <div className="flex-between" style={{ marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{customer.name}</h3>
                            <button
                                onClick={() => deleteCustomer(customer._id)}
                                className="btn-danger"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                                Delete
                            </button>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Phone:</span> {customer.phone}
                        </div>
                        {customer.email && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '500' }}>Email:</span> {customer.email}
                            </div>
                        )}
                        {customer.address && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: '500' }}>Address:</span> {customer.address}
                            </div>
                        )}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '500' }}>Total Purchases:</span> {customer.totalPurchases} orders
                        </div>
                        <div>
                            <span style={{ fontWeight: '500' }}>Total Spent:</span>{' '}
                            <span style={{ color: '#16a34a', fontWeight: '600' }}>₹{customer.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredCustomers.length === 0 && (
                <div className="text-center" style={{ padding: '2rem', color: '#6b7280' }}>
                    No customers found
                </div>
            )}
        </div>
    );
}

export default CustomerList;