const getData = async () => {
  try {
    const results = await fetch("./assets/json/product-list.json");
    const data = await results.json();
    const products = data.responses[0][0]["params"]["recommendedProducts"];
    const categories = data.responses[0][0]["params"]["userCategories"];
    return { products , categories }
  } catch (err) {
    console.log(err);
  }
};

function generateTabElements({categories, products}) {
  const tabsElement = document.querySelector("[data-tabs]");
  categories.forEach((category,index) => {
    let tabElement = document.createElement("div");
    tabElement.classList.add("tabs__tab");
    if (index === 0) {
      tabElement.classList.add("tabs__tab--active");
      generateProducts(categories[0],products);
    }
    let linkText = category.includes(">") ? category.split(">")[1] : category ;
    tabElement.innerText = linkText;
    tabsElement.append(tabElement);
    
    
    const clickTab = function() {
      let prevElement = document.querySelector(".tabs__tab--active");
      prevElement.classList.remove("tabs__tab--active");
      this.classList.add("tabs__tab--active");

      if(!(this == prevElement)){
        generateProducts(this.innerText,products);
      }  
    }
    tabElement.addEventListener("click", clickTab );  
  });
}

function generateProducts (currentCategory, products) {
  const productsArray = Object.entries(products);
  const currentProducts = productsArray.filter((item) => {
    return item[0].includes(currentCategory);
  })
  generateProductElements(currentProducts[0][1]);
}

function generateProductElements(currentProducts) {
  const productListElement = document.querySelector("[data-products]");
  prevCardElements = document.querySelectorAll(".card");
  prevCardElements.forEach((cardElement) => {
    cardElement.remove();
  })

  currentProducts.forEach((product,index) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    if(index == currentProducts.length-1){
      cardElement.classList.add("card--last");
    }

    const cardHeaderElement = document.createElement("div");
    cardHeaderElement.classList.add("card__header");
    
    const imgElement = document.createElement("img");
    imgElement.loading = "lazy";
    imgElement.classList.add("card__img");
    imgElement.width = 500;
    imgElement.height = 500;
    imgElement.src = product.image;
    const nameElement = document.createElement("div");
    nameElement.classList.add("card__name");
    nameElement.innerText = product.name;

    cardHeaderElement.append(imgElement,nameElement);

    const cardFooterElement = document.createElement("div");
    cardFooterElement.classList.add("card__footer");

    const priceElement = document.createElement("div");
    priceElement.classList.add("card__price");
    priceElement.innerText = product.priceText;
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("card__button");
    buttonElement.innerText = "Sepete Ekle";
    buttonElement.addEventListener('click',function(){
      const popupElement = document.querySelector("[data-popup]");
      popupElement.classList.add("popup__active");

      setTimeout(function(){
         popupElement.classList.remove("popup__active"); 
        }, 3000);

    })

    let cargoElement = "";
    if(product.params.shippingFee === "FREE"){
      cargoElement = document.createElement("div");
      cargoElement.classList.add("card__cargo")
      const cargoImgElement = document.createElement("img");
      cargoImgElement.classList.add("card__cargo-img");
      cargoImgElement.src = "./assets/svg/cargo.svg";
      const cargoTextElement = document.createElement("span");
      cargoTextElement.classList.add("card__cargo-text");
      cargoTextElement.innerText = "Ücretsiz Kargo" 
      cargoElement.append(cargoImgElement,cargoTextElement);

    }

    cardFooterElement.append(priceElement,cargoElement,buttonElement);
    cardElement.append(cardHeaderElement,cardFooterElement);
    productListElement.append(cardElement);

  })

  slider(productListElement,currentProducts.length);

}

function slider(productListElement,productLength) {
  let prevButtonElement = document.querySelector("[data-button-prev]");
  let nextButtonElement = document.querySelector("[data-button-next]");
  console.log(productLength);

  productListElement.scrollLeft = 0;
  if (!prevButtonElement.classList.contains("products__button--disabled")){
    prevButtonElement.classList.add("products__button--disabled");
  }

  if (nextButtonElement.classList.contains("products__button--disabled")){
    nextButtonElement.classList.remove("products__button--disabled");
  }

  productsWidth = productLength*222;
  

  function sliderScrollLeft(){  
    productListElement.scrollLeft += 222;

    if(productListElement.scrollLeft){
      prevButtonElement.classList.remove("products__button--disabled");
    }

    if(productsWidth-productListElement.clientWidth-productListElement.scrollLeft < 220){
      nextButtonElement.classList.add("products__button--disabled");
    }
}


  function sliderScrollRight(){
    productListElement.scrollLeft -= 222;

    if(productListElement.scrollLeft == 0){
      prevButtonElement.classList.add("products__button--disabled");
    }

    if(nextButtonElement.classList.contains("products__button--disabled")){
      nextButtonElement.classList.remove("products__button--disabled");
    }
    
  }

  prevButtonElement.addEventListener("click",sliderScrollRight);
  nextButtonElement.addEventListener("click",sliderScrollLeft);

}

async function init() {
  const data = await getData();
  generateTabElements(data);
}

init();


