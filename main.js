const table = document.querySelector('.table');
const rows = table.getElementsByTagName('tr');

function createTable(item) {

    // Create a table row for the product information
    const tableRow = document.createElement('tr');
    tableRow.className = 'tableItem';

    // Create table data cells with specified widths
    const id = document.createElement('td');
    id.style.width = '7%';
    id.textContent = item.id;

    const name = document.createElement('td');
    name.style.width = '12.5%';
    name.textContent = item.name;

    const price = document.createElement('td');
    price.style.width = '10%';
    price.textContent = item.newPrice + "đ";

    const type = document.createElement('td');
    type.style.width = '10%';
    type.textContent = item.type

    const sale = document.createElement('td');
    sale.style.width = '10%';
    sale.textContent = item.sale;

    const image = document.createElement('td');
    image.style.width = '12.5%';
    const imageElement = document.createElement('img');
    imageElement.id = 'imagePlant';
    imageElement.src = item.imageUrl;
    image.appendChild(imageElement);

    const description = document.createElement('td');
    description.style.width = '25.5%';
    description.textContent = item.description;

    const update = document.createElement('td');
    update.style.width = '6.16%';
    const btnUpdate = document.createElement('button');
    btnUpdate.textContent = 'Update';
    update.appendChild(btnUpdate);

    const del = document.createElement('td');
    del.style.width = '6.16%';
    const btnDel = document.createElement('button');
    btnDel.textContent = 'Delete';
    del.appendChild(btnDel);

    // Append all the cells to the table row
    tableRow.appendChild(id);
    tableRow.appendChild(name);
    tableRow.appendChild(price);
    tableRow.appendChild(type);
    tableRow.appendChild(sale);
    tableRow.appendChild(image);
    tableRow.appendChild(description);
    tableRow.appendChild(update);
    tableRow.appendChild(del);

    return tableRow;
}

// function fetchPlantData() {
//     fetch('http://localhost:8080/plant/list', {
//         method: "GET",
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//             let length = rows.length;
//             while (length > 0) {
//                 rows[length - 1].remove();
//                 length--;
//             }
//             data.forEach(item => {
//                 const productDiv = createTable(item);
//                 table.appendChild(productDiv);
//             });
//         })
//         .catch(error => {
//             console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
//         });
// }

function fetchPlantData() {
    axios.get('http://localhost:8080/plant/list')
        .then(response => {
            const data = response.data.data;
            let length = rows.length;
            while (length > 0) {
                rows[length - 1].remove();
                length--;
            }
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const productDiv = createTable(item);
                    table.appendChild(productDiv);
                });
            } else {
                console.error('Response data is not an array');
            }
        })
        .catch(error => {
            console.error('Error loading plant data:', error);
        });
}

fetchPlantData();

// selecting required element
const element = document.querySelector(".pagination ul");
let totalPages = 6;
let page = 1;

//calling function with passing parameters and adding inside element which is ul tag
element.innerHTML = createPagination(totalPages, page);
function createPagination(totalPages, page) {
    let liTag = '';
    let active;
    let beforePage = page - 1;
    let afterPage = page + 1;
    if (page > 1) { //show the next button if the page value is greater than 1
        liTag += `<li class="btn prev" onclick="createPagination(totalPages, ${page - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    if (page > 2) { //if page value is less than 2 then add 1 after the previous button
        liTag += `<li class="first numb" onclick="createPagination(totalPages, 1)"><span>1</span></li>`;
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
        liTag += `<li class="numb ${active}" onclick="createPagination(totalPages, ${plength})"><span>${plength}</span></li>`;
    }

    if (totalPages > 6) {
        if (page < totalPages - 1) { //if page value is less than totalPage value by -1 then show the last li or page
            if (page < totalPages - 2) { //if page value is less than totalPage value by -2 then add this (...) before the last li or page
                liTag += `<li class="dots"><span>...</span></li>`;
            }
            liTag += `<li class="last numb" onclick="createPagination(totalPages, ${totalPages})"><span>${totalPages}</span></li>`;
        }
    }

    if (page < totalPages) { //show the next button if the page value is less than totalPage(20)
        liTag += `<li class="btn next" onclick="createPagination(totalPages, ${page + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
    element.innerHTML = liTag; //add li tag inside ul tag
    return liTag; //reurn the li tag
}