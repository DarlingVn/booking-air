document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userInfo = document.getElementById('user-info');
    const loginLink = document.getElementById('login-link');
    const adminPageBtn = document.getElementById('admin-page-btn');
    const bookingLink = document.getElementById('booking-link');

    if (username) {
        loginLink.textContent = `Chào, ${username} 😍`;
        loginLink.href = 'account.html';
        userInfo.innerHTML += '<button id="logout-btn" class="btn btn-danger">Đăng Xuất 🥲</button>';

        if (isAdmin) {
            adminPageBtn.style.display = 'block';
        }

        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm("Bạn có chắc muốn đăng xuất không?")) {
                localStorage.removeItem('username');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            }
        });
    }

    bookingLink.addEventListener('click', function(event) {
        event.preventDefault();
        if (!username) {
            alert('Bạn phải đăng nhập tài khoản để đặt vé.');
            window.location.href = 'login.html';
        } else {
            window.location.href = 'booking.html';
        }
    });
});
