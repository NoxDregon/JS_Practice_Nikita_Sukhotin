let map;
let placemark = null;
let selectedCoords = null;

ymaps.ready(() => {
    map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
    });

    map.events.add('click', function (e) {
        const coords = e.get('coords');
        selectedCoords = coords;

        if (placemark) {
            map.geoObjects.remove(placemark);
        }

        placemark = new ymaps.Placemark(coords, {
            balloonContent: `Координаты:<br>${coords[0].toFixed(5)}, ${coords[1].toFixed(5)}`
        });

        map.geoObjects.add(placemark);
        placemark.balloon.open();
    });
});

document.getElementById('submitBtn').addEventListener('click', () => {
    const fio = document.getElementById('fio').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const comment = document.getElementById('comment').value.trim();
    const result = document.getElementById('result');

    let errors = [];

    if (!fio) {
        errors.push("Не заполнено поле ФИО");
    }

    if (!phone) {
        errors.push("Не заполнено поле Телефон");
    } else if (!/^\d+$/.test(phone)) {
        errors.push("Телефон должен содержать только цифры");
    }

    if (!email.includes('@')) {
        errors.push("Email должен содержать @");
    }

    if (!selectedCoords) {
        errors.push("Не выбран адрес доставки");
    }

    if (comment.length > 500) {
        errors.push("Комментарий превышает 500 символов");
    }

    if (errors.length > 0) {
        result.className = "error";
        result.innerHTML = errors.join("<br>");
    } else {
        result.className = "success";
        result.innerHTML = "Заказ оформлен!";
    }
});