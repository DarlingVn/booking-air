function toggleMenu() {
    const menu = document.querySelector('.navbar-menu');
    menu.classList.toggle('active');
}

$(document).ready(function() {
    showLoginForm();

    $('#register-btn').click(function(e) {
        e.preventDefault();
        showRegisterForm();
    });

    $('#login-btn').click(function(e) {
        e.preventDefault();
        showLoginForm();
    });

    $('#register-form').submit(function(e) {
        e.preventDefault();
        registerUser();
    });

    $('#login-form').submit(function(e) {
        e.preventDefault();
        loginUser();
    });

    $('#admin-login-btn').click(function(e) {
        e.preventDefault();
        loginAdmin();
    });

    $('#logout-btn').click(function(e) {
        e.preventDefault();
        logoutUser();
    });

    function showLoginForm() {
        $('#login-form').show();
        $('#register-form').hide();
        $('#error-message').text('').hide();
    }

    function showRegisterForm() {
        $('#login-form').hide();
        $('#register-form').show();
        $('#error-message').text('').hide();
    }

    function registerUser() {
        const username = $('#register-username').val();
        const email = $('#register-email').val();
        const phone = $('#register-phone').val();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();

        if (password !== confirmPassword) {
            $('#error-message').text('Mật khẩu và xác nhận mật khẩu không khớp').show();
            return;
        }
        const data = {
            username: username,
            email: email,
            phone: phone,
            password: password
        };
        $.ajax({
            url: 'http://localhost:3000/users',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function(response) {
                alert('Đăng ký thành công');
                showLoginForm();
                $('#register-form')[0].reset();
            },
            error: function(xhr, status, error) {
                $('#error-message').text('Đăng ký không thành công. Vui lòng thử lại sau.').show();
            }
        });
    }

    function loginUser() {
        const username = $('#login-username').val();
        const password = $('#login-password').val();
    
        $.ajax({
            url: `http://localhost:3000/users?username=${username}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(response) {
                if (response.length > 0) {
                    const user = response.find(user => user.password === password);
                    if (user) {
                        alert('Đăng nhập thành công');
                        $('#login-form')[0].reset();
                        localStorage.setItem('username', user.username);
                        localStorage.setItem('isAdmin', false);
                        localStorage.setItem("loggedInUser", username);
                        window.location.href = 'index.html';
                    } else {
                        $('#error-message').text('Tài khoản hoặc mật khẩu không chính xác').show();
                    }
                } else {
                    $('#error-message').text('Tài khoản hoặc mật khẩu không chính xác').show();
                }
            },
            error: function(xhr, status, error) {
                $('#error-message').text('Đăng nhập không thành công. Vui lòng thử lại sau.').show();
            }
        });
    }

    function loginAdmin() {
        const username = $('#login-username').val();
        const password = $('#login-password').val();
    
        $.ajax({
            url: `http://localhost:3000/admin?username=${username}`,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(response) {
                if (response.length > 0) {
                    const admin = response.find(admin => admin.password === password);
                    if (admin) {
                        alert('Đăng nhập Quản trị viên thành công');
                        $('#login-form')[0].reset();
                        localStorage.setItem('username', admin.username);
                        localStorage.setItem('isAdmin', true);
                        localStorage.setItem("loggedInUser", username);
                        window.location.href = 'admin.html';
                    } else {
                        $('#error-message').text('Tài khoản hoặc mật khẩu Quản trị viên không chính xác').show();
                    }
                } else {
                    $('#error-message').text('Tài khoản hoặc mật khẩu Quản trị viên không chính xác').show();
                }
            },
            error: function(xhr, status, error) {
                $('#error-message').text('Đăng nhập không thành công. Vui lòng thử lại sau.').show();
            }
        });
    }

    function logoutUser() {
        $('#login-form').show();
        $('#register-form').hide();
        $('#logout-btn').hide();
        $('#error-message').text('').hide();
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin');
    }
});
