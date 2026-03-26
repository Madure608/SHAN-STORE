import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import SaleEntry from './components/SaleEntry';
import DailySales from './components/DailySales';
import InventoryStatus from './components/InventoryStatus';
import './index.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/add-product" element={<AddProduct />} />
                        <Route path="/customers" element={<CustomerList />} />
                        <Route path="/add-customer" element={<AddCustomer />} />
                        <Route path="/sale" element={<SaleEntry />} />
                        <Route path="/daily-sales" element={<DailySales />} />
                        <Route path="/inventory" element={<InventoryStatus />} />
                    </Routes>
                </div>
                <Toaster position="top-right" />
            </div>
        </Router>
    );
}

export default App;