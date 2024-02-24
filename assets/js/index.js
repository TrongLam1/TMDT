const table = document.querySelector(".productList");
const search = document.querySelector("#search-bar");
const login = document.querySelector(".icons");
const avatar = document.querySelector(".icons.login");
const userLogin = document.querySelector(".userLogin");
const keyword = document.querySelector(".keyword");
const type1 = document.querySelector(".productList.type1");
const type2 = document.querySelector(".productList.type2");
const type3 = document.querySelector(".productList.type3");
const senda = document.getElementById("senda");
const lan = document.getElementById("lan");
const cactus = document.getElementById("cactus");
const findProductList = document.getElementById("findProductPage");
const listProductPage = document.getElementById("listProductPage");
const toListProductPage = document.getElementById("toListProductPage");
const filterTypeCheckboxs = document.querySelectorAll('.filterType input[type="checkbox"]');
const btnFilter = document.querySelector(".btnFilter button");
const pagination = document.querySelector(".pagination ul");
const containerProductDetail = document.querySelector(".container-product-detail");
const tableCartPage = document.getElementById('cartTable');
const removeModal = document.querySelector("#myModal");
const btnCancelModal = document.querySelector(".btn-secondary");
const btnDangerModal = document.querySelector(".btn-danger");
const btnPayment = document.querySelector(".btn-block");
const btnBanking = document.querySelector(".btnBanking");
const paymentForm = document.querySelector(".needs-validation");
const bankingForm = document.querySelector("#paymentForm");
const listCartItemInPayment = document.querySelector(".list-group");
const tableList = document.getElementById("orderTable");
const profileUser = document.querySelector(".profileInfo");
const sortProduct = document.getElementById("sort");
let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.nav-bar');
let header = document.querySelector('.header-menu');

if (menu) {
  menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
  });
}
let totalPages;
let page = 1;

