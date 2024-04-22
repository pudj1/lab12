var connection = new signalR.HubConnectionBuilder().withUrl("/cryptoHub").build();
var previousPrices = {}; // Об'єкт для зберігання попередніх цін

// Очікуємо на успішне з'єднання перед намаганням відправити дані
connection.start().then(function () {
    // Ваш код для відправлення даних через SignalR тут
}).catch(function (err) {
    return console.error(err.toString());
});

// Модифікуємо логіку підключення до WebSocket API
var ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,monero,litecoin");

ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    for (var key in data) {
        var name = key;
        var price = parseFloat(data[key]); // Парсимо ціну як числове значення
        var previousPrice = previousPrices[name] || 0; // Отримуємо попередню ціну або 0, якщо немає попередньої ціни
        if (previousPrice == 0)
            var diff = ""; // Обчислюємо різницю між новою та попередньою ціною
        else
            var diff = price - previousPrice;
        previousPrices[name] = price; // Оновлюємо попередню ціну

        // Форматуємо рядок для відображення різниці
        var diffString = (diff > 0 ? "+" : "") + diff.toFixed(2); // Додаємо "+" для позитивних значень
        price = price + "$ " + diffString;
        connection.invoke("GetCryptos", name, price).catch(function (err) {
            return console.error(err.toString());
        });
    }
};

// У звичайній функції, яка отримує дані, викликаємо функцію на клієнті
connection.on("GetCryptos", function (name, price) {
    var element = document.getElementById(name);
    if (element) {
        element.textContent = name + " is " + price + "$";
    }
});
