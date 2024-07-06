$(document).ready(function() {
    function toggleMenu() {
        const menu = document.querySelector('.navbar-menu');
        menu.classList.toggle('active');
    }
    
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    const apiUrl = 'http://localhost:3000/tickets';

    function fetchTickets() {
        $.get(apiUrl, function(tickets) {
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
            const row = `
                <tr data-id="${ticket.id}">
                    <td>${ticket.from}</td>
                    <td>${ticket.to}</td>
                    <td>${ticket.departureDate}</td>
                    <td>${ticket.departureTime}</td>
                    <td>${ticket.ticketClass}</td>
                    <td>${ticket.tripType}</td>
                    <td>${ticket.returnDate || ''}</td>
                    <td>${ticket.airline}</td>
                    <td>${formattedPrice}</td>
                    <td>
                        <button class="edit-btn">Sửa</button>
                        <button class="delete-btn">Xóa</button>
                    </td>
                </tr>
            `;
            ticketList.append(row);
        });
    }    

    function saveTicket(ticket) {
        const method = ticket.id ? 'PUT' : 'POST';
        const url = ticket.id ? `${apiUrl}/${ticket.id}` : apiUrl;
        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(ticket),
            success: function() {
                $('#ticket-form')[0].reset();
                $('#return-date-group').hide();
                fetchTickets();
            },
            error: function() {
                console.error('Lỗi khi lưu vé');
            }
        });
    }

    function deleteTicket(ticketId) {
        if (confirm("Bạn có chắc muốn xóa vé không?")) {
            $.ajax({
                url: `${apiUrl}/${ticketId}`,
                method: 'DELETE',
                success: function() {
                    fetchTickets();
                },
                error: function() {
                    console.error('Lỗi khi xóa vé');
                }
            });
        }
    }

    function editTicket(ticketId) {
        if (confirm("Bạn có chắc muốn sửa vé không?")) {
            $.get(`${apiUrl}/${ticketId}`, function(ticket) {
                $('#ticket-id').val(ticket.id);
                $('#from').val(ticket.from);
                $('#to').val(ticket.to);
                $('#departure-date').val(ticket.departureDate);
                $('#departure-time').val(ticket.departureTime);
                $('#ticket-class').val(ticket.ticketClass);
                $('#trip-type').val(ticket.tripType);
                $('#ticket-price').val(ticket.price);
                $('#airline').val(ticket.airline);
                if (ticket.tripType === 'Khứ hồi') {
                    $('#return-date-group').show();
                    $('#return-date').val(ticket.returnDate);
                } else {
                    $('#return-date-group').hide();
                    $('#return-date').val('');
                }
            }).fail(function() {
                console.error('Lỗi khi tải vé');
            });
        }
    }

    $('#ticket-form').on('submit', function(event) {
        event.preventDefault();
        const ticket = {
            from: $('#from').val(),
            to: $('#to').val(),
            departureDate: $('#departure-date').val(),
            departureTime: $('#departure-time').val(),
            ticketClass: $('#ticket-class').val(),
            tripType: $('#trip-type').val(),
            returnDate: $('#return-date').val() || null,
            price: $('#ticket-price').val() || null,
            airline: $('#airline').val()
        };
        const ticketId = $('#ticket-id').val();
        if (ticketId) {
            ticket.id = ticketId;
        }
        saveTicket(ticket);
    });

    $('#ticket-list').on('click', '.edit-btn', function() {
        const ticketId = $(this).closest('tr').data('id');
        editTicket(ticketId);
    });

    $('#ticket-list').on('click', '.delete-btn', function() {
        const ticketId = $(this).closest('tr').data('id');
        deleteTicket(ticketId);
    });

    $('#trip-type').on('change', function() {
        if ($(this).val() === 'Khứ hồi') {
            $('#return-date-group').show();
        } else {
            $('#return-date-group').hide();
            $('#return-date').val('');
        }
    });

    fetchTickets();
});