// --------------------------------- Toast message --------------------------------------
function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle"
    };
    const icon = icons[type];
    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

    toast.innerHTML = `
                    <div class="toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="toast__body">
                        <h3 class="toast__title">${title}</h3>
                        <p class="toast__msg">${message}</p>
                    </div>
                    <div class="toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
    main.appendChild(toast);
  }
}

function showSuccessToast(mess) {
  toast({
    title: "Thành công!",
    message: mess,
    type: "success",
    duration: 3000
  });
}

function showErrorToast(mess) {
  toast({
    title: "Thất bại!",
    message: mess,
    type: "error",
    duration: 5000
  });
}

// --------------------------------------------------------------------------------------
function dropDownUser() {
  document.querySelector(".dropDownUser").classList.toggle("show");
}

function createProductItem(product, size) {

  let productItemWrapper;

  if (product.sale != 0) {
    productItemWrapper = `
                <div class="productItemWrapper ${size}">
                  <div class="productItem">
                      <img src="${product.imageUrl}" alt="${product.name}" class="productItem__img" onclick="getDetailProduct(this)" data-id="${product.id}">
                      <div class="productItemContainer__info">
                          <div class="productItem__info l-9">
                              <h4 class="productItem__name">${product.name}</h4>
                              <div class="productItem__price">
                                  <span class="productItem__price-old">${product.oldPrice.toLocaleString()}đ</span>
                                  <div class="productItem__sale">
                                      <span class="productItem__price-current">${product.newPrice.toLocaleString()}đ</span>
                                      <span class="discount"> ${product.sale}%</span>
                                  </div>
                              </div>
                          </div>
                          <div class="productItemAdd l-3">
                            <button value="${product.id}" id="addToCart" onclick="addItemToCart(this)">
                              <i class="fa-solid fa-cart-plus"></i>
                            </button>
                          </div>
                      </div>
                  </div>
                </div>
  `;
  } else {
    productItemWrapper = `
                <div class="productItemWrapper ${size}">
                  <div class="productItem">
                      <img src="${product.imageUrl}" alt="${product.name}" class="productItem__img" onclick="getDetailProduct(this)" data-id="${product.id}">
                      <div class="productItemContainer__info">
                          <div class="productItem__info l-9">
                              <h4 class="productItem__name">${product.name}</h4>
                              <div class="productItem__price">
                                  <div class="productItem__sale">
                                      <span class="productItem__price-current">${product.newPrice}đ</span>
                                  </div>
                              </div>
                          </div>
                          <div class="productItemAdd l-3">
                            <button value="${product.id}" id="addToCart" onclick="addItemToCart(this)">
                              <i class="fa-solid fa-cart-plus"></i>
                            </button>
                          </div>
                      </div>
                  </div>
                </div>
  `;
  }

  const div = document.createElement('div');
  div.innerHTML = productItemWrapper.trim();

  return div.firstChild;
}

function createPagination(totalPages, page) {
  let liTag = '';
  let active;
  let beforePage = page - 1;
  let afterPage = page + 1;

  if (page > 1) { //show the next button if the page value is greater than 1
    liTag += `<li class="pagination-btn prev" onclick="createPagination(totalPages, ${page - 1}); getIndexPagination(this)" value="${page - 1}"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
  }

  if (page > 2) { //if page value is less than 2 then add 1 after the previous button
    liTag += `<li class="first numb" onclick="createPagination(totalPages, 1); getIndexPagination(this)" value="1"><span>1</span></li>`;
    if (page > 3 && totalPages > 3) { //if page value is greater than 3 then add this (...) after the first li or page
      liTag += `<li class="dots"><span>...</span></li>`;
    }
    //liTag += `<li class="dots"><span>...</span></li>`;
  }

  // how many pages or li show before the current li
  if (totalPages > 4) {
    if (page == totalPages) {
      beforePage = beforePage - 2;
    } else if (page == totalPages - 1) {
      beforePage = beforePage - 1;
    }
    // how many pages or li show after the current li
    if (page == 1) {
      afterPage = afterPage + 2;
    } else if (page == 2) {
      afterPage = afterPage + 1;
    }
  }

  for (var plength = beforePage; plength <= afterPage; plength++) {
    if (plength > totalPages) { //if plength is greater than totalPage length then continue
      continue;
    }
    if (plength == 0) { //if plength is 0 than add +1 in plength value
      plength = plength + 1;
    }
    if (page == plength) { //if page is equal to plength than assign active string in the active variable
      active = "active";
    } else { //else leave empty to the active variable
      active = "";
    }
    liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength}); getIndexPagination(this)" value="${plength}"><span>${plength}</span></li>`;
  }

  if (totalPages > 6) {
    if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
      if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
        liTag += `<li class="dots"><span>...</span></li>`;
      }
      liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages}); getIndexPagination(this)" value="${totalPages}"><span>${totalPages}</span></li>`;
    }
  }

  if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
    liTag += `<li class="pagination-btn next" onclick="createPagination(totalPages, ${page + 1}); getIndexPagination(this)" value="${page + 1}"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
  }
  pagination.innerHTML = liTag;
  return liTag;
}

async function fetchDataByType(type, listProduct) {
  try {
    const response = await axios.get('http://localhost:8080/plant/top/' + type.value);
    const data = response.data;

    // Xóa các child nodes trong table
    while (listProduct.firstChild) {
      listProduct.removeChild(listProduct.firstChild);
    }

    if (Array.isArray(data)) {
      data.forEach(item => {
        const productDiv = createProductItem(item, "l-2-4 m-4 c-6");
        listProduct.appendChild(productDiv);
      });
    } else {
      console.error('Response data is not an array');
    }
  } catch (error) {
    console.error('Error loading plant data:', error);
  }
}

function checkAuthentication() {
  if (localStorage.getItem('name') != null) {
    login.style.display = 'none';
    avatar.style.display = 'block';
    userLogin.innerHTML = localStorage.getItem('name');
  } else {
    login.style.display = 'block';
    avatar.style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem('name');
  localStorage.removeItem('role');
  localStorage.removeItem('token');

  window.location.reload();
}

async function searchKeywords(keyword) {
  axios.get('http://localhost:8080/plant/find/' + keyword)
    .then(response => {
      const data = response.data;

      localStorage.setItem('resultsFind', JSON.stringify(data));
      localStorage.setItem('keywords', keyword);

      // Chuyển hướng trang với URL mới
      window.location.href = 'findProduct.html?keyword=' + keyword;
    })
    .catch(error => {
      console.error('Error loading plant data:', error);
    });
}

function fetchPlantDataWithKeyword(data) {
  try {
    const resultsData = JSON.parse(data);
    keyword.innerHTML = localStorage.getItem('keywords');

    console.log(resultsData);

    while (findProductList.firstChild) {
      findProductList.removeChild(findProductList.firstChild);
    }

    if (Array.isArray(resultsData)) {
      resultsData.forEach(item => {
        const productDiv = createProductItem(item, "l-2-4 m-4 c-6");
        findProductList.appendChild(productDiv);
      });
    } else {
      console.error('Response data is not an array');
    }

    localStorage.removeItem("resultsFind");
  } catch (error) {
    console.log(error);
  }
}

if (search) {
  search.addEventListener("keydown", (e) => {
    var key = e.keyCode;
    var keyword = search.value;
    if (key == 13) {
      searchKeywords(keyword);
    }
  });
}

function showProductByType(item) {
  let _url;
  if (item.value !== "all") {
    _url = `http://localhost:8080/plant/find/?types=${item.value}&maxPrice=0&sort=0`;
    localStorage.setItem('type', item.value);
    window.location.href = 'listProduct.html?types=' + item.value;
  } else {
    _url = `http://localhost:8080/plant/find/?types=&maxPrice=0&sort=0`;
    window.location.href = 'listProduct.html?types=all';
  }

  localStorage.setItem('url', _url);
}

