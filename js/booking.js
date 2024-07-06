function toggleMenu() {
    const menu = document.querySelector('.navbar-menu');
    menu.classList.toggle('active');
}

$(document).ready(function() {
    const apiUrl = 'http://localhost:3000/tickets';

    function fetchTickets(queryParams) {
        $.get(apiUrl, queryParams, function(tickets) {
            renderTickets(tickets);
        }).fail(function() {
            console.error('Lỗi khi tải danh sách vé');
        });
    }

    function renderTickets(tickets) {
        const ticketList = $('#ticket-list');
        ticketList.empty();
        tickets.forEach(ticket => {
            const formattedPrice = Number(ticket.price || 0).toLocaleString('vi-VN');
            
            const ticketElement = `
                <div class="ticket">
                    <div>Điểm xuất phát: ${ticket.from} - Hãng: ${ticket.airline}</div>
                    <div>Điểm đến: ${ticket.to}</div>
                    <div>Ngày khởi hành: ${ticket.departureDate} - Giờ khởi hành: ${ticket.departureTime}</div>
                    <div>Loại vé: ${ticket.ticketClass} - ${ticket.tripType}</div>
                    <div id="money">${formattedPrice}</div>
                    <button class="book-ticket-btn" data-ticket-id="${ticket.id}">Đặt vé</button>
                </div>
            `;
            ticketList.append(ticketElement);
        });
    
        $('.book-ticket-btn').on('click', function() {
            const ticketId = $(this).data('ticket-id');
            const username = localStorage.getItem('username');
    
            if (username) {
                const selectedTicket = tickets.find(ticket => ticket.id === ticketId);
                if (selectedTicket) {
                    bookTicket(selectedTicket, username);
                } else {
                    console.error('Không tìm thấy vé để đặt.');
                }
            } else {
                alert('Bạn cần đăng nhập để đặt vé.');
                window.location.href = 'login.html';
            }
        });
    }
    
    function bookTicket(ticket, username) {
        const bookingData = {
            ...ticket,
            username: username
        };
    
        $.ajax({
            url: 'http://localhost:3000/booking',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(bookingData),
            success: function(response) {
                alert('Đặt vé thành công.');
            },
            error: function(xhr, status, error) {
                console.error('Lỗi khi đặt vé: ', error);
                alert('Đặt vé không thành công. Vui lòng thử lại sau.');
            }
        });
    }

    $('#search-form').on('submit', function(event) {
        event.preventDefault();
        const queryParams = {
            from: $('#search-from').val(),
            to: $('#search-to').val(),
            ticketClass: $('#search-ticket-class').val(),
            tripType: $('#search-trip-type').val()
        };
        fetchTickets(queryParams);
    });

    fetchTickets();
});
