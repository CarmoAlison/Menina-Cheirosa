// admin.js
document.addEventListener('DOMContentLoaded', function() {
    const adminProductsTable = document.getElementById('admin-products-table');
    const adminSearchInput = document.getElementById('admin-search');
    const adminSearchBtn = document.getElementById('admin-search-btn');
    
    // Renderizar produtos na tabela
    renderAdminProducts(produtos);
    
    function renderAdminProducts(products) {
        adminProductsTable.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td class="product-image-cell">
                    <img src="${product.imagem}" alt="${product.nome}">
                </td>
                <td>${product.nome}</td>
                <td>${product.marca}</td>
                <td>${product.descricao}</td>
                <td>R$ ${product.preco.toFixed(2)}</td>
            `;
            
            adminProductsTable.appendChild(row);
        });
    }
    
    // Pesquisar produtos
    function searchAdminProducts() {
        const searchTerm = adminSearchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderAdminProducts(produtos);
            return;
        }
        
        const searchResults = produtos.filter(product => 
            product.id.toString().includes(searchTerm) || 
            product.nome.toLowerCase().includes(searchTerm) ||
            product.marca.toLowerCase().includes(searchTerm)
        );
        
        renderAdminProducts(searchResults);
    }
    
    adminSearchBtn.addEventListener('click', searchAdminProducts);
    adminSearchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchAdminProducts();
        }
    });
});