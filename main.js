let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submite = document.getElementById("submite");

let proData;
let temp;
let mood = "create";
let searchMood;

if (localStorage.product != null) {
  proData = JSON.parse(localStorage.product);
} else {
  proData = [];
}

submite.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  if (
    price.value != "" &&
    title.value != "" &&
    category.value != "" &&
    newPro.count < 100
  ) {
    if (mood === "create") {
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          proData.push(newPro);
        }
      } else {
        proData.push(newPro);
      }
    } else {
      proData[temp] = newPro;
      mood = "create";
      submite.innerHTML = "Create";
      count.style.display = "block";
    }

    localStorage.setItem("product", JSON.stringify(proData));
    clearData();
    showData();
  } else {
    Swal.fire("Product data is incomplete!");
  }
};

function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
}

const createTableRow = (product, i) => `  
  <tr>  
    <td>${i + 1}</td>  
    <td>${product.title}</td>  
    <td>${product.price}</td>  
    <td>${product.taxes}</td>  
    <td>${product.ads}</td>  
    <td>${product.discount}</td>  
    <td>${product.total}</td>  
    <td>${product.category}</td>  
    <td><button onclick="updateValue(${i})">Update</button></td>  
    <td><button onclick="deletePro(${i})">Delete</button></td>  
  </tr>  

`;

function showData() {
  getTotal();
  const tableContent = proData
    .map((product, i) => createTableRow(product, i))
    .join("");

  document.getElementById("tbody").innerHTML = tableContent;

  let deleteAll = document.getElementById("deleteAll");
  if (proData.length > 0) {
    deleteAll.innerHTML = `<button  onclick=delAll()>Delete All(${proData.length})</button>`;
  } else {
    deleteAll.innerHTML = "";
  }
}
showData();

function deletePro(i) {
  proData.splice(i, 1);
  localStorage.product = JSON.stringify(proData);
  showData();
}

function delAll() {
  localStorage.clear();
  proData.splice(0);
  showData();
}

function updateValue(i) {
  title.value = proData[i].title;
  price.value = proData[i].price;
  taxes.value = proData[i].taxes;
  ads.value = proData[i].ads;
  discount.value = proData[i].discount;
  getTotal();
  category.value = proData[i].category;
  mood = "update";
  count.style.display = "none";
  submite.innerHTML = "Update";
  temp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

function getTotal() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.background = "#6d9b00";
  } else {
    total.style.background = "#940303";
    total.innerHTML = "";
  }
}

function getsearchMood(id) {
  search = document.getElementById("search");
  if (id === "btnTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = `search by ${searchMood} `;
  search.focus();
  search.value = "";
  showData();
}

function searchOperation(value) {
  const filteredData = proData.filter((product) =>
    product[searchMood].includes(value.toLowerCase())
  );
  document.getElementById("tbody").innerHTML = filteredData
    .map((product, i) => createTableRow(product, i))
    .join("");
}
