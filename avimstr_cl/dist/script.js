document.addEventListener('DOMContentLoaded', () => {
    // Получаем ссылки на DOM-элементы
    const loadingScreen = document.getElementById('loading-screen');
    const startLoadingBtn = document.getElementById('start-loading-btn');
    const mainMenuScreen = document.getElementById('main-menu-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const languageBtnRus = document.getElementById('language-btn-rus');
    const languageBtnEng = document.getElementById('language-btn-eng');
    const backButton = document.getElementById('back-button'); // Кнопка "Все игры = назад"

    const creditsModal = document.getElementById('credits-modal');
    const creditsInput = document.getElementById('credits-input');
    const confirmCreditsBtn = document.getElementById('confirm-credits-btn');
    const closeCreditsModalBtn = document.getElementById('close-credits-modal');

    const connectionModal = document.getElementById('connection-modal');
    const connectionText = document.getElementById('connection-text');

    const analysisBarContainer = document.getElementById('analysis-bar-container');
    const analysisProgressBar = document.getElementById('analysis-progress-bar');

    const predictionModal = document.getElementById('prediction-modal');
    const predictionResults = document.getElementById('prediction-results');
    const ellipsisSpan = document.getElementById('ellipsis');

    let ellipsisInterval; // Для анимации многоточия

    // --- Функции для управления экранами и модальными окнами ---

    // Показывает экран, скрывает остальные
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('active');
        });
        screenToShow.classList.remove('hidden');
        screenToShow.classList.add('active');
    }

    // Показывает модальное окно
    function showModal(modalToShow) {
        modalToShow.classList.remove('hidden');
    }

    // Скрывает модальное окно
    function hideModal(modalToHide) {
        modalToHide.classList.add('hidden');
    }

    // --- Обработчики событий ---

    // Экран загрузки -> Главное меню
    startLoadingBtn.addEventListener('click', () => {
        showScreen(mainMenuScreen);
    });

    // Главное меню -> Открыть модальное окно ввода кредитов
    startGameBtn.addEventListener('click', () => {
        creditsInput.value = ''; // Очищаем поле ввода
        showModal(creditsModal);
    });

    // Закрыть модальное окно ввода кредитов
    closeCreditsModalBtn.addEventListener('click', () => {
        hideModal(creditsModal);
    });

    // Смена языков (пока просто заглушки)
    languageBtnRus.addEventListener('click', () => {
        alert('Язык изменен на Русский (заглушка)');
        // Здесь могла бы быть логика смены языка
    });

    languageBtnEng.addEventListener('click', () => {
        alert('Language changed to English (placeholder)');
        // Здесь могла бы быть логика смены языка
    });

    // Кнопка "Все игры = назад"
    backButton.addEventListener('click', () => {
        alert('Возврат в главное меню бота Telegram (заглушка).');
        // Здесь можно было бы использовать Telegram WebApp API для закрытия приложения,
        // если бы это было реальное требование.
    });


    // Подтверждение ввода кредитов -> Имитация подключения
    confirmCreditsBtn.addEventListener('click', () => {
        const credits = parseInt(creditsInput.value);
        if (isNaN(credits) || credits <= 0) {
            alert('Пожалуйста, введите корректное количество кредитов (целое положительное число).');
            return;
        }

        hideModal(creditsModal);
        showModal(connectionModal);
        simulateConnection();
    });

    // --- Функции для имитации процессов ---

    // Имитация подключения к серверу
    async function simulateConnection() {
        const messages = [
            "Идет подключение к серверу...",
            "Инициализация модулей...",
            "Ошибка подключения...",
            "Повторная попытка...",
            "Подключение к шлюзу...",
            "Все системы синхронизированы."
        ];

        for (let i = 0; i < messages.length; i++) {
            connectionText.textContent = messages[i];
            await new Promise(resolve => setTimeout(resolve, i < messages.length - 1 ? 1500 : 2000)); // Задержка 1.5-2 секунды
        }

        hideModal(connectionModal);
        simulateAnalysis();
    }

    // Имитация анализа со статус-баром
    async function simulateAnalysis() {
        analysisBarContainer.classList.remove('hidden');
        analysisProgressBar.style.width = '0%'; // Сброс прогресса

        const duration = Math.random() * (6000 - 3000) + 3000; // От 3 до 6 секунд
        let startTime = Date.now();
        let interval = setInterval(() => {
            let elapsedTime = Date.now() - startTime;
            let progress = (elapsedTime / duration) * 100;
            if (progress > 100) progress = 100;
            analysisProgressBar.style.width = `${progress}%`;

            if (elapsedTime >= duration) {
                clearInterval(interval);
                analysisBarContainer.classList.add('hidden'); // Скрыть статус-бар
                showPredictionResults();
            }
        }, 50); // Обновляем каждые 50мс для плавной анимации
    }

    // Показ результатов предсказания
    async function showPredictionResults() {
        showModal(predictionModal);

        // Анимация многоточия
        let dotCount = 0;
        ellipsisInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            ellipsisSpan.textContent = '.'.repeat(dotCount);
        }, 500); // Каждые 0.5 секунды

        // Генерация случайных данных для предсказания
        const result = generatePredictionData();

        // Задержка перед выводом полного текста (имитация "еще идет загрузка")
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Остановка анимации многоточия
        clearInterval(ellipsisInterval);
        ellipsisSpan.textContent = '...'; // Устанавливаем полное многоточие

        predictionResults.innerHTML = `
            <p>Вам осталось ${result.gamesLeft} игр со ставкой ${result.betAmount},</p>
            <p>до заноса x${result.winMultiplier.toFixed(2)} с шансом ${result.chance}%</p>
        `;
    }

    // Генерация случайных данных предсказания
    function generatePredictionData() {
        let winMultiplier, chance, gamesLeft;

        // Генерация множителя заноса: от 68.00 до 159.95
        winMultiplier = Math.random() * (159.95 - 68.00) + 68.00;

        // Расчет шанса: чем выше занос, тем ниже шанс.
        // Шанс от 69% до 92%.
        // Пропорционально уменьшаем шанс при увеличении множителя
        const minWinMultiplier = 68.00;
        const maxWinMultiplier = 159.95;
        const minChance = 69;
        const maxChance = 92;

        // Нормализация множителя (0 до 1)
        const normalizedMultiplier = (winMultiplier - minWinMultiplier) / (maxWinMultiplier - minWinMultiplier);
        // Инвертируем нормализованное значение для шанса
        chance = maxChance - (normalizedMultiplier * (maxChance - minChance));
        chance = Math.max(minChance, Math.min(maxChance, Math.round(chance))); // Убедимся, что шанс в диапазоне и округлим

        // Расчет количества игр: чем выше занос, тем больше игр.
        // Количество игр от 19 до 53.
        const minGames = 19;
        const maxGames = 53;
        gamesLeft = minGames + (normalizedMultiplier * (maxGames - minGames));
        gamesLeft = Math.round(gamesLeft); // Округляем до целого числа

        // Ставка - для простоты берем случайное число.
        // Можно было бы привязать к введенным кредитам, но по условию "20 игр со ставкой 11",
        // ставка не связана напрямую с введенными кредитами для предсказания,
        // поэтому сделаем её случайной для разнообразия, или фиксированной.
        // Для примера сделаем случайной в небольшом диапазоне, чтобы отличалась от 11.
        const betAmount = Math.floor(Math.random() * (20 - 5) + 5);


        return {
            winMultiplier,
            chance,
            gamesLeft,
            betAmount
        };
    }
});