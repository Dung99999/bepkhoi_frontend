import { useState, useEffect } from "react";

export const useCart = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
            setCartCount(cart.length);
        };

        updateCartCount();
        window.addEventListener("storage", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    const clearCart = () => {
        sessionStorage.removeItem("cart");
        setCartCount(0);
        window.dispatchEvent(new Event("storage"));
    };

    return { cartCount, clearCart };
};