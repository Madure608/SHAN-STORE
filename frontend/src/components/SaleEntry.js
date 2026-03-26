import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

function SaleEntry() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data);
    };

    const fetchCustomers = async () => {
        const response = await axios.get(`${API_URL}/customers`);
        setCustomers(response.data);
    };

    const addToCart = () => {
        const product = products.find(p => p._id === selectedProduct);
        if (!product) return;
        setCart([...cart, {
            productId: product._id,
            productName: product.name,
            quantity: quantity,
            price: product.sellingPrice,
            total: quantity * product.sellingPrice
        }]);
        toast.success('Added to cart');
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal;

    const completeSale = async () => {
        if (cart.length === 0) {
            toast.error('Cart is empty');
            return;
        }
        
        try {
            await axios.post(`${API_URL}/sales`, {
                items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
                customer: selectedCustomer || null,
                paymentMethod
            });
            toast.success('Sale completed!');
            setCart([]);
            fetchProducts();
        } catch (error) {
            toast.error('Sale failed');
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Add Items</h2>
                <select className="w-full px-3 py-2 border rounded-lg mb-3" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                    <option value="">Select product</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name} - ₹{p.sellingPrice} (Stock: {p.quantity})</option>)}
                </select>
                <div className="flex space-x-2">
                    <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="flex-1 px-3 py-2 border rounded-lg" min="1" />
                    <button onClick={addToCart} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Add</button>
                </div>
                
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Cart</h3>
                    {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded mb-2">
                            <div><p className="font-medium">{item.productName}</p><p className="text-sm">₹{item.price} × {item.quantity}</p></div>
                            <button onClick={() => removeFromCart(index)} className="text-red-600">Remove</button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Checkout</h2>
                <select className="w-full px-3 py-2 border rounded-lg mb-3" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                    <option value="">Walk-in Customer</option>
                    {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.phone}</option>)}
                </select>
                <select className="w-full px-3 py-2 border rounded-lg mb-3" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option>Cash</option><option>Card</option><option>UPI</option>
                </select>
                <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
                </div>
                <button onClick={completeSale} className="w-full bg-green-600 text-white py-3 rounded-lg mt-4 font-semibold">Complete Sale</button>
            </div>
        </div>
    );
}

export default SaleEntry;