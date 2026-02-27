//
// К сожелению, я еще не особо шарю в JavaScript и в этой работе этот файл писал не я, а ИИ
// Unfortunately, I’m not very good at JavaScript yet, and in this work this file was written not by me, but by AI
//

// Функция для плавного счета (быстро в начале, медленно в конце)
function плавныйСчет(element, целевоеЗначение, длительность = 3000) {
    // element - это HTML элемент, в который будем писать число
    // целевоеЗначение - до скольки считать (например, 17)
    // длительность - сколько миллисекунд будет длиться анимация (3000 = 3 секунды)

    const старт = performance.now(); // Запоминаем время старта
    const стартовоеЗначение = 0; // Всегда начинаем с 0

    function обновление(текущееВремя) {
        // сколько времени прошло с начала анимации
        const прошедше = текущееВремя - старт;

        // прогресс от 0 до 1 (0 = начало, 1 = конец)
        const прогресс = Math.min(прошедше / длительность, 1);

        // ГЛАВНАЯ ФОРМУЛА: быстро в начале, медленно в конце
        // progress * (2 - progress) дает плавное замедление
        const замедление = прогресс * (2 - прогресс);

        // текущее значение (например: 0 * 17 = 0 ... 1 * 17 = 17)
        const текущее = Math.floor(стартовоеЗначение + (целевоеЗначение - стартовоеЗначение) * замедление);

        // Записываем число в элемент
        element.textContent = текущее;

        // Если еще не дошли до конца - продолжаем анимацию
        if (прогресс < 1) {
            requestAnimationFrame(обновление); // просим браузер обновить на следующем кадре
        } else {
            // В самом конце ставим точное значение (на случай ошибок округления)
            element.textContent = целевоеЗначение;
        }
    }

    // Запускаем анимацию
    requestAnimationFrame(обновление);
}

// Функция получения реального онлайна с сервера
async function getOnline() {
    try {
        // Запрос к API для получения информации о сервере
        const response = await fetch('https://api.mcsrvstat.us/3/213.171.18.148:30014');
        const data = await response.json();

        // Находим ВСЕ элементы с классом online2 (их у тебя 3 штуки)
        const allNumbers = document.querySelectorAll('.online2');

        if (data.online) {
            // Сервер онлайн - получаем количество игроков
            const onlineCount = data.players?.online || 0;

            // Обновляем ПЕРВЫЙ блок (Сейчас Х онлайн)
            if (allNumbers[0]) {
                allNumbers[0].textContent = '0'; // Сначала ставим 0
                // Запускаем плавный счет до onlineCount за 3 секунды
                плавныйСчет(allNumbers[0], onlineCount, 3000);
            }

            console.log(`Сервер онлайн: ${onlineCount} игроков`);
        } else {
            // Сервер оффлайн - показываем 0
            if (allNumbers[0]) {
                allNumbers[0].textContent = '0';
            }
        }
    } catch (error) {
        console.error('Ошибка получения онлайна:', error);
        // В случае ошибки показываем 0
        const allNumbers = document.querySelectorAll('.online2');
        if (allNumbers[0]) {
            allNumbers[0].textContent = '0';
        }
    }
}

// Ждем полной загрузки страницы
window.addEventListener('load', () => {
    console.log('Страница загружена, запускаем счетчики...');

    // Находим все элементы с числами
    const allNumbers = document.querySelectorAll('.online2');

    // Устанавливаем всем 0 в начале
    allNumbers.forEach(num => num.textContent = '0');

    // Запускаем получение реального онлайна (для первого блока)
    getOnline();

    // Для второго блока (8 активных игроков)
    if (allNumbers[1]) {
        setTimeout(() => {
            плавныйСчет(allNumbers[1], 8, 2500); // Считаем до 8 за 2.5 секунды
        }, 500); // Задержка 0.5 секунды
    }

    // Для третьего блока (50 зарегистрированных)
    if (allNumbers[2]) {
        setTimeout(() => {
            плавныйСчет(allNumbers[2], 50, 2500); // Считаем до 50 за 2.5 секунды
        }, 800); // Задержка 0.8 секунды
    }
});

// Обновляем реальный онлайн каждые 30 секунд
setInterval(() => {
    console.log('Обновление онлайна...');
    const allNumbers = document.querySelectorAll('.online2');
    if (allNumbers[0]) {
        allNumbers[0].textContent = '0'; // Сбрасываем на 0
        getOnline(); // Получаем новый онлайн
    }
}, 30000);