async function firstRedirectListProductPage() {
  await axios.get(localStorage.getItem('url'))
    .then(response => {
      let data = response.data.data;
      localStorage.setItem('totalPages', response.data.totalPages);

      let type = localStorage.getItem('type');

      if (window.location.search == "?types=all") {
        filterTypeCheckboxs.forEach(item => {
          item.checked = true;
        });
      } else {
        filterTypeCheckboxs.forEach(item => {
          if (item.value === type) {
            item.checked = true;
          }
        });
      }

      while (listProductPage.firstChild) {
        listProductPage.removeChild(listProductPage.firstChild);
      }

      if (Array.isArray(data)) {
        data.forEach(item => {
          const productDiv = createProductItem(item, "l-3 m-4 c-6");
          listProductPage.appendChild(productDiv);
        });
      } else {
        console.error('Response data is not an array');
      }
    })
    .catch(err => console.log(err));
  localStorage.removeItem('url');
  totalPages = localStorage.getItem('totalPages');
  if (totalPages > 1) {
    pagination.innerHTML = createPagination(totalPages, 1);
  }
}

function showProductInListPage() {
  try {
    let resultsListPage = JSON.parse(localStorage.getItem('resultsListPage'));
    let type = localStorage.getItem('type');

    if (window.location.search == "?types=all") {
      filterTypeCheckboxs.forEach(item => {
        item.checked = true;
      });
    } else {
      filterTypeCheckboxs.forEach(item => {
        if (item.value === type) {
          item.checked = true;
        }
      });
    }

    while (listProductPage.firstChild) {
      listProductPage.removeChild(listProductPage.firstChild);
    }

    if (Array.isArray(resultsListPage)) {
      resultsListPage.forEach(item => {
        const productDiv = createProductItem(item, "l-3 m-4 c-6");
        listProductPage.appendChild(productDiv);
      });
    } else {
      console.error('Response data is not an array');
    }

    //localStorage.removeItem('resultsListPage');
    //localStorage.removeItem('type');
  } catch (error) {
    console.log(error);
  }
}

async function fetchDataInListPage(types, minPrice, maxPrice, page, sort) {
  let func_url = 'http://localhost:8080/plant/find/?types=';
  axios.get(func_url + types.join(',') + '&minPrice=' + minPrice + '&maxPrice=' + maxPrice + '&pageNo=' + page + '&sort=' + sort)
    .then(response => {
      localStorage.setItem('totalPages', response.data.totalPages);
      localStorage.setItem('resultsListPage', JSON.stringify(response.data.data));
      window.history.pushState(null, "", 'listProduct.html?types=' + types.join(',') + '&minPrice=' + minPrice + '&maxPrice=' + maxPrice + '&page=' + page + '&sort=' + sort);
      showProductInListPage();
    })
    .catch(error => console.log(error));
  totalPages = localStorage.getItem('totalPages');
  if (totalPages > 1) {
    pagination.innerHTML = createPagination(totalPages, 1);
  }
}

