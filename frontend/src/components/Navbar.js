import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();
    
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        🏪 Shan Stores
                    </Link>
                    <div className="navbar-links">
                        <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>
                            Dashboard
                        </Link>
                        <Link to="/products" className={`navbar-link ${location.pathname === '/products' ? 'active' : ''}`}>
                            Products
                        </Link>
                        <Link to="/customers" className={`navbar-link ${location.pathname === '/customers' ? 'active' : ''}`}>
                            Customers
                        </Link>
                        <Link to="/sale" className={`navbar-link ${location.pathname === '/sale' ? 'active' : ''}`}>
                            New Sale
                        </Link>
                        <Link to="/daily-sales" className={`navbar-link ${location.pathname === '/daily-sales' ? 'active' : ''}`}>
                            Daily Sales
                        </Link>
                        <Link to="/inventory" className={`navbar-link ${location.pathname === '/inventory' ? 'active' : ''}`}>
                            Inventory
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;