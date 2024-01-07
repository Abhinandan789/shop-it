import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });


    // Authentication 
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const loginPage = () => {
        navigate("/login");
    };




    const [total, setTotal] = useState(0);

    const updateCartItemsAndStorage = (newCartItems) => {
        setCartItems(newCartItems);
        localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    };

    const calculateTotal = (cart) => {
        return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    const removeFromCart = (productId) => {
        const existingItem = cartItems.find((item) => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
            // If the item has a quantity greater than 1, decrement the quantity
            const updatedCartItems = cartItems.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
            );
            updateCartItemsAndStorage(updatedCartItems);
        } else {
            // If the item has a quantity of 1 or doesn't exist, remove it from the cart
            const newCartItems = cartItems.filter((item) => item.id !== productId);
            updateCartItemsAndStorage(newCartItems);
        }
    };

    useEffect(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        const parsedCartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
        setCartItems(parsedCartItems);
    }, [cartItems]);

    useEffect(() => {
        // Calculate the total whenever the cart changes
        setTotal(calculateTotal(cartItems));
    }, [cartItems]);

    return (
        <div>
            {isLoggedIn ?
                <div className="cart-container">
                    < h3 > Shopping Cart</h3>
                    <ul className="cart-list">
                        {cartItems && cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <span>{item.title}</span>
                                    <span>${item.price}</span>
                                    <span>Quantity: {item.quantity}</span>
                                    <button
                                        onClick={() => {
                                            removeFromCart(item.id);
                                        }}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>Your cart is empty.</li>
                        )}
                    </ul>

                    <h4>Total: ${total}</h4>
                </div > : <h2>Login First !</h2>
            }
            <button id="homepage-log" onClick={loginPage}>
                {isLoggedIn ? "Log Out" : "Log In"}
            </button>
        </div>

    );
};

export default Cart;