function getIndexPagination(index) {
  let types = [];
  filterTypeCheckboxs.forEach(item => {
    if (item.checked) {
      types.push(item.value);
    }
  });

  let minPrice = Number(document.getElementById('minPrice').value);
  let maxPrice = Number(document.getElementById('maxPrice').value);

  fetchDataInListPage(types, minPrice, maxPrice, parseInt(index.value), sortProduct.value);

  totalPages = localStorage.getItem('totalPages');
  if (totalPages > 1) {
    pagination.innerHTML = createPagination(totalPages, parseInt(index.value));
  }
}

// ------------------------------- Detail Product Page ---------------------------------
function getDetailProduct(item) {
  let id = item.getAttribute('data-id');
  axios.get(`http://localhost:8080/plant/findById/${id}`)
    .then(response => {
      localStorage.setItem('detailProduct', JSON.stringify(response.data));
      window.location.href = 'productDetailClient.html';
    })
    .catch(err => console.log(err));
}

function createElementDetailProduct(product) {
  let detailProduct;

  if (product.sale != 0) {
    detailProduct =
      `
      <div class="box-product">
          <div class="images">
              <div class="img-holder active">
                  <img src="${product.imageUrl}">
              </div>
          </div>
          <div class="basic-info">
              <h1>${product.name}</h1>
              <div class="rate">
                  <span>${product.rating}</span>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
              </div>
              <div class="price">
                ${product.newPrice.toLocaleString()}đ 
                <span>${product.oldPrice.toLocaleString()}đ</span>
                <span class="saleDetail">${product.sale}%</span>
              </div>
              <div class="options">
                  <button value=${product.id} id="addToCart" onclick="addItemToCart(this)">Add to Cart</button>
              </div>
          </div>
          <div class="description">
              <p>${product.description}</p>
          </div>
      </div>
    `
  } else {
    detailProduct =
      `
      <div class="box-product">
          <div class="images">
              <div class="img-holder active">
                  <img src="${product.imageUrl}">
              </div>
          </div>
          <div class="basic-info">
              <h1>${product.name}</h1>
              <div class="rate">
                  <span>5.0</span>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
                  <i class="filled fas fa-star"></i>
              </div>
              <div class="price">${product.newPrice.toLocaleString()}đ</div>
              <div class="options">
                  <button value=${product.id} id="addToCart" onclick="addItemToCart(this)">Add to Cart</button>
              </div>
          </div>
          <div class="description">
              <p>${product.description}</p>
          </div>
      </div>
    `
  }
  return detailProduct;
}

function renderDetailProduct() {
  try {
    let data = JSON.parse(localStorage.getItem('detailProduct'));

    const productDiv = createElementDetailProduct(data);
    containerProductDetail.innerHTML = productDiv;

    loadComments(data.id);
  } catch (error) {
    console.log(error);
  }
}

async function addItemToCart(item) {
  let token = localStorage.getItem('token');
  let email = localStorage.getItem('email');

  await axios.post(
    `http://localhost:8080/cart/add-plant/?email=${email}&quantity=1&plantId=${item.value}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    }
  )
    .then(response => {
      let mess = response.data;
      showSuccessToast(mess);
    })
    .catch(error => {
      let mess = response.data;
      showErrorToast(mess);
    });
}
// ------------------------------- Cart Page ---------------------------------
function createElementCartPage(data) {
  for (let i = tableCartPage.rows.length - 1; i > 0; i--) {
    tableCartPage.deleteRow(i);
  }

  let cartItems = data.cartItemsDTO;

  for (let i = 0; i < cartItems.length; i++) {
    let newRow = tableCartPage.insertRow(i + 1);
    newRow.innerHTML = `
        <td>
            <div class="cartItem">
                <div class="cartItem-img">
                    <img src="${cartItems[i].plant.imageUrl}" alt="${cartItems[i].plant.name}">
                </div>
                <div class="cartItem-info">
                    <span>${cartItems[i].plant.name}</span>
                    <span>Price: ${cartItems[i].plant.newPrice} đ</span>
                </div>
            </div>
        </td>
        <td><input type="text" readonly value="${cartItems[i].quantity}"></td>
        <td>${cartItems[i].totalPrice} đ</td>
        <td>
            <button value="${cartItems[i].plant.id}" onclick="openModal(this)"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;
  }
}

async function fetchDataShoppingCart() {
  let token = localStorage.getItem('token');
  let totalPrice = document.querySelector(".cartPayment-total__content");
  let totalItems = document.querySelector(".shoppingCartList-title span");

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get(
    'http://localhost:8080/cart/get-shopping-cart',
    { headers: headers }
  );

  const data = response.data.body;

  if (data.cartItemsDTO.length > 0) {
    for (let i = tableCartPage.rows.length - 1; i > 0; i--) {
      tableCartPage.deleteRow(i);
    }
    createElementCartPage(data);
  } else {
    const btnCheckout = document.querySelector(".btnCheckout");
    const shoppingCartList = document.querySelector(".shoppingCartList-item");
    btnCheckout.href = "#";
    btnCheckout.classList.add("disabled");
    shoppingCartList.innerHTML = "Chưa có sản phẩm trong giỏ hàng.";
  }

  totalPrice.innerHTML = `${data.totalPrices} đ`;
  totalItems.innerHTML = `${data.totalItems} items`;
}

function removeCartItem(item) {
  let token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  axios.delete(
    'http://localhost:8080/cart/remove/' + item,
    { headers: headers }
  )
    .then(response => {
      console.log(response);
      //window.location.reload();
    })
    .catch(error => {
      console.error('Error removing cart item:', error);
    });
}

function openModal(item) {
  removeModal.style.display = 'block';
  btnDangerModal.setAttribute("data-id", item);
  console.log(item);
}

function cancelModal() {
  removeModal.style.display = 'none';
}

function confirmRemove() {
  let dataId = btnDangerModal.getAttribute("data-id");
  removeCartItem(dataId);
  window.location.reload();
}

// ------------------------------- Check out ---------------------------------
if (btnPayment) {
  btnPayment.addEventListener('click', (e) => {
    e.preventDefault();

    let validation = true;
    let addressUser = document.getElementById('kh_diachi');
    let paymentModal = document.querySelector('#paymentModal');
    let phoneNumber = paymentForm.querySelector("input[name='phone']");
    let address = paymentForm.querySelector("input[name='address']");
    let userName = paymentForm.querySelector("input[name='name']");

    let errMess = paymentForm.querySelectorAll(".error-mess");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let email = paymentForm.querySelector("input[name='email'");
    let paymentMethods = paymentForm.querySelectorAll("input[name='httt_ma']");

    let isValidEmail = emailPattern.test(email.value);

    if (userName.value == "") {
      errMess[0].innerHTML = "Vui lòng không để trống.";
      validation = false;
    } else {
      errMess[0].innerHTML = "";
    }

    if (!isValidEmail) {
      errMess[1].innerHTML = "Vui lòng nhập Email.";
      validation = false;
    } else {
      errMess[1].innerHTML = "";
    }

    if (phoneNumber.value == "") {
      errMess[2].innerHTML = "Vui lòng không để trống.";
      validation = false;
    } else if (phoneNumber.value.length != 10 || isNaN(phoneNumber.value)) {
      errMess[2].innerHTML = "Số điện thoại không hợp lệ.";
      validation = false;
    } else {
      errMess[2].innerHTML = "";
    }

    if (address.value == "") {
      errMess[3].innerHTML = "Vui lòng không để trống.";
      validation = false;
    } else {
      errMess[3].innerHTML = "";
    }

    let count = 0;
    let paymentMethod;
    paymentMethods.forEach(item => {
      if (item.checked) {
        count++;
        paymentMethod = item.value;
      }
    });

    if (count === 0) {
      errMess[4].innerHTML = "Vui lòng chọn phương thức thanh toán.";
      validation = false;
    } else {
      errMess[4].innerHTML = "";
    }

    if (validation) {
      if (paymentMethod == "Banking") {
        paymentModal.style.display = 'block';
      } else {
        placeOrder(addressUser.value, paymentMethod, userName.value, phoneNumber.value);
      }
    }
  });
}

if (btnBanking) {
  btnBanking.addEventListener('click', (e) => {
    e.preventDefault();

    let validation = true;

    let addressUser = document.getElementById('kh_diachi');
    let card = document.getElementById('httt-2');
    let userName = paymentForm.querySelector("input[name='name']");
    let phoneNumber = paymentForm.querySelector("input[name='phone']");

    let errMess = bankingForm.querySelectorAll(".error-mess");

    if (bankingForm.querySelector("input[name='cardname']").value === "") {
      errMess[0].innerHTML = "Vui lòng không để trống.";
      validation = false;
    } else {
      errMess[0].innerHTML = "";
    }

    if (bankingForm.querySelector("input[name='cardnumber']").value === "") {
      errMess[1].innerHTML = "Vui lòng không để trống.";
      validation = false;
    } else {
      errMess[1].innerHTML = "";
    }

    let expiryInput = bankingForm.querySelector("input[name='validcard']");
    let expiryResult = errMess[2];

    validation = checkExpiry(expiryInput, expiryResult);
    if (validation) {
      placeOrder(addressUser.value, card.value, userName.value, phoneNumber.value);
      closePaymentModal();
    }
  });
}

function checkExpiry(expiryInput, expiryResult) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the current year

  // Validate the input format (MM/YY)
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const [inputMonth, inputYear] = expiryInput.value.split('/').map(Number);

  if (expiryInput.value == "") {
    expiryResult.innerHTML = 'Vui lòng không để trống.';
    return false;
  } else if (!expiryRegex.test(expiryInput.value)) {
    expiryResult.innerHTML = 'Thẻ không hợp lệ.';
    return false;
  } else {
    if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentDate.getMonth() + 1)) {
      expiryResult.innerHTML = 'Thẻ không hợp lệ.';
      return false;
    } else {
      expiryResult.innerHTML = "";
      return true;
    }
  }
}

function autoSlash() {
  const expiryInput = document.getElementById('expmonth');

  // Only auto-generate "/" after entering two characters for MM
  if (expiryInput.value.length === 2 && !expiryInput.value.includes('/')) {
    expiryInput.value += '/';
  }
}

function closePaymentModal() {
  let paymentModal = document.querySelector('#paymentModal');
  paymentModal.style.display = 'none';
}

function createElementInPayment(item) {
  let listItem = document.createElement('li');
  listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'lh-condensed');

  let cartItemWrapper =
    `
    <div>
      <h6 class="my-0">${item.plant.name}</h6>
      <small class="text-muted">${item.plant.newPrice} x ${item.quantity}</small>
    </div>
    <span class="text-muted">${item.totalPrice}</span>
    `;
  listItem.innerHTML = cartItemWrapper;
  return listItem;
}

function createElementTotalPriceInPayment(item) {
  let totalPrices = document.createElement('li');
  totalPrices.classList.add('list-group-item', 'd-flex', 'justify-content-between');

  let totalPricesWrapper =
    `
    <span>Tổng thành tiền</span>
    <strong>${item.totalPrices}</strong>
  `;

  totalPrices.innerHTML = totalPricesWrapper;
  return totalPrices;
}

async function renderListShoppingCartInPayment() {
  let token = localStorage.getItem('token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get(
    'http://localhost:8080/cart/get-shopping-cart',
    { headers: headers }
  );

  const data = response.data.body;
  const cartItems = data.cartItemsDTO;

  if (cartItems.length > 0) {
    cartItems.forEach(cartItem => {
      let element = createElementInPayment(cartItem);
      listCartItemInPayment.appendChild(element);
    });

    let totalPricesElement = createElementTotalPriceInPayment(data);
    listCartItemInPayment.appendChild(totalPricesElement);
  } else {
    let btnOrder = document.getElementById("btnOrder");
    btnOrder.setAttribute("disabled", true);
  }
}

async function placeOrder(address, paymentMethod, username, phone) {
  let token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const response = await axios.post(
    'http://localhost:8080/order/create',
    {
      address: address,
      payment: paymentMethod,
      username: username,
      phone: phone
    },
    { headers }
  );
  console.log(response);
  if (response.status == 200) {
    clearFormCheckout();
    showSuccessToast(response.data);
  } else {
    showErrorToast(response.data);
  }
}

function clearFormCheckout() {
  let form = document.querySelector('.needs-validation');
  let email = form.querySelector("input[name='email']")
  let phoneNumber = form.querySelector("input[name='phone']");
  let address = form.querySelector("input[name='address']");
  let userName = form.querySelector("input[name='name']");
  let httt1 = form.querySelector("#httt-1");
  let httt2 = form.querySelector("#httt-2");

  email.value = "";
  phoneNumber.value = "";
  address.value = "";
  userName.value = "";
  httt1.removeAttribute("checked");
  httt2.removeAttribute("checked");
}

