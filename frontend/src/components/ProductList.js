import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load products');
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/products/${id}`);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const calculateProfit = (product) => {
        return (product.sellingPrice - product.buyingPrice) * product.quantity;
    };

    const isExpired = (expireDate) => {
        return new Date() > new Date(expireDate);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading"><div className="spinner"></div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h1 className="page-title">Products</h1>
                <Link to="/add-product" className="btn-primary">
                    + Add Product
                </Link>
            </div>
            
            <input
                type="text"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Expiry</th>
                            <th>Profit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product._id} style={isExpired(product.expireDate) ? { backgroundColor: '#fef2f2' } : {}}>
                                <td><strong>{product.name}</strong></td>
                                <td>{product.category}</td>
                                <td>
                                    <span className={`badge ${product.quantity < 10 ? 'badge-danger' : 'badge-success'}`}>
                                        {product.quantity} units
                                    </span>
                                </td>
                                <td>₹{product.sellingPrice}</td>
                                <td>
                                    {new Date(product.expireDate).toLocaleDateString()}
                                    {isExpired(product.expireDate) && (
                                        <span className="badge badge-danger ml-2">Expired</span>
                                    )}
                                </td>
                                <td style={{ color: '#16a34a', fontWeight: '600' }}>₹{calculateProfit(product).toFixed(2)}</td>
                                <td>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="btn-danger"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredProducts.length === 0 && (
                <div className="text-center" style={{ padding: '2rem', color: '#6b7280' }}>
                    No products found
                </div>
            )}
        </div>
    );
}

export default ProductList;