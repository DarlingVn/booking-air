document.addEventListener('DOMContentLoaded', function() {
    const numberElement = document.getElementById('number-container');
    const number = Number(numberElement.textContent);
    numberElement.textContent = number.toLocaleString('vi-VN');
});
