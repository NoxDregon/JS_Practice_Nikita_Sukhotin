const API_URL = "http://exercise.develop.maximaster.ru/service/products/";

let data = [];

async function loadData() {
    try {
        const response = await fetch(API_URL);
        data = await response.json();
        renderTable(data);
    } catch (e) {
        data = [
            {"price":9986,"quantity":3,"name":"Телевизор ЖК"},
            {"price":13460,"quantity":5,"name":"Бумага туалетная"},
            {"price":14328,"quantity":5,"name":"Стол компьютерный"},
            {"price":13460,"quantity":5,"name":"Лазерный принтер"},
            {"price":15197,"quantity":6,"name":"Дверь межкомнатная"},
            {"price":8684,"quantity":3,"name":"Светильник"},
            {"price":16934,"quantity":6,"name":"Чайник электрический"},
            {"price":11723,"quantity":4,"name":"Системный блок"},
            {"price":8684,"quantity":3,"name":"Монитор 22″"},
            {"price":9986,"quantity":3,"name":"Шкаф книжный"},
            {"price":15631,"quantity":6,"name":"Бумага для принтера"},
            {"price":12592,"quantity":5,"name":"Маркеры офисные"},
            {"price":16065,"quantity":6,"name":"Вода бутилированная"}
        ];
        renderTable(data);
        showMessage("Загружены локальные данные (сервер недоступен)");
    }
}

function renderTable(items) {
    const container = document.getElementById("tableContainer");
    const message = document.getElementById("message");

    container.innerHTML = "";
    message.innerHTML = "";

    if (items.length === 0) {
        showMessage("Нет данных, попадающих под условие фильтра");
        return;
    }

    let table = `
        <table>
            <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Количество</th>
                <th>Цена за единицу</th>
                <th>Сумма</th>
            </tr>
    `;

    items.forEach((item, index) => {
        const sum = item.price * item.quantity;

        table += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${sum}</td>
            </tr>
        `;
    });

    table += "</table>";
    container.innerHTML = table;
}

function applyFilter() {
    const from = Number(document.getElementById("priceFrom").value);
    const to = Number(document.getElementById("priceTo").value);

    if (from < 0 || to < 0 || from > to) {
        showMessage("Ошибка ввода фильтра");
        return;
    }

    if (from === 0 && to === 0) {
        renderTable(data);
        return;
    }

    const filtered = data.filter(item =>
        item.price >= from && item.price <= to
    );

    renderTable(filtered);
}

function showMessage(text) {
    document.getElementById("message").innerText = text;
    document.getElementById("tableContainer").innerHTML = "";
}

document.getElementById("updateBtn").addEventListener("click", applyFilter);

loadData();