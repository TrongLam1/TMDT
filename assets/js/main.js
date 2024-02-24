const element = document.querySelector(".pagination ul");
const formUpdate = document.querySelector(".formUpdate");
const formCreate = document.querySelector(".formCreate");
const btnUpdate = document.getElementById("update");
const btnDeleteProduct = document.querySelector(".btnDelete");
const removeModal = document.querySelector("#myModal");
const pagination = document.querySelector(".pagination");
let amount = document.querySelector(".amount");
let totalPages = 10;
let pages = 1;

// ---------------------------- Pagination -------------------------------------
function createPaginationForNav(totalPages, currentPage) {
    let liTag = '';

    // Previous button
    liTag += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="createPaginationForNav(totalPages, ${currentPage - 1});">${'Previous'}</a></li>`;

    // Page numbers
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            liTag += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" onclick="createPaginationForNav(totalPages, ${i});">${i}</a></li>`;
        }
    } else {
        for (let i = 1; i <= 6; i++) {
            liTag += `<li class="page-item ${currentPage === i ? 'active' : ''}"><a class="page-link" href="#" onclick="createPaginationForNav(totalPages, ${i});">${i}</a></li>`;
        }
        if (currentPage < totalPages - 3) {
            liTag += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Next button
    liTag += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="createPaginationForNav(totalPages, ${currentPage + 1});">${'Next'}</a></li>`;

    // Update the HTML
    pagination.innerHTML = liTag;
}

function fetchNextPage(index) {
    console.log(index);
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

// -----------------------------------------------------------------------------

function checkAuthentication() {
    let adminInfo = document.querySelector("#admin");
    let admin = document.querySelector("#loginAdminActive");
    let login = document.querySelector("#loginAdmin");
    if (localStorage.getItem('name') != null) {
        login.style.display = 'none';
        admin.style.display = 'block';
        adminInfo.innerHTML = localStorage.getItem('name');
    } else {
        login.style.display = 'block';
        admin.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');

    window.location.reload();
}

function generateNewPrice() {
    const oldPrice = document.querySelector('input[name="oldPrice"]');
    const sale = document.querySelector('input[name="sale"]');
    const newPrice = document.querySelector('input[name="newPrice"]');
    var value = oldPrice.value - oldPrice.value * sale.value / 100;
    newPrice.value = value;
}

async function createNewProduct() {
    var formData = new FormData(formCreate);

    const accessToken = localStorage.getItem('token');

    await axios.post('http://localhost:8080/admin/plant/create',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(function (response) {
            // If the request was successful, you can handle the response here
            console.log(response.data);
        })
        .catch(function (error) {
            // If there was an error, you can handle it here
            console.error('Error:', error);
        });
}

async function updateProduct(item) {
    var formData = new FormData(formUpdate);

    const accessToken = localStorage.getItem('token');

    const id = item.getAttribute('data-id');

    await axios.post(`http://localhost:8080/admin/plant/update/${id}`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + accessToken
            }
        })
        .then(function (response) {
            // If the request was successful, you can handle the response here
            console.log(response.data);
            window.location.reload();
        })
        .catch(function (error) {
            // If there was an error, you can handle it here
            console.error('Error:', error);
        });
}

function createTableProduct(item) {
    let trContainer = document.createElement("tr");
    trContainer.classList.add("tableItem");

    let content =
        `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.newPrice}</td>
        <td>${item.type}</td>
        <td>
            <img id="imagePlant" src="${item.imageUrl}">
        </td>
        <td class="productDescription">${item.description}</td>
        <td>
            <a onclick="getIdProductDetailAdmin(${item.id})" href="editProduct.html" class="btnEdit">
                <i class="fa-solid fa-pen-to-square"></i>
            </a>
        </td>
        <td>
            <button onclick="openModal(${item.id})" class="btnDelete">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </td>
        `;
    trContainer.innerHTML = content;

    return trContainer;
}

