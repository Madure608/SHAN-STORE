import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function SaleEntry() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [searchTerm, setSearchTerm] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to load products');
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`${API_URL}/customers`);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addToCart = () => {
        if (!selectedProduct) {
            toast.error('Please select a product');
            return;
        }
        
        const product = products.find(p => p._id === selectedProduct);
        if (!product) return;
        
        if (quantity > product.quantity) {
            toast.error(`Only ${product.quantity} units available`);
            return;
        }
        
        const existingItem = cart.find(item => item.productId === selectedProduct);
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.quantity) {
                toast.error(`Only ${product.quantity} units available`);
                return;
            }
            setCart(cart.map(item =>
                item.productId === selectedProduct
                    ? { ...item, quantity: newQuantity, total: newQuantity * product.sellingPrice }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product._id,
                productName: product.name,
                quantity: quantity,
                price: product.sellingPrice,
                total: quantity * product.sellingPrice
            }]);
        }
        
        setSelectedProduct('');
        setQuantity(1);
        toast.success('Item added to cart');
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        const product = products.find(p => p._id === productId);
        if (!product) return;
        
        if (newQuantity > product.quantity) {
            toast.error(`Only ${product.quantity} units available`);
            return;
        }
        
        setCart(cart.map(item =>
            item.productId === productId
                ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
                : item
        ));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal;

    const handleSubmit = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }
        
        try {
            const saleData = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                customer: selectedCustomer || null,
                paymentMethod
            };
            
            await axios.post(`${API_URL}/sales`, saleData);
            toast.success('Sale completed successfully!');
            
            setCart([]);
            setSelectedCustomer('');
            fetchProducts();
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Failed to process sale');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.quantity > 0
    );

    return (
        <div className="container">
            <div className="page-header">
                <h1 className="page-title">New Sale</h1>
            </div>
            
            <div className="sale-layout">
                {/* Left Panel - Product Selection */}
                <div className="card">
                    <div className="card-header">Add Items</div>
                    
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="form-input"
                        style={{ marginBottom: '1rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select
                        className="form-select"
                        style={{ marginBottom: '1rem' }}
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Select a product</option>
                        {filteredProducts.map(product => (
                            <option key={product._id} value={product._id}>
                                {product.name} - ₹{product.sellingPrice} (Stock: {product.quantity})
                            </option>
                        ))}
                    </select>
                    
                    <div className="flex" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input
                            type="number"
                            placeholder="Quantity"
                            className="form-input"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            min="1"
                        />
                        <button
                            onClick={addToCart}
                            className="btn-primary"
                        >
                            Add to Cart
                        </button>
                    </div>
                    
                    <div>
                        <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Cart Items</h3>
                        {cart.length === 0 ? (
                            <div className="text-center" style={{ padding: '2rem', color: '#6b7280' }}>
                                Cart is empty
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.productId} className="cart-item">
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{item.productName}</div>
                                        <div className="cart-item-price">₹{item.price} × {item.quantity}</div>
                                    </div>
                                    <div className="cart-item-actions">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                                            className="quantity-input"
                                            min="1"
                                        />
                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                {/* Right Panel - Checkout */}
                <div className="card">
                    <div className="card-header">Checkout</div>
                    
                    <div className="form-group">
                        <label className="form-label">Customer (Optional)</label>
                        <select
                            className="form-select"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        >
                            <option value="">Walk-in Customer</option>
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.name} - {customer.phone}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Payment Method</label>
                        <select
                            className="form-select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Credit">Credit</option>
                        </select>
                    </div>
                    
                    <div className="summary-box">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total:</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSubmit}
                        className="btn-success"
                        style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
                    >
                        Complete Sale
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SaleEntry;