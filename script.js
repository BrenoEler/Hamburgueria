const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkot-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const adressInput = document.getElementById("address")
const addressWarn = document.getElementById("addres-warn")

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex" //Troca hidden por flex, o que faz o texto oculto ser visivel.
    updateCartModal(); //Sempre atuliza o carrinho
})

//Fechar o modal quando clicar fora

cartModal.addEventListener("click", function(event){
    if(event.target=== cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn") 
    // Verifica se você clicou no item ou proximo do item
    //(.) procura uma classe.
    //(#) procura um id.

    if(parentButton){
      const  name = parentButton.getAttribute("data-name")
      const  price = parseFloat(parentButton.getAttribute("data-price"))

      //console.log() Verifica console log.

      //Adiconar ao carrinho.
      addToCart(name, price);
    }

})


//funcao para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){ 
     //Se o item ja existe, aumenta apenas a quantidade + 1 
     existingItem.quantity += 1;

    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    
   
    updateCartModal()
}

//Atualiza o carinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover 
                </button>


        </div>
        
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency", 
        currency: "BRL"
    });

    cartCounter.innerText = cart.length;



}

//Funcao para remover itens do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
       const name = event.target.getAttribute("data-name")
       
       removeItemsCart(name);
    }
})

function removeItemsCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1 ){ 
       const item = cart[index];
       if(item.quantity > 1){
        item.quantity -= 1;
        updateCartModal();
        return;
    }

    cart.splice(index, 1); 

    updateCartModal();
 }


} 

adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){ 
       adressInput.classList.remove("border-red-500")
       addressWarn.classList.add("hidden")
    }

     
})
// Finalizar pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({

            text: "Ops o restaurant esta fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if(cart.length === 0 ) return;
    if(adressInput.value === ""){
        addressWarn.classList.remove("hidden")
        adressInput.classList.add("border-red-500")
        return;
    }
    //Enviar para API do whats
    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${item.quantity})Preco: R$ ${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "27981235799"

    window.open(`https://wa.me/${phone}?text=${message} Endereco: ${adressInput.value}`, "_blank")

    cart = [];
    
    updateCartModal();

})

// verificar a hora e manipular o card do horario
function checkRestaurantOpen(){ 
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}
const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){ 
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{ 
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}




