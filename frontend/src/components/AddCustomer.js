import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function AddCustomer() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/customers`, formData);
            toast.success('Customer added!');
            navigate('/customers');
        } catch (error) {
            toast.error('Failed to add customer');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Add Customer</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <div><label>Name *</label><input type="text" name="name" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label>Phone *</label><input type="tel" name="phone" required className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                    <div><label>Email</label><input type="email" name="email" className="w-full px-3 py-2 border rounded-lg" onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                    <div><label>Address</label><textarea name="address" className="w-full px-3 py-2 border rounded-lg" rows="3" onChange={(e) => setFormData({...formData, address: e.target.value})} /></div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={() => navigate('/customers')} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Add Customer</button>
                </div>
            </form>
        </div>
    );
}

export default AddCustomer;