// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Credenciais fixas
        if (username === 'Admin' && password === 'admin123') {
            // Redirecionar para a página de admin
            window.location.href = 'admin.html';
        } else {
            alert('Usuário ou senha incorretos! Tente novamente.');
        }
    });
});