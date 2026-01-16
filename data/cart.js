// Load cart from localStorage or initialize empty
export var Cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
export function saveCart() {
    localStorage.setItem('cart', JSON.stringify(Cart));
}

// Cart Container