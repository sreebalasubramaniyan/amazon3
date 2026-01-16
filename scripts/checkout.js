import {Cart, saveCart} from "../data/cart.js";
import {products} from "../data/products.js";
// import { removeFromCart }    from "./amazon.js";

function findProduct(id){
    let res;
    for(let p of products){
        if(p.id===id)
            return p
    }
}

const checkout_items = document.querySelector(".checkout-text");
const order_summary = document.querySelector(".order-summary")
const payment_summary = document.querySelector(".payment-summary");
console.log(dayjs())
const today = dayjs()
let del_1 = today.add(7,'days').format('dddd, MMMM D')
let del_2 = today.add(3,'days').format('dddd, MMMM D')
let del_3 = today.add(1,'days').format('dddd, MMMM D')

function renderCart(arr){

// Calculate totals
let totalItems = 0;
let subtotal = 0;
arr.forEach((item) => {
    const product = findProduct(item.productId || item.ProductId);
    if(product) {
        totalItems += item.quantity;
        subtotal += (product.priceCents / 100) * item.quantity;
    }
});
checkout_items.firstElementChild.innerText = totalItems + " items";
let shipping = 0;
const tax = subtotal * 0.10;
const orderTotal = subtotal + shipping + tax;
const isCartEmpty = arr.length === 0;


let payment_summary_html = `
<div class="ps-title">Order Summary</div>
<div class="ps-row">
<div class="items-text">Items (${totalItems}):</div>
                    <div class="items_rate">$${subtotal.toFixed(2)}</div>
                </div>

                <div class="ps-row">
                    <div class="shiping">Shipping & handling:</div>
                    <div class="ship_rate">$0.00</div>
                </div>

                <div class="ps-row">
                <div class="tax1">Total before tax:</div>
                    <div class="tax1_rate">$${subtotal.toFixed(2)}</div>
                </div>

                <div class="ps-row">
                    <div class="tax2">Estimated tax(10%):</div>
                    <div class="tax2_rate">$${tax.toFixed(2)}</div>
                </div>

                <div class="ps-row">
                    <div class="order_total">Order total:</div>
                    <div class="total_rate">$${orderTotal.toFixed(2)}</div>
                </div>

                <button class="place-order" ${isCartEmpty ? 'disabled' : ''} style="opacity: ${isCartEmpty ? '0.5' : '1'}; cursor: ${isCartEmpty ? 'not-allowed' : 'pointer'};">Place your order</button>
            `
payment_summary.innerHTML = payment_summary_html;

let order_summary_html = "";
for (let i=0;i<arr.length;i++){
        let product = findProduct(arr[i].productId || arr[i].ProductId); // Support both property names
        if(!product) continue; // Skip if product not found
        order_summary_html += `
        <div class="product-summary">
                <div class="delivery_date">Selected Delivery: <span class="delivery-selected">Friday, January 23</span></div>

                <div class="details-grid">
                    <div class="image-section">
                        <img src="${product.image}" alt="">
                    </div>
                    <div class="details">
                        <div class="details-section">
                            <div class="name">${product.name}</div>
                            <div class="price">$${product.priceCents/100}</div>
                            <div class="q_u_b">
                                <div class="quantity" data-product-id="${product.id}">
                                    <span class="qty-display">Quantity: ${arr[i].quantity}</span>
                                </div>
                                <button class="update" data-product-id="${product.id}">Update</button>
                                <button data-product-id="${product.id}" class="delete">Delete</button>
                            </div>
                        </div>
                    </div>
                    <div class="delivery-options">
                        <div class="title">Choose a delivery option</div>
                        <div class="option">
                            <input type="radio" >
                            <div class="date_type">
                                <div class="date">${del_1}</div>
                                <div class="type">FREE Shipping</div>
                            </div>
                        </div>
                        <div class="option">
                            <input  type="radio">
                            <div class="date_type">
                                <div class="date">${del_2}</div>
                                <div class="type">$4.99 - Shipping</div>
                            </div>
                        </div>
                        <div class="option">
                            <input  type="radio" >
                            <div class="date_type">
                                <div class="date">${del_3}</div>
                                <div class="type">$9.99 - Shipping</div>
                            </div>
                        </div>
                    </div>

                </div>
        </div>`
}

if(order_summary_html===""){
    order_summary_html = `
    <div>Your cart is empty.</div>
    <a href="amazon.html"><button class="empty-button">view products</button></a>
    `
}
order_summary.innerHTML = order_summary_html
}
renderCart(Cart);  
const delivery_option = document.querySelector(".delivery-options");
if(document.querySelector(".product-summary")){
document.querySelector(".order-summary").addEventListener("change",(e)=>{
    let list =  (e.target.parentElement.parentElement.getElementsByTagName("input"))
    for(let l of list){
        if(l==e.target) continue
        else l.checked = false;
    }
    e.target.parentElement.parentElement.parentElement.parentElement.querySelector(".delivery_date").innerText = `Selected Delivery: `+e.target.parentElement.querySelector(".date").innerText
    let t = e.target.parentElement.querySelector(".type").innerText;
    let cost = 0;
    if(t==="FREE Shipping"){
        cost = 0
    }
    else if(t==="$4.99 - Shipping"){
        cost = 4.99
    }
    else if(t==="$9.99 - Shipping"){
        cost = 9.99
    }
    payment_summary.querySelector(".ship_rate").innerText = "$"+cost.toFixed(2);
})
}

// Update selected delivery display when radio button changes
// Handle update button to show input for quantity
order_summary.addEventListener("click", (e) => {
    if (e.target.classList.contains("update")) {
        const productId = e.target.dataset.productId;
        const quantityDiv = e.target.closest(".q_u_b").querySelector(".quantity");
        const currentQty = parseInt(quantityDiv.querySelector(".qty-display").innerText.split(": ")[1]);
        
        // Replace display with input field
        quantityDiv.innerHTML = `
            <input type="number" class="qty-input" value="${currentQty}" min="1" style="width: 50px; padding: 5px;">
        `;
        
        // Replace update button with save button
        e.target.innerText = "Save";
        e.target.classList.remove("update");
        e.target.classList.add("save-qty");
    }
    else if (e.target.classList.contains("save-qty")) {
        const productId = e.target.dataset.productId;
        const qtyInput = e.target.closest(".q_u_b").querySelector(".qty-input");
        const newQuantity = parseInt(qtyInput.value);
        
        if(newQuantity > 0) {
            const itemIndex = Cart.findIndex(item => (item.productId === productId || item.ProductId === productId));
            if (itemIndex !== -1) {
                Cart[itemIndex].quantity = newQuantity;
                saveCart();
                renderCart(Cart);
            }
        }
    }
});

// bubble up refer chatgpt once
order_summary.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const id = (e.target.dataset.productId);

        const index = Cart.findIndex(
            item => item.productId === id || item.ProductId === id
        );

        if (index !== -1) {
            Cart.splice(index, 1);
            saveCart(); // Save cart to localStorage
            renderCart(Cart);
        }
    }
});