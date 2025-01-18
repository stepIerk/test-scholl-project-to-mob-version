"use strict"



let productCartId = 1;

const productsDataBase = [
    {
        id: 9785091122572,
        name: "Учебник по Алгебре 10 класс",
        price: 1500,
        info: "Мерзляк, углуб. уровень",
        image: "ProductsImg/algebraMerzlyakTestImg.png",
        weighing: false,
    },
    {
        id: 9785091094749,
        name: "Учебник по истории России 10 класс",
        price: 1200,
        info: "Мединский, Торкунов",
        image: "ProductsImg/istoriaMedinskyTestImg.png",
        weighing: false,
    },
    {
        id: 9785090875400,
        name: "Учебник по общаге",
        price: 1040,
        info: "Учебное пособие",
        image: "ProductsImg/obshBookTestImg.png",
        weighing: false,
    },
];

// user story:
// 1. add new product to pre list
// 2. delete product from pre list

document.addEventListener("DOMContentLoaded", startApp);


function startApp(){
    document.getElementById("scanButton").addEventListener("click", startScanner)

}

let productCart = [];
let totalPrice = 0;

function startScanner() {
    toggleDiv("scanner")
    blurBackgroundAtScan();
    let w = window.innerWidth;
    let h = window.innerHeight;
    let vSize = Math.min(w,h) * 0.8;
    Quagga.init(
        {   
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector("#scanner-container"),
                constraints: {
                    width: vSize,
                    height: vSize,
                    facingMode: "environment",
                },
            },
            decoder: {
                readers: [
                    "code_128_reader",
                    "ean_reader",
                    "ean_8_reader",
                    "code_39_reader",
                    "code_39_vin_reader",
                    "codabar_reader",
                    "upc_reader",
                    "upc_e_reader",
                    "i2of5_reader"
                ],
            debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true,
                    },
                },
            },
        },
        function (err) {
            if (err) {
                console.log(err);
                stopScaner();
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start()
        });
    Quagga.onDetected(function (result) {
        
        let barcode = result.codeResult.code;
        if (findProductIdInDatabase(barcode)) {
            console.log(barcode);
            stopScaner();
            scanProducts(barcode);

            Quagga.stop()
            return;
            
        }
        return;
        
    });
};


function stopScaner() {
    Quagga.stop();
    toggleDiv("scanner");
    unblurBackgroundAtScan();
}

function toggleDiv(id) {
    var div = document.getElementById(id);
    div.style.display = div.style.display == "none" ? "block" : "none";
}

function blurBackgroundAtScan() {
    let background = document.getElementById("shopCart");
    background.style.filter = "blur(3px)";
}

function unblurBackgroundAtScan() {
    let background = document.getElementById("shopCart");
    background.style.filter = "blur(0px)";
}

function findProductIdInDatabase(barcode){
    let product = productsDataBase.find(product => product.id == barcode);
    return product;
}

function scanProducts(barcode){
    let product = getProductInCartByBarcode(barcode);
    console.log(product);
    pushToCard(product);
}


function pushToCard(product){
    productCart.push(product);
    totalPrice += product.price;
    displayTotalPrice(totalPrice);
    addProductToDisplay(product);
}

function displayTotalPrice(totalPrice) {
    document.getElementById("totalPrice").innerHTML = "Итого: ₽ " + totalPrice;
}

function addProductToDisplay(productInCart){
    const productList = document.getElementById("productList")
    productList.innerHTML = `
        <div class="container" data-id="${productInCart.id}" onclick="removeProductFromCart(this)">
            <img src="${productInCart.product.image}" class="product-image" align="left"">
            <a class="product-name">${productInCart.product.name}</a>
            <a class="product-weight">${productInCart.volume} ${productInCart.unit}</a>
            <a class="product-price">${productInCart.price}₽</a>
        </div>
    ` + productList.innerHTML;
}

function removeProductFromCart(element){
        console.log(element);
        if(confirm("Вы дейсвительно хотите удалить товар?")){
        let productId = element.getAttribute("data-id");
        let productInCart = productCart.find(product => product.id == productId);
        totalPrice -= productInCart.price;
        displayTotalPrice(totalPrice);
        element.remove();
    }
}

function increaseQuantity(element, quantity){
    let productId = element.getAttribute("data-id");
    let productInCart = productCart.find(product => product.id == productId);
    productInCart.volume += quantity;
    let productPriceToChange = productInCart.price * quantity;
    productInCart.price += productPriceToChange;
    totalPrice += productPriceToChange;
    displayTotalPrice(totalPrice);
    element.innerHTML = productInCart.volume;
    // addProductToDisplay(productInCart);
}

function getProductInCartByBarcode(barcode){
    const productData = productsDataBase[productsDataBase.findIndex(prod => prod.id == barcode)];
    let volume
    if (productData.weighing){
        volume = prompt("Введите вес товара в кг");
        productData.unit = "кг";
    } else{
        volume = 1;
        productData.unit = "шт";
    }
    return {
        "id" : productCartId++,
        "product": productData,
        "volume" : volume,
        "price" : productData.price * volume,
        "unit" : productData.unit,
    };
}

function scanBarcode(){
    
}

function goToPayPage() { 
    if (window.confirm('Убедитесь, отсканировали ли вы все товары?'))
    { 
      window.location.href = 'https://id.tbank.ru/auth/step?cid=ar61hMDUoTvR';
    }
   }

   