function createTableUser(item) {
    let trContainer = document.createElement("tr");
    trContainer.classList.add("tableItem");

    console.log(item);

    if (item.role == "ADMIN") {
        return trContainer;
    }

    let content =
        `
        <td>${item.id}</td>
        <td>${item.createdDate}</td>
        <td>${item.name}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        `;
    trContainer.innerHTML = content;

    return trContainer;
}

function createTableOrders(item) {
    let trContainer = document.createElement("tr");
    trContainer.classList.add("tableItem");

    let content;

    if (item.orderStatus == "Đang xử lí") {
        content =
            `
        <td>${item.id}</td>
        <td>${item.createdDate}</td>
        <td>${item.username}</td>
        <td>${item.paymentStatus}</td>
        <td>${item.orderStatus}</td>
        <td>
            <button type="button" onclick="updateStatusOrder(${item.id})" class="btnUpdateStatus">
                Đã giao
            </button>
        </td>
        <td>
            <button onclick="openModalDetailOrder(${item.id})" class="btnViewOrder">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        `;
    } else {
        content =
            `
        <td>${item.id}</td>
        <td>${item.createdDate}</td>
        <td>${item.username}</td>
        <td>${item.paymentStatus}</td>
        <td>${item.orderStatus}</td>
        <td>
            <button type="button" onclick="updateStatusOrder(${item.id})" class="btnUpdateStatus active" disabled>
                Đã giao
            </button>
        </td>
        <td>
            <button onclick="openModalDetailOrder(${item.id})" class="btnViewOrder">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        `;
    }


    trContainer.innerHTML = content;

    return trContainer;
}

async function fetchPlantData() {
    const tableProduct = document.querySelector('.tableProductBody');
    const response = await axios.get('http://localhost:8080/plant/list');
    const data = response.data.data;
    const totalItems = response.data.totalItems;
    totalPages = response.data.totalPages;

    //amount.innerHTML = `All Product (${totalItems})`;

    tableProduct.innerHTML = "";

    if (Array.isArray(data)) {
        data.forEach(item => {
            let element = createTableProduct(item);
            tableProduct.appendChild(element);
        });
    };
}

async function fetchUserData() {
    const tableUser = document.querySelector('.tableCustomerBody');
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    const response = await axios.get('http://localhost:8080/admin/plant/getAllUsers',
        { headers }
    );

    const data = response.data.data;
    const totalItems = response.data.totalItems;
    totalPages = response.data.totalPages;

    //amount.innerHTML = `All Users (${totalItems})`;

    tableUser.innerHTML = "";

    if (Array.isArray(data)) {
        data.forEach(item => {
            let element = createTableUser(item);
            tableUser.appendChild(element);
        });
    };
}

async function fetchOrdersData() {
    const tableOrder = document.querySelector('.tableOrderBody');
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    const response = await axios.get('http://localhost:8080/admin/plant/getAllOrders',
        { headers }
    );

    const data = response.data.data;
    const totalItems = response.data.totalItems;
    totalPages = response.data.totalPages;

    //amount.innerHTML = `All Orders (${totalItems})`;

    tableOrder.innerHTML = "";

    if (Array.isArray(data)) {
        data.forEach(item => {
            let element = createTableOrders(item);
            tableOrder.appendChild(element);
        });
    };

    createPaginationForNav(totalPages, 1);
}

function createPagination(data, totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;

    if (totalPages == 1) {
        pagination.style.display = 'none';
        return;
    }

    if (page > 1) { //show the next button if the page value is greater than 1
        liTag += `<li class="pagination-btn prev" onclick="createPagination(totalPages, ${page - 1}); getIndexPagination('${data}', this)" value="${page - 1}"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
        liTag += `<li class="first numb" onclick="createPagination(totalPages, 1); getIndexPagination('${data}', this)" value="1"><span>1</span></li>`;
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
        liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength}); getIndexPagination('${data}', this)" value="${plength}"><span>${plength}</span></li>`;
    }

    if (totalPages > 6) {
        if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
            if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages}); getIndexPagination('${data}', this)" value="${totalPages}"><span>${totalPages}</span></li>`;
        }
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
        liTag += `<li class="pagination-btn next" onclick="createPagination(totalPages, ${page + 1}); getIndexPagination('${data}', this)" value="${page + 1}"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    pagination.innerHTML = liTag;
    return liTag;
}

async function getIndexPagination(data, index) {
    if (data == "product") {
        const response = await axios.get('http://localhost:8080/plant/list?pageNo=' + index.value);
        const data = response.data.data;
        totalPages = response.data.totalPages;

        tableAdmin.innerHTML = "";

        if (Array.isArray(data)) {
            data.forEach(item => {
                let element = createTableProduct(item);
                tableAdmin.appendChild(element);
            });
        };

        pagination.innerHTML = createPagination("product", totalPages, index.value);
    } else if (data == "user") {
        const response = await axios.get('http://localhost:8080/plant/list?pageNo=' + index.value);
        const data = response.data.data;
        totalPages = response.data.totalPages;

        tableAdmin.innerHTML = "";

        if (Array.isArray(data)) {
            data.forEach(item => {
                let element = createTableUser(item);
                tableAdmin.appendChild(element);
            });
        };

        pagination.innerHTML = createPagination("user", totalPages, index.value);
    } else {
        const response = await axios.get('http://localhost:8080/admin/plant/getAllOrders?pageNo=' +
            index.value);
        const data = response.data.data;
        totalPages = response.data.totalPages;

        tableAdmin.innerHTML = "";

        if (Array.isArray(data)) {
            data.forEach(item => {
                let element = createTableOrders(item);
                tableAdmin.appendChild(element);
            });
        };
        pagination.innerHTML = createPagination("order", totalPages, index.value);
    }
}

function linkToProductDetailAdmin(item) {
    window.location.href = "productDetailAdmin.html";
    localStorage.setItem("idDetailProduct", item);
}

function renderFormUpdate(item) {
    const nameProduct = formUpdate.querySelector("input[name='name']");
    const oldPrice = formUpdate.querySelector("input[name='oldPrice']");
    const sale = formUpdate.querySelector("input[name='sale']");
    const type = formUpdate.querySelector("select[name='type']");
    const newPrice = formUpdate.querySelector("input[name='newPrice']");
    const description = formUpdate.querySelector(".descriptionText");
    const image = formUpdate.querySelector("#img-preview");
    const btnSubmit = formUpdate.querySelector("#update");

    nameProduct.value = item.name;
    oldPrice.value = item.oldPrice;
    sale.value = item.sale;
    type.value = item.type;
    newPrice.value = item.newPrice;
    description.value = item.description;
    image.src = item.imageUrl;
    btnSubmit.setAttribute("data-id", item.id);
}

async function fetchDetailProductAdmin() {
    let id = localStorage.getItem("idDetailProduct");
    const response = await axios.get('http://localhost:8080/plant/findById/' + id);
    const data = response.data;
    console.log(data);
    renderFormUpdate(data);
}

function getIdProductDetailAdmin(id) {
    localStorage.setItem("idDetailProduct", id);
}

function enableEdit() {
    const name = formUpdate.querySelector("input[name='name']");
    const oldPrice = formUpdate.querySelector("input[name='oldPrice']");
    const sale = formUpdate.querySelector("input[name='sale']");
    const newPrice = formUpdate.querySelector("input[name='newPrice']");
    const type = formUpdate.querySelector("select[name='type']");
    const description = formUpdate.querySelector(".descriptionText");

    if (btnUpdate.style.display == "none") {
        btnUpdate.style.display = "block";

        name.removeAttribute("readonly");
        oldPrice.removeAttribute("readonly");
        sale.removeAttribute("readonly");
        newPrice.removeAttribute("readonly");
        type.removeAttribute("readonly");
        description.removeAttribute("readonly");
    } else {
        btnUpdate.style.display = "none";
        name.setAttribute("readonly", true);
        oldPrice.setAttribute("readonly", true);
        sale.setAttribute("readonly", true);
        newPrice.setAttribute("readonly", true);
        type.setAttribute("readonly", true);
        description.setAttribute("readonly", true);
    }
}

async function adminRemoveProduct(id) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    await axios.delete('http://localhost:8080/admin/plant/delete/' + id,
        { headers: headers }
    )
        .then(response => {
            window.location.reload();
            console.log(response);
        })
        .catch(err => console.log(err));

}

function openModal(id) {
    removeModal.style.display = 'block';
    const btnCancelModal = document.querySelector(".btn-secondary");
    const btnDangerModal = document.querySelector(".btn-danger");
    btnDangerModal.setAttribute("data-id", id);
    btnCancelModal.addEventListener('click', () => {
        cancelModal();
    });
    btnDangerModal.addEventListener('click', () => {
        adminRemoveProduct(id);
    });
}

function cancelModal() {
    removeModal.style.display = 'none';
}

function openModalDetailOrder(id) {
    const modalDetailOrder = document.querySelector(".modalDetailOrder");
    modalDetailOrder.style.display = "block";
    fetchDataOrderDetail(id);
}

function closeModalDetailOrder() {
    const modalDetailOrder = document.querySelector(".modalDetailOrder");
    modalDetailOrder.style.display = "none";
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
            <div class="detailProduct__totalPrice">${totalPrice}đ</div>
        </div>
    `;
    let container = document.querySelector(".formDetailOrder-container");
    container.innerHTML += productHtml;
}

