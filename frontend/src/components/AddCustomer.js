import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function AddCustomer() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post(`${API_URL}/customers`, formData);
            toast.success('Customer added successfully!');
            navigate('/customers');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to add customer');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h1 className="page-title">Add New Customer</h1>
            </div>
            
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Customer Name *</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="form-input"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Address</label>
                        <textarea
                            name="address"
                            className="form-textarea"
                            rows="3"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="flex-end" style={{ gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/customers')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCustomer;