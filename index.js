const http = require('http'); 
const PORT = 3000; 

// Функция вычисления числа Пи методом Лейбница (Вариант 5)
function calculatePi() {
    let pi = 0;
    let sign = 1;
    const iterations = 1000000; // Количество циклов для точности в 5 знаков
    
    for (let i = 0; i < iterations; i++) {
        pi += sign / (2 * i + 1);
        sign = -sign;
    }
    
    return (pi * 4).toFixed(5); // Округляем до 5 знаков для 5-го варианта
}

const server = http.createServer((req, res) => { 
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); 
    
    const fio = "Гладкий Максим Вадимович"; 
    const group = "477"; 
    const piValue = calculatePi();
    
    res.end(`
        <h1>Информация о студенте (Вариант 5):</h1>
        <p><b>ФИО:</b> ${fio}</p>
        <p><b>Группа:</b> ${group}</p>
        <p><b>Число ПИ:</b> ${piValue}</p>
    `); 
});

server.listen(PORT, () => { 
    console.log(`Сервер запущен на http://localhost:${PORT}`); 
});