async function updateStatusOrder(id) {
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response =
        await axios.put(`http://localhost:8080/order/updateOrderStatus/${id}/1`, {},
            { headers: headers }
        );

    window.location.reload();
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

    const response = await axios.get(`http://localhost:8080/admin/plant/findOrderById/${id}`,
        { headers: headers }
    );

    const data = response.data;
    const orderItems = data.orderItem;

    console.log(data);

    if (Array.isArray(orderItems)) {
        orderItems.forEach(orderItem => {
            createModalOrderDetail(orderItem.plant, orderItem.quantity, orderItem.totalPrice);
        });
    };

    username.innerHTML = `Họ tên: ${data.username}`;
    address.innerHTML = `Địa chỉ giao hàng: ${data.billingAddress}`;
    phone.innerHTML = `SĐT: ${data.phone}`;
    orderStatus.innerHTML = `Tình trạng đơn hàng: ${data.orderStatus}`;
    totalPriceOrder.innerHTML = `Tổng: ${data.totalPricesOrder}đ`;
}

function createChartByYear(data, year) {
    let arrayMonth = [];
    let result = [];

    for (let i = 1; i <= 12; i++) {
        arrayMonth.push(`Tháng ${i}`);
        let matchingMonth = data.find(item => item[0] === i);
        result.push(matchingMonth ? matchingMonth[1] : 0);
    }

    var existingChart = Chart.getChart("myChart");
    if (existingChart) {
        existingChart.destroy();
    }

    var ctx = document.getElementById("myChart");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayMonth,
            datasets: [{
                label: `# doanh thu trong tháng năm ${year}`,
                data: result,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createChartDateRange(data, startDate, endDate) {
    let arrayDate = createDateRangeArray(startDate, endDate);
    let result = [];

    for (let i = 0; i < arrayDate.length; i++) {
        result[i] = 0;
    };

    data.forEach(item => {
        let dateIndex = arrayDate.indexOf(item[0]);
        if (dateIndex !== -1) {
            result[dateIndex] += item[1];
        }
    });

    var existingChart = Chart.getChart("myChart");
    if (existingChart) {
        existingChart.destroy();
    }

    var ctx = document.getElementById("myChart");

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayDate,
            datasets: [{
                label: `# doanh thu từ ${startDate} đến ${endDate}`,
                data: result,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createDateRangeArray(startDate, endDate) {
    let currentDate = new Date(startDate);
    const arrayDate = [];

    while (currentDate <= new Date(endDate)) {
        arrayDate.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return arrayDate;
}

async function fetchDataInYearForChart(year) {
    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await axios.get('http://localhost:8080/admin/plant/getTotalPriceInYear/' + year,
        { headers: headers }
    );

    createChartByYear(response.data, year);
}

async function fetchDataForDateRange(startDate, endDate) {
    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await axios
        .get(`http://localhost:8080/admin/plant/getTotalPricesByRange/?startDate=${startDate}&endDate=${endDate}`,
            { headers: headers }
        );

    createChartDateRange(response.data, startDate, endDate);
}

function tabGetYear(item) {
    let getYear = document.querySelector(".getYear");
    let datePicker = document.querySelector(".datePicker");

    let btnDatePicker = document.querySelector(".btnDatePicker");

    getYear.style.display = "block";
    datePicker.style.display = "none";

    item.classList.add("active");
    btnDatePicker.classList.remove("active");
}

function tabDatePicker(item) {
    let getYear = document.querySelector(".getYear");
    let datePicker = document.querySelector(".datePicker");

    let btnGetYear = document.querySelector(".btnGetYear");

    getYear.style.display = "none";
    datePicker.style.display = "flex";

    item.classList.add("active");
    btnGetYear.classList.remove("active");
}

function getValueYear() {
    let parent = document.querySelector(".getYear");
    let input = parent.querySelector("input");
    let err = parent.querySelector(".error-mess");

    if (!isValidYear(input.value)) {
        err.innerHTML = "Năm không hợp lệ";
    } else {
        err.innerHTML = "";
        fetchDataInYearForChart(input.value);
    }
}

function isValidYear(year) {
    const isNumeric = /^\d+$/;
    if (!isNumeric.test(year)) {
        return false;
    }

    year = parseInt(year, 10);

    if (year >= 1000 && year <= 9999) {
        return true;
    } else {
        return false;
    }
}

function getDateRange() {
    let parent = document.querySelector(".datePicker");
    let err = parent.querySelector(".error-mess");
    let startDate = document.querySelector(".startDate");
    let endDate = document.querySelector(".endDate");

    let inputStartDate = startDate.querySelector("input");
    let inputEndDate = endDate.querySelector("input");

    if (inputStartDate.value < inputEndDate.value) {
        err.innerHTML = "";
        fetchDataForDateRange(String(inputStartDate.value), String(inputEndDate.value));
    } else {
        err.innerHTML = "Vui lòng chọn lại.";
    }
}

async function fetchDataResumeOrdersStatus() {
    const token = localStorage.getItem("token");

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const response = await axios.get(`http://localhost:8080/admin/plant/count/orderStatus`,
        { headers: headers }
    );

    let totalEarn = document.getElementById("totalEarn");
    let pendingOrders = document.getElementById("pendingOrder");
    let deliveredOrders = document.getElementById("deliveredOrder");
    let canceledOrders = document.getElementById("canceledOrder");

    console.log(response.data);

    totalEarn.innerHTML = response.data.totalEarn.toLocaleString() + " đ";
    pendingOrders.innerHTML = response.data.pending;
    deliveredOrders.innerHTML = response.data.delivered;
    canceledOrders.innerHTML = response.data.canceled;
}

// -------------------------------------------------------------------------------------
fetchPlantData();
if (formUpdate) { fetchDetailProductAdmin(); };
checkAuthentication();
fetchOrdersData();
fetchUserData();
fetchDataResumeOrdersStatus();