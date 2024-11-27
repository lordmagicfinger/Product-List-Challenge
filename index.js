let productsHtml = document.querySelector('.listProduct');
let cartsHtml = document.querySelector('.listCart');
let totalItemsInCart = document.querySelector('.item h3');
let modal = document.querySelector('.modal');
let modalHtml = document.querySelector('.modalItems');
let CloseModal = document.querySelector('.newOrder');
let listProducts = [];
let carts = [];


// Open modal during checkOut
cartsHtml.addEventListener('click', (event) =>{
    if(event.target.classList.contains('confirmOrder')){
        modal.showModal();
        updateModal();
    }
})
// Close modal after submitting
CloseModal.addEventListener('click', () =>{
    modal.close();
})
//Update modal information
const updateModal = () =>{
    modalHtml.innerHTML = "";
    if(carts.length > 0){
        carts.forEach(cart =>{
            let newModal = document.createElement('div');
            newModal.classList.add('item');
            newModal.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newModal.innerHTML = `
            <img src="${info.image.desktop}" alt="">
            <div class="details">
                <div class="name">${info.name}</div>
                <div class="prices">
                    <span class="quantity">${cart.quantity}x</span>
                    <span class="price">$${info.price}</span>
                    <div class="totalPrice">$40.00</div>
                </div>
            </div>
            `;
            modalHtml.appendChild(newModal)
        })
    }
    
}



//Deleting item from cart
cartsHtml.addEventListener('click', (event) =>{
    let deleteBn = event.target;
    if(deleteBn.classList.contains('bx')){
       let product_id = deleteBn.parentElement.parentElement.dataset.id;
       deleteItem(product_id);
       
    }
})

//Delete function
const deleteItem = (product_id) =>{
    let positionInCart = carts.findIndex((value) => value.product_id = product_id);
   if(positionInCart <= 0){
        carts.splice(positionInCart, 1);  
   }
   addCartToMemory();
   updateCartHtml();
}

const initApp = () =>{
    fetch('data.json')
    .then(response => response.json())
    .then(data =>{
        listProducts = data;
        addProducts();
        
        if(localStorage.getItem('cart')){
            carts =JSON.parse(localStorage.getItem('cart'));
            updateCartHtml();
        }
    })
}

//Add cart to localStorage
const addCartToMemory = () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
}


//Populating the webPage with products from json file
const addProducts = () =>{
    productsHtml.innerHTML = "";
    if(listProducts.length > 0){
        listProducts.forEach(product =>{
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <img src="${product.image.desktop}" alt="">
            <button class="addCart"><img src="assets/Images/icon-add-to-cart.svg" alt="">Add To Cart</button>
            <div class="category">${product.category}</div>
            <div class="name">${product.name}</div>
            <div class="price">$${product.price}</div>
            `;
            productsHtml.appendChild(newProduct);
        })
    }
    
}

// Functionality for the add to cart button
productsHtml.addEventListener('click', (event) =>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;//Get the product id of the product we want to add to cart
        addCart(product_id);
    }   
})

// Add product to cart when the add button has been clicked
const addCart = (product_id) =>{
    let positionInThisIndex = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity: 1
        }]
    }
    else if(positionInThisIndex < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        })
    }
    else carts[positionInThisIndex].quantity = carts[positionInThisIndex].quantity + 1;
    updateCartHtml();
    addCartToMemory();
}

// update the cart with the information of the products added to the cart

const updateCartHtml = () =>{
    let totalCart = 0;
    cartsHtml.innerHTML = "";
    let cartHeader = document.createElement('h3');
    let totalItemsInCart = document.createElement('span');
    totalItemsInCart.innerText = '(0)';
    cartHeader.innerText = "Your Cart";
    cartHeader.appendChild(totalItemsInCart);
    cartsHtml.appendChild(cartHeader);
    if(carts.length <= 0){
        let ifEmpty = document.createElement('div');
    ifEmpty.innerHTML = `
        <img src="assets/Images/illustration-empty-cart.svg" alt="">
        <p style=" margin: 20px 0" class="cartText">Your added items will appear here</p>
    `;
    cartsHtml.appendChild(ifEmpty);
    }
    if(carts.length > 0){
        carts.forEach(cart =>{
            totalCart = totalCart + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
            <div class="details">
            <div class="name">${info.name}</div>
            <div class="price"> <span>${cart.quantity}x</span> $${info.price} <p> $${info.price * cart.quantity}</p></div>
            </div>
            <div class="close"><img class="bx" src="assets/Images/icon-remove-item.svg" alt=""></i></div>
            
            `;
            cartsHtml.appendChild(newCart);
        })
    
        let totalOrderHtml = document.createElement('div');
        let checkOutHtml = document.createElement('div');
        checkOutHtml.classList.add('checkOut');
        totalOrderHtml.classList.add('totalOrder');
        totalOrderHtml.innerHTML = `
        <div> Order Total</div>
        <div class="orderPrice">$40.00</div>
        `;
        checkOutHtml.innerHTML = `
        <p><img src="assets/Images/icon-carbon-neutral.svg" alt=""> This is a carbon-neutral delivery</p>
            <button class="confirmOrder">Confirm Order</button>
        `;
        cartsHtml.appendChild(totalOrderHtml);
        cartsHtml.appendChild(checkOutHtml);
        
    }
    totalItemsInCart.innerText = "(" + totalCart + ")";
}

initApp();