// --------------------------------------- History Order -----------------------------------
function createTable(item) {
  let trContainer = document.createElement("tr");
  let content;
  let paymentStatus = item.paymentStatus === "Cash" ? "Ship COD" : "Chuyển khoản"
  if (item.orderStatus == "Đang xử lí") {
    content =
      `
        <td class="text-center">${item.id}</td>
        <td class="text-center">${item.createdDate}</td>
        <td class="text-center">${item.username}</td>
        <td class="text-center">${paymentStatus}</td>
        <td class="text-center">${item.orderStatus}</td>
        <td class="text-center">
            <button onclick="openModal(${item.id})" class="btnCancelOrder">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
        <td class="text-center">
            <button class="btnView" onclick="openModalDetailOrder(${item.id})">
                <i class="fa-solid fa-eye"></i>
            </button>
        </td>
        `;
  } else {
    content =
      `
        <td class="text-center">${item.id}</td>
        <td class="text-center">${item.createdDate}</td>
        <td class="text-center">${item.username}</td>
        <td class="text-center">${paymentStatus}</td>
        <td class="text-center">${item.orderStatus}</td>
        <td class="text-center">
            <button class="btnCancelOrder disabled" disabled>
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
        <td class="text-center">
            <button class="btnView" onclick="openModalDetailOrder(${item.id})">
                <i class="fa-solid fa-eye"></i>
            </button>
        </td>
        `;
  }

  trContainer.innerHTML = content;

  return trContainer;
}

async function fetchDataOrderByUser() {
  let token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get('http://localhost:8080/order/getAllOrder',
    { headers: headers }
  );

  const amountOrder = document.querySelector(".amount");
  const data = response.data.data;

  amountOrder.innerHTML = `Đơn hàng (${response.data.totalOrders})`;

  let tableHistoryOrder = document.querySelector(".tableHistoryOrder");
  tableHistoryOrder.innerHTML = "";

  if (Array.isArray(data)) {
    data.forEach(item => {
      let element = createTable(item);
      tableHistoryOrder.appendChild(element);
    });
  };
}

async function confirmCancelOrder() {

  let token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  let dataId = btnDangerModal.getAttribute("data-id");

  const response = await axios.put(`http://localhost:8080/order/updateOrderStatus/${dataId}/2`, {},
    { headers: headers }
  );

  if (response.status === 200) {
    window.location.reload();
  } else {
    showErrorToast("Hủy đơn hàng không thành công.");
  }
}

function closeModalDetailOrder() {
  const modalDetailOrder = document.querySelector(".modalDetailOrder");
  modalDetailOrder.style.display = "none";
}

function openModalDetailOrder(id) {
  const modalDetailOrder = document.querySelector(".modalDetailOrder");
  modalDetailOrder.style.display = "block";
  fetchDataOrderDetail(id);
}

async function fetchDataOrderDetail(id) {
  let formDetailOrder = document.querySelector(".formDetailOrder-container");
  let username = document.querySelector(".formDetailOrder-name");
  let address = document.querySelector(".formDetailOrder-address");
  let phone = document.querySelector(".formDetailOrder-phone");
  let orderStatus = document.querySelector(".formDetailOrder-status");
  let totalPriceOrder = document.querySelector(".formDetailOrder-totalPriceOrder");
  formDetailOrder.innerHTML = "";

  const token = localStorage.getItem("token");

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get(`http://localhost:8080/order/getOneOrder/${id}`,
    { headers: headers }
  );

  const data = response.data;
  const orderItems = data.orderItem;

  if (Array.isArray(orderItems)) {
    orderItems.forEach(orderItem => {
      createModalOrderDetail(orderItem.plant, orderItem.quantity, orderItem.totalPrice);
    });
  };

  username.innerHTML = `Họ tên: ${data.username}`;
  address.innerHTML = `Địa chỉ giao hàng: ${data.billingAddress}`;
  phone.innerHTML = `SĐT: ${data.phone}`;
  orderStatus.innerHTML = `Tình trạng đơn hàng: ${data.orderStatus}`;
  totalPriceOrder.innerHTML = `Tổng: ${data.totalPricesOrder.toLocaleString()}đ`;
}

function createModalOrderDetail(item, quantity, totalPrice) {
  const productHtml = `
        <div class="formDetailOrder-product">
            <div class="detailOrder-product__img">
                <img src="${item.imageUrl}" alt="">
            </div>
            <div class="detailOrder-product__info">
                <div class="detailProduct__name">${item.name}</div>
                <div class="detailProduct__quantity">x ${quantity}</div>
            </div>
            <div class="detailProduct__totalPrice">${totalPrice.toLocaleString()}đ</div>
        </div>
    `;
  let container = document.querySelector(".formDetailOrder-container");
  container.innerHTML += productHtml;
}

