function toggleMenu() {
    const menu = document.querySelector('.navbar-menu');
    menu.classList.toggle('active');
}

$(document).ready(function() {
    const loggedInUser = localStorage.getItem("loggedInUser");
    console.log("Logged in user:", loggedInUser);

    if (!loggedInUser) {
        alert("Vui lòng đăng nhập để xem vé đã đặt.");
        window.location.href = "login.html";
        return;
    }

    $.ajax({
        url: "http://localhost:3000/booking",
        method: "GET",
        success: function(data) {
            console.log("Booking data:", data);
            const userBookings = data.filter(booking => booking.username === loggedInUser);
            console.log("User bookings:", userBookings);
            displayBookings(userBookings);
        },
        error: function(xhr, status, error) {
            console.error("Error loading booking data:", status, error);
            alert("Không thể tải dữ liệu vé máy bay.");
        }
    });
});

function displayBookings(bookings) {
    const container = $("#tickets-container");
    container.empty();

    if (bookings.length === 0) {
        container.append("<p>Bạn chưa đặt vé nào.</p>");
        return;
    }

    bookings.forEach(booking => {
        const formattedPrice = Number(booking.price || 0).toLocaleString('vi-VN');
        const bookingElement = `
            <br>
            <div class="ticket">
                <p><strong>Chuyến bay:</strong> ${booking.from} - ${booking.to}</p>
                <p><strong>Ngày bay:</strong> ${booking.departureDate} - <strong>Giờ bay:</strong> ${booking.departureTime}</p>
                <p><strong>Hạng vé:</strong> ${booking.ticketClass} - <strong>Loại vé:</strong> ${booking.tripType}</p>
                <p><strong>Hãng bay:</strong> ${booking.airline}</p>
                <p><strong>Giá vé:</strong> ${formattedPrice} VND</p>
                <button class="delete-button" onclick="deleteBooking('${booking.id}')">Xóa vé</button>
            </div>
        `;
        container.append(bookingElement);
    });
}

function deleteBooking(bookingId) {
    if (confirm("Bạn có chắc muốn xóa vé này không?")) {
        $.ajax({
            url: `http://localhost:3000/booking/${bookingId}`,
            method: "DELETE",
            success: function(response) {
                console.log("Booking deleted:", response);
                refreshBookings();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting booking:", status, error);
                alert("Không thể xóa vé máy bay.");
            }
        });
    }
}

function refreshBookings() {
    $.ajax({
        url: "http://localhost:3000/booking",
        method: "GET",
        success: function(data) {
            console.log("Booking data:", data);
            const userBookings = data.filter(booking => booking.username === loggedInUser);
            console.log("User bookings:", userBookings);
            displayBookings(userBookings);
        },
        error: function(xhr, status, error) {
            console.error("Error loading booking data:", status, error);
            alert("Không thể tải dữ liệu vé máy bay.");
        }
    });
}
