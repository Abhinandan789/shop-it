import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";


const HomePage = () => {
    const navigate = useNavigate();
    const { isLoggedIn} = useAuth();
    const loginPage = () => {
        navigate("/login");
    };

    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        searchTerm: "",
        minPrice: "",
        maxPrice: "",
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        try {
            return storedCartItems ? JSON.parse(storedCartItems) : [];
        } catch (error) {
            console.error("Error parsing cartItems from localStorage:", error);
            return [];
        }
    });

    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("https://dummyjson.com/products");
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${ response.status }`);
                }

                const data = await response.json();
                setProducts(data.products);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filteredByName = products.filter((product) =>
            product.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );

        const filteredByPrice = filteredByName.filter((product) => {
            const productPrice = parseFloat(product.price);
            const min =
                filters.minPrice !== ""
                    ? parseFloat(filters.minPrice)
                    : Number.NEGATIVE_INFINITY;
            const max =
                filters.maxPrice !== ""
                    ? parseFloat(filters.maxPrice)
                    : Number.POSITIVE_INFINITY;

            return productPrice >= min && productPrice <= max;
        });

        setFilteredProducts(filteredByPrice);
    }, [filters, products]);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        const existingItemIndex = cartItems.findIndex(
            (item) => item.id === product.id
        );

        if (existingItemIndex !== -1) {
            // If the product is already in the cart, update its quantity
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingItemIndex] = {
                ...cartItems[existingItemIndex],
                quantity: cartItems[existingItemIndex].quantity + 1,
            };
            setCartItems(updatedCartItems);
        } else {
            // If the product is not in the cart, add it with quantity 1
            setCartItems((prevCartItems) => [
                ...prevCartItems,
                { ...product, quantity: 1 },
            ]);
        }

        // Show notification
        setNotification(`${ product.title } has been added to the cart`);

        // Hide notification after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    return (
        <div>
            {isLoggedIn ? (
                <div className="product-list-container">
                    <h3>Product List</h3>
                    {notification && <div className="notification">{notification}</div>}
                    <div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.searchTerm}
                            onChange={(e) =>
                                setFilters({ ...filters, searchTerm: e.target.value })
                            }
                        />
                    </div>
                    <div className="product-list-inputs">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={filters.minPrice}
                            onChange={(e) =>
                                setFilters({ ...filters, minPrice: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={filters.maxPrice}
                            onChange={(e) =>
                                setFilters({ ...filters, maxPrice: e.target.value })
                            }
                        />
                    </div>
                    <ul className="product-list">
                        {filteredProducts.map((product) => (
                            <li key={product.id} className="product-list-item">
                                <span>{product.title}</span>
                                <span>${product.price}</span>
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={!isLoggedIn}
                                >
                                    Add to Cart
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <h1>Log In First</h1>
            )}

            <button id="homepage-log" onClick={loginPage}>
                {isLoggedIn ? "Log Out" : "Log In"}
            </button>
        </div>
    );
};

export default HomePage;