// ---------------------------- Review ------------------------------------
function submitReviewProduct() {
  let rating = document.querySelectorAll("input[name='rating']");
  let contentReview = document.querySelector(".form-control");
  let commentBox = document.querySelector(".comment-box");
  let err = commentBox.querySelector(".err-mess");
  let count = 0;

  let ratingValue;

  rating.forEach(item => {
    if (item.checked) {
      count++;
      ratingValue = item.value;
    }
  });
  if (count === 0 || contentReview.value.length === 0) {
    err.innerHTML = "Vui lòng đánh giá sản phẩm.";
  } else {
    postReviewProduct(ratingValue, contentReview.value);
    $('#form').modal('hide');
  }
}

function createContainerReview(item) {
  let review = document.createElement('li');
  review.classList.add('container-review');

  let reviewContent =
    `
    <div class="review-username">${item.username}</div>
    <div class="review-rating">
        <span>${item.rating}</span>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
        <i class="fa-solid fa-star"></i>
    </div>
    <div class="review-time">${item.createdDate}</div>
    <div class="review-content">${item.content}</div>
    `;
  review.innerHTML = reviewContent;
  return review;
}

async function postReviewProduct(rating, content) {
  const token = localStorage.getItem("token");

  const product = JSON.parse(localStorage.getItem("detailProduct"));
  const id = product.id;

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = {
    rating: rating,
    content: content
  };

  const response = await axios.post(`http://localhost:8080/comment/post-comment/${id}`,
    body,
    { headers: headers }
  );

  //console.log(response.data);
}

async function loadComments(id) {
  const response = await axios.get(`http://localhost:8080/comment/get-all-comments-for-plant/${id}`);
  const data = response.data;

  const containerReviews = document.querySelector(".container-list-review");

  containerReviews.innerHTML = "";

  if (Array.isArray(data)) {
    data.forEach(item => {
      let element = createContainerReview(item);
      containerReviews.appendChild(element);
    })
  }

  console.log(response.data);
}
// ---------------------------------- Profile ----------------------------------
async function loadProfileUser() {
  const token = localStorage.getItem("token");

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await axios.get('http://localhost:8080/login/find',
    { headers: headers }
  );

  const data = response.data;

  renderProfileUser(data);

  console.log(data);
}

function renderProfileUser(item) {
  let username = document.getElementById('profileUsername');
  let address = document.getElementById('profileAddress');

  username.innerHTML = item.name;
  address.innerHTML = item.address;

  let inputFullname = profileUser.querySelector("input[name='fullname']");
  let inputEmail = profileUser.querySelector("input[name='email']");
  let inputPhone = profileUser.querySelector("input[name='phone']");
  let inputAddress = profileUser.querySelector("input[name='address']");

  inputFullname.value = item.name;
  inputEmail.value = item.email;
  inputPhone.value = item.phone;
  inputAddress.value = item.address;
}

async function updateProfileUser() {
  const token = localStorage.getItem("token");

  let inputFullname = profileUser.querySelector("input[name='fullname']");
  let inputEmail = profileUser.querySelector("input[name='email']");
  let inputPhone = profileUser.querySelector("input[name='phone']");
  let inputAddress = profileUser.querySelector("input[name='address']");

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const body = {
    "name": inputFullname.value,
    "email": inputEmail.value,
    "phone": inputPhone.value,
    "address": inputAddress.value
  };

  const response = await axios.put('http://localhost:8080/login/update-info',
    body,
    { headers: headers }
  );

  const data = response.data;
}

// ---------------------------------------------------------------------------------------------
if (type1) { fetchDataByType(senda, type1); }
if (type2) { fetchDataByType(lan, type2); }
if (type3) { fetchDataByType(cactus, type3); }
fetchPlantDataWithKeyword(localStorage.getItem("resultsFind"));
if (listProductPage) { showProductInListPage(); }
firstRedirectListProductPage();
if (containerProductDetail) { renderDetailProduct(); }
fetchDataShoppingCart();
checkAuthentication();
if (listCartItemInPayment) { renderListShoppingCartInPayment(); }
fetchDataOrderByUser();
if (profileUser) { loadProfileUser() };