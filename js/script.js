// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const productsGrid = document.getElementById('products-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeModal = document.getElementById('close-modal');
    const overlay = document.getElementById('overlay');
    const checkoutForm = document.getElementById('checkout-form');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Inicializar a página
    renderProducts(produtos);
    updateCart();
    
    // Renderizar produtos
    function renderProducts(products) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-brand', product.marca);
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.imagem}" alt="${product.nome}">
                </div>
                <div class="product-info">
                    <span class="product-brand">${product.marca}</span>
                    <h3>${product.nome}</h3>
                    <p class="product-description">${product.descricao}</p>
                    <div class="product-price">R$ ${product.preco.toFixed(2)}</div>
                    <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Adicionar eventos aos botões de adicionar ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }
    
    // Adicionar produto ao carrinho
    function addToCart(productId) {
        const product = produtos.find(p => p.id === productId);
        
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification('Produto adicionado ao carrinho!');
        }
    }
    
    // Atualizar carrinho
    function updateCart() {
        // Salvar carrinho no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Atualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Atualizar itens do carrinho
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            cartTotalPrice.textContent = '0.00';
            return;
        }
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.preco * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.nome}</h4>
                    <div class="cart-item-price">R$ ${item.preco.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Atualizar preço total
        cartTotalPrice.textContent = totalPrice.toFixed(2);
        
        // Adicionar eventos aos botões de quantidade
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                decreaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                increaseQuantity(productId);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromCart(productId);
            });
        });
    }
    
    // Diminuir quantidade
    function decreaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== productId);
            }
            
            updateCart();
        }
    }
    
    // Aumentar quantidade
    function increaseQuantity(productId) {
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            item.quantity += 1;
            updateCart();
        }
    }
    
    // Remover do carrinho
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }
    
    // Mostrar notificação
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: var(--radius);
            z-index: 3000;
            box-shadow: var(--shadow);
            transform: translateX(100%);
            transition: transform 0.3s;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Filtrar produtos por marca
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar produtos
            if (filter === 'all') {
                renderProducts(produtos);
            } else {
                const filteredProducts = produtos.filter(product => product.marca === filter);
                renderProducts(filteredProducts);
            }
        });
    });
    
    // Pesquisar produtos
    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Se a pesquisa estiver vazia, mostrar todos os produtos
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            
            if (activeFilter === 'all') {
                renderProducts(produtos);
            } else {
                const filteredProducts = produtos.filter(product => product.marca === activeFilter);
                renderProducts(filteredProducts);
            }
            
            return;
        }
        
        const searchResults = produtos.filter(product => 
            product.nome.toLowerCase().includes(searchTerm) || 
            product.marca.toLowerCase().includes(searchTerm) ||
            product.descricao.toLowerCase().includes(searchTerm)
        );
        
        renderProducts(searchResults);
    }
    
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // Abrir/fechar carrinho
    cartIcon.addEventListener('click', function() {
        cartSidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Abrir modal de checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Seu carrinho está vazio!');
            return;
        }
        
        checkoutModal.classList.add('active');
        overlay.classList.add('active');
        cartSidebar.classList.remove('active');
    });
    
    // Fechar modal
    closeModal.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Fechar ao clicar no overlay
    overlay.addEventListener('click', function() {
        cartSidebar.classList.remove('active');
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });
    
    // Preencher CEP automaticamente
    const cepInput = document.getElementById('client-cep');
    const cityInput = document.getElementById('client-city');
    const streetInput = document.getElementById('client-street');
    const neighborhoodInput = document.getElementById('client-neighborhood');
    
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        cityInput.value = data.localidade;
                        streetInput.value = data.logradouro;
                        neighborhoodInput.value = data.bairro;
                    } else {
                        showNotification('CEP não encontrado!');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar CEP:', error);
                    showNotification('Erro ao buscar CEP. Tente novamente.');
                });
        }
    });
    
    // Enviar pedido para WhatsApp
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const clientName = document.getElementById('client-name').value;
        const clientPhone = document.getElementById('client-phone').value;
        const clientCEP = document.getElementById('client-cep').value;
        const clientCity = document.getElementById('client-city').value;
        const clientStreet = document.getElementById('client-street').value;
        const clientNumber = document.getElementById('client-number').value;
        const clientNeighborhood = document.getElementById('client-neighborhood').value;
        const paymentMethod = document.getElementById('payment-method').value;
        
        // Validar dados
        if (!clientName || !clientPhone || !clientCEP || !clientCity || !clientStreet || !clientNumber || !clientNeighborhood || !paymentMethod) {
            showNotification('Por favor, preencha todos os campos!');
            return;
        }
        
        // Formatar mensagem para WhatsApp
        let message = `Olá, venho do site meninacheirosa.vercel.app quero finalizar minha compra\n`;
        message += `============================\n`;
        message += `ENDEREÇO:\n`;
        message += `Nome do cliente: ${clientName}\n`;
        message += `Telefone: ${clientPhone}\n`;
        message += `Cidade: ${clientCity}\n`;
        message += `Rua: ${clientStreet}\n`;
        message += `Número da casa: ${clientNumber}\n`;
        message += `Bairro: ${clientNeighborhood}\n`;
        message += `Forma de pagamento: ${paymentMethod}\n`;
        message += `============================\n`;
        message += `PRODUTOS\n`;
        
        let total = 0;
        cart.forEach(item => {
            const itemTotal = item.preco * item.quantity;
            total += itemTotal;
            
            message += `Id do produto: ${item.id}\n`;
            message += `Nome do produto: ${item.nome}\n`;
            message += `Descrição do produto: ${item.descricao}\n`;
            message += `Preço: R$ ${item.preco.toFixed(2)}\n`;
            message += `Quantidade: ${item.quantity}\n`;
            message += `------------------------\n`;
        });
        
        message += `============================\n`;
        message += `TOTAL: R$ ${total.toFixed(2)}`;
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Número de WhatsApp (substitua pelo número real)
        const whatsappNumber = '5584996002433';
        
        // Abrir WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        
        // Limpar carrinho e fechar modal
        cart = [];
        updateCart();
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
        checkoutForm.reset();
        
        showNotification('Pedido enviado com sucesso!');
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});