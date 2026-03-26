import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        category: 'Groceries',
        quantity: '',
        buyingPrice: '',
        sellingPrice: '',
        expireDate: '',
        supplier: ''
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
            const productData = {
                ...formData,
                quantity: parseInt(formData.quantity),
                buyingPrice: parseFloat(formData.buyingPrice),
                sellingPrice: parseFloat(formData.sellingPrice)
            };
            
            await axios.post(`${API_URL}/products`, productData);
            toast.success('Product added successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add product');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px' }}>
            <div className="page-header">
                <h1 className="page-title">Add New Product</h1>
            </div>
            
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2">
                        <div className="form-group">
                            <label className="form-label">Product Name *</label>
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
                            <label className="form-label">Category *</label>
                            <select
                                name="category"
                                required
                                className="form-select"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="Groceries">Groceries</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Fresh Produce">Fresh Produce</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Quantity *</label>
                            <input
                                type="number"
                                name="quantity"
                                required
                                min="0"
                                className="form-input"
                                value={formData.quantity}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Buying Price (₹) *</label>
                            <input
                                type="number"
                                name="buyingPrice"
                                required
                                min="0"
                                step="0.01"
                                className="form-input"
                                value={formData.buyingPrice}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Selling Price (₹) *</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                required
                                min="0"
                                step="0.01"
                                className="form-input"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Expiry Date *</label>
                            <input
                                type="date"
                                name="expireDate"
                                required
                                className="form-input"
                                value={formData.expireDate}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="form-label">Supplier</label>
                            <input
                                type="text"
                                name="supplier"
                                className="form-input"
                                value={formData.supplier}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-end" style={{ gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;