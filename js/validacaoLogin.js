window.document.getElementById('loginForm').addEventListener('submit', function(login) {
    login.preventDefault();

    const emailCpf = document.querySelector('#emailCpf').value;
    const password = document.querySelector('#password').value;
    const msgErro = document.querySelector('#msg-erro');

    const validEmailCpf = '12345678900';
    const validPassword = '12345678';

    if (emailCpf === validEmailCpf && password === validPassword) {
        window.location.href = 'principal.html';
    } else {
        msgErro.innerHTML = 'Email/CPF ou senha inválidos. Tente novamente!';
    }

})