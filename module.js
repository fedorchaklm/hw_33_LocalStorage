const data = {
  fruits: ["apples", "bananas", "oranges", "pears", "pineapples", "grapes"],
  vegetables: ["carrots", "broccoli", "peas", "peper", "spinach", "celery"],
  drinks: ["milk", "water", "juice", "soda", "tea", "coffee"],
};

const prices = {
  apples: 1,
  bananas: 2,
  oranges: 3,
  pears: 4,
  pineapples: 5,
  grapes: 6,
  carrots: 7,
  broccoli: 8,
  peas: 9,
  peper: 10,
  spinach: 11,
  celery: 12,
  milk: 13,
  water: 14,
  juice: 15,
  soda: 16,
  tea: 17,
  coffee: 18,
};

const leftSidebar = document.getElementById("left-sidebar");
console.log(leftSidebar);

const categorySection =
  document.getElementsByClassName("categories-section")[0];
console.log(categorySection);

const categoryList = document.getElementsByClassName("category");
console.log(categoryList);

const productList = document.getElementById("product-list");
console.log(productList);

const productDetails = document.getElementById("product-details");
console.log(productDetails);

const buyButton = document.getElementById("buy-button");
console.log(buyButton);

const productsSection = document.getElementById("products-section");
console.log(productsSection);

const productInfo = document.getElementById("product-info");
console.log(productInfo);

const orderForm = document.getElementById("order-form");
console.log(orderForm);

const ordersButton = document.getElementById("orders-button");
console.log(ordersButton);

const shoppingCart = document.getElementById("shopping-cart-section");
console.log(shoppingCart);

function showProducts(category) {
  productsSection.style.display = "flex";
  const products = data[category];
  productList.innerHTML = "";
  products.forEach((product, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("product-card");
    listItem.setAttribute("data-product-index", index);
    const html = `
    <p>${products[index].toUpperCase()}</p>
      <img src="./images/${products[index]}.png" alt="${products[index]}.png">
      <p>Price: ${prices[product]} UAH</p>`;
    listItem.innerHTML = html;
    productList.appendChild(listItem);
    listItem.addEventListener("click", () => {
      selectedProduct = product;
      productDetails.textContent = "You choose: " + selectedProduct;
      orderForm.style.display = "none";
      productInfo.style.display = "flex";
      orderForm.reset();
    });
  });
}

Array.from(categoryList).forEach((element) => {
  element.addEventListener("click", (event) => {
    productsSection.style.display = "none";
    productInfo.style.display = "none";

    const category = event.target.textContent.toLowerCase();
    showProducts(category);
    productsSection.style.display = "flex";
    orderForm.reset();
  });
});

let selectedProduct;

buyButton.addEventListener("click", () => {
  orderForm.style.display = "flex";
});

function fillingForm() {
  const fullName = document.getElementById("full-name").value;
  const city = document.getElementById("city").value;
  const deliveryBranch = document.getElementById("delivery-branch").value;
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;
  const quantity = document.getElementById("quantity").value;
  const price = prices[selectedProduct] * quantity;

  console.log(fullName, city, deliveryBranch);
  console.log("Total price:", price);

  const order = {
    product: selectedProduct,
    fullName: fullName,
    city: city,
    deliveryBranch: deliveryBranch,
    paymentMethod: paymentMethod,
    quantity: quantity,
    price: price,
    orderTime: new Date().toLocaleDateString("uk-UA", {
      timeZone: "Europe/Kiev",
    }),
  };
  console.log(order);
  return order;
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (orderForm.checkValidity()) {
    const order = fillingForm();
    saveOrder(order);
    alert(
      `Thank you for your purchase! You buy ${order.quantity} pieces ${order.product} for ${order.price} UAH!`
    );
    orderForm.reset();
    orderForm.style.display = "none";
    productInfo.style.display = "none";
    productsSection.style.display = "none";
    productDetails.innerText = "";
  }
});

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

ordersButton.addEventListener("click", () => {
  categorySection.style.display = "none";
  shoppingCart.style.display = "flex";
  productInfo.style.display = "none";
  productsSection.style.display = "none";
  productDetails.style.display = "none";

  showUserOrders();
});

function showUserOrders() {
  shoppingCart.innerHTML = "";

  const storedObjects = getOrders();
  if (storedObjects && storedObjects.length > 0) {
    const table = document.createElement("table");
    table.style.width = "80vw";
    table.innerHTML = `
            <tr>
          <th>Product</th>
          <th>Full name</th>
          <th>City</th>
          <th>Delivery branch</th>
          <th>Payment method</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Order time</th>
            </tr>
        `;
    storedObjects.forEach((storedObject, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                 <td>${storedObject.product}</td>
                 <td>${storedObject.fullName}</td>
                 <td>${storedObject.city}</td>
                 <td>${storedObject.deliveryBranch}</td>
                 <td>${storedObject.paymentMethod}</td>
                 <td>${storedObject.quantity}</td>
                 <td>${storedObject.price}</td>
                 <td>${storedObject.orderTime}</td>
            `;
      table.appendChild(row);
      const deleteOrderBtn = document.createElement("button");
      deleteOrderBtn.classList.add(".del-btn");
      deleteOrderBtn.innerText = "Delete";
      deleteOrderBtn.setAttribute("data-index", `${i}`);
      row.appendChild(deleteOrderBtn);
      deleteOrderBtn.addEventListener("click", (event) => {
        const index = event.target.getAttribute("data-index");
        deleteOrder(index);
      });
      });
    shoppingCart.appendChild(table);
    const delOrdersListButton = document.createElement("button");
    delOrdersListButton.setAttribute("id", "deleteOrdersBtn");
    delOrdersListButton.innerText = "Delete all orders";
    delOrdersListButton.addEventListener("click", () => {
      localStorage.removeItem("orders");
      showUserOrders();
    });
    shoppingCart.appendChild(delOrdersListButton);
  } else {
    const noOrders = document.createElement("p");
    noOrders.innerText = "No orders";
    shoppingCart.appendChild(noOrders);
  }
  const returnMainPageButton = document.createElement("button");
  returnMainPageButton.innerText = "Return to main page";
  returnMainPageButton.setAttribute("id", "toMainPage");
  shoppingCart.appendChild(returnMainPageButton);
  returnMainPageButton.addEventListener("click", () => {
    refreshPage();
  });
}

showUserOrders();

function deleteOrder(index) {
  const orders = getOrders();
  orders.splice(index, 1);

  localStorage.setItem("orders", JSON.stringify(orders));
  showUserOrders();
}

function refreshPage() {
  window.location.reload();
}

// function clearAllOrders() {
//     localStorage.clear();
//     showUserOrders();
// }

{
  /* <tr>
<th>Product</th>
<th>Full name</th>
<th>City</th>
<th>Delivery branch</th>
<th>Payment method</th>
<th>Quantity</th>
<th>Price</th>
<th>Order time</th>
</tr> */
}
