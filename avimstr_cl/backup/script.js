document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const loadingScreen = document.getElementById('loading-screen');
    const introSceneScreen = document.getElementById('intro-scene-screen');
    const mainMenuScreen = document.getElementById('main-menu-screen');

    const gameLogo = document.getElementById('game-logo');
    const loadingEllipsis = document.getElementById('loading-ellipsis');
    const loadingStartButton = document.getElementById('loading-start-button');

    const startGameBtnIntro = document.getElementById('startGameBtnIntro');
    const allGamesBtnIntro = document.getElementById('allGamesBtnIntro');
    const langRuBtn = document.getElementById('langRuBtn');
    const langEngBtn = document.getElementById('langEngBtn');

    const mainMenuStartButton = document.getElementById('mainMenuStartButton');
    const mainMenuBackButton = document.getElementById('mainMenuBackButton');

    const creditsModal = document.getElementById('creditsModal');
    const creditsInput = document.getElementById('credits-input');
    const confirmCreditsBtn = document.getElementById('confirmCreditsBtn');

    const analysisMessageModal = document.getElementById('analysisMessageModal');
    const syncMessagesContainer = document.getElementById('sync-messages-container');

    const analysisBarContainer = document.getElementById('analysis-bar-container');
    const analysisProgressBar = document.getElementById('analysis-progress-bar');

    const predictionResultModal = document.getElementById('predictionResultModal');
    const predictionEllipsis = document.getElementById('prediction-ellipsis');
    const predictionResultsDiv = document.getElementById('prediction-results');
    const closePredictionResultBtn = document.getElementById('closePredictionResultBtn');

    // Глобальные переменные для управления состояниями
    let currentScreen = loadingScreen;
    let loadingDotsInterval;
    let predictionDotsInterval;

    // --- Обновленный код для облаков ---
    const cloudsBackground = document.getElementById('clouds-background');
    const cloudImages = ['cloud1.png', 'cloud2.png']; // Ваши изображения облаков

    // Функция для генерации случайного числа в заданном диапазоне
    function getRandomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Функция для создания и добавления одного облака
    function createCloud() {
        const cloud = document.createElement('img');
        cloud.classList.add('moving-cloud');

        // Случайный выбор изображения облака
        const randomImage = cloudImages[Math.floor(Math.random() * cloudImages.length)];
        cloud.src = randomImage;
        cloud.alt = 'Cloud';

        // Случайные размеры: от 108px до 240px
        const randomWidth = getRandomNumber(108, 240);
        cloud.style.width = `${randomWidth}px`;
        cloud.style.height = 'auto'; // Убедимся, что высота авто для сохранения пропорций

        // Случайная вертикальная позиция: от 0% до 30% высоты контейнера
        const randomTop = getRandomNumber(0, 30);
        cloud.style.top = `${randomTop}%`;

        // Случайная начальная горизонтальная позиция: от -50% до -10% ширины облака
        cloud.style.left = `${getRandomNumber(-randomWidth * 0.8, -randomWidth * 0.2)}px`;
        cloud.style.animationName = 'moveAndFadeCloud';

        // Случайная продолжительность анимации (скорость движения): от 20 до 40 секунд
        const randomDuration = getRandomNumber(20, 40);
        cloud.style.animationDuration = `${randomDuration}s`;

        // Случайная прозрачность: от 40% до 90% (базовая, которая будет анимироваться)
        cloud.style.opacity = getRandomNumber(0.4, 0.9);

        // Добавляем облако в контейнер
        cloudsBackground.appendChild(cloud);

        // После завершения анимации, удаляем облако из DOM и создаем новое.
        cloud.addEventListener('animationend', () => {
            cloudsBackground.removeChild(cloud);
            createCloud(); // Создаем новое облако после того, как старое ушло
        });
    }

    // Генерируем несколько облаков при загрузке страницы
    const numberOfClouds = 8;
    for (let i = 0; i < numberOfClouds; i++) {
        setTimeout(createCloud, i * 2000);
    }
    // --- Конец обновленного кода для облаков ---


    // --- Вспомогательные функции для показа/скрытия экранов и модальных окон ---
    function showScreen(screenToShow) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('hidden');
        screenToShow.classList.remove('hidden');
        screenToShow.classList.add('active');
        currentScreen = screenToShow;
    }

    // ОБНОВЛЕНО: Функции showModal и hideModal теперь корректно работают с display: flex/none
    function showModal(modalToShow) {
        modalToShow.style.display = 'flex'; // Сначала делаем видимым для анимации
        // Небольшая задержка, чтобы браузер успел применить display: flex перед применением opacity
        requestAnimationFrame(() => {
            modalToShow.classList.remove('hidden');
            modalToShow.classList.add('active');
        });
    }

    function hideModal(modalToHide) {
        modalToHide.classList.remove('active');
        modalToHide.classList.add('hidden');
        // Дождемся окончания анимации (0.3s) перед скрытием элемента полностью
        setTimeout(() => {
            modalToHide.style.display = 'none';
        }, 300); // Соответствует transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    // --- Логика загрузочного экрана ---
    function startLoadingAnimation() {
        let dots = 0;
        loadingDotsInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingEllipsis.textContent = '.'.repeat(dots);
        }, 300);

        // Имитация загрузки и появления кнопки
        setTimeout(() => {
            clearInterval(loadingDotsInterval);
            loadingEllipsis.textContent = ''; // Убираем многоточие
            loadingStartButton.classList.remove('hidden'); // Показываем кнопку "НАЧАТЬ"
            gameLogo.style.opacity = '1'; // Логотип уже должен быть виден по CSS анимации fadeIn
        }, 3000); // Показываем кнопку через 3 секунды
    }

    // Массив сообщений для синхронизации с типами
    const syncMessages = [
        { text: "Инициализация модулей...", type: "normal" },
        { text: "Попытка подключения к BGAMING API...", type: "normal" },
        { text: "Ошибка подключения к BGAMING API. Код: 503.", type: "error" },
        { text: "Повторная попытка подключения...", type: "warning" },
        { text: "Подключение установлено.", type: "success" },
        { text: "Загрузка параметров клиента...", type: "normal" },
        { text: "Синхронизация данных пользователя...", type: "normal" },
        { text: "Обнаружены новые обновления...", type: "normal" },
        { text: "Применение обновлений...", type: "normal" },
        { text: "Все системы синхронизированы. Запуск.", type: "success" }
    ];

    // Логика модального окна "СИНХРОНИЗАЦИЯ ДАННЫХ" с построчным выводом
    function showSyncProgress() {
        return new Promise(resolve => {
            syncMessagesContainer.innerHTML = ''; // Очищаем контейнер перед началом
            showModal(analysisMessageModal); // Показываем модальное окно

            let i = 0;
            const delayBetweenMessages = 1000; // Задержка между сообщениями (1 секунда)

            function displayNextSyncMessage() {
                if (i < syncMessages.length) {
                    const messageData = syncMessages[i];
                    const messageElement = document.createElement('p');
                    messageElement.classList.add('sync-message');
                    messageElement.textContent = messageData.text;

                    // Добавляем класс для цвета, если указан тип
                    if (messageData.type && messageData.type !== "normal") {
                        messageElement.classList.add(messageData.type);
                    }

                    syncMessagesContainer.appendChild(messageElement);
                    // Прокручиваем вниз, чтобы новое сообщение было видно
                    syncMessagesContainer.scrollTop = syncMessagesContainer.scrollHeight;

                    i++;
                    setTimeout(displayNextSyncMessage, delayBetweenMessages);
                } else {
                    // Все сообщения показаны, ждем немного и скрываем модальное окно
                    setTimeout(() => {
                        hideModal(analysisMessageModal);
                        resolve(); // Разрешаем промис после закрытия модального окна
                    }, 1000); // Модальное окно закрывается через 1 секунду после последнего сообщения
                }
            }
            displayNextSyncMessage(); // Запускаем первое сообщение
        });
    }

    // Логика статус-бара анализа
    function startAnalysisProgressBar() {
        return new Promise(resolve => {
            analysisProgressBar.style.width = '0%';
            analysisBarContainer.style.display = 'block'; // Показываем статус-бар

            let width = 0;
            const duration = Math.random() * (6000 - 3000) + 3000; // 3-6 секунд
            const interval = duration / 100; // Обновляем 100 раз

            let progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(progressInterval);
                    // Дождемся, пока opacity станет 0 (если будут добавлены анимации скрытия), прежде чем скрывать display
                    setTimeout(() => {
                        analysisBarContainer.style.display = 'none'; // Скрываем статус-бар полностью
                        resolve();
                    }, 300); // Небольшая задержка, если захочешь добавить fadeOut
                } else {
                    width++;
                    analysisProgressBar.style.width = width + '%';
                }
            }, interval);
        });
    }

    // --- Логика генерации предсказания ---
    function generatePrediction() {
        const minZanos = 68.00;
        const maxZanos = 159.95;
        const zanos = (Math.random() * (maxZanos - minZanos) + minZanos).toFixed(2);

        let chance;
        if (zanos < 90) { // Низкий занос - высокий шанс
            chance = Math.floor(Math.random() * (92 - 80) + 80);
        } else if (zanos < 120) { // Средний занос - средний шанс
            chance = Math.floor(Math.random() * (85 - 75) + 75);
        } else { // Высокий занос - низкий шанс
            chance = Math.floor(Math.random() * (75 - 69) + 69);
        }
        chance = Math.max(69, Math.min(92, chance)); // Убедимся, что шанс в диапазоне 69-92%

        let games;
        if (zanos < 90) { // Низкий занос - мало игр
            games = Math.floor(Math.random() * (25 - 19) + 19);
        } else if (zanos < 120) { // Средний занос - среднее количество игр
            games = Math.floor(Math.random() * (40 - 25) + 25);
        } else { // Высокий занос - много игр
            games = Math.floor(Math.random() * (53 - 40) + 40);
        }
        games = Math.max(19, Math.min(53, games)); // Убедимся, что игр в диапазоне 19-53

        const stake = Math.floor(Math.random() * (20 - 5) + 5); // Случайная ставка, например, от 5 до 20

        return `Вам осталось ${games} игр со ставкой ${stake}, до заноса x${zanos} c шансом ${chance}%`;
    }

    // --- Обработчики событий ---

    // 1. Загрузочный экран: кнопка "НАЧАТЬ"
    loadingStartButton.addEventListener('click', () => {
        showScreen(introSceneScreen);
    });

    // 2. Вступительная сцена: кнопка "НАЧАТЬ"
    startGameBtnIntro.addEventListener('click', () => {
        showModal(creditsModal); // Показываем модальное окно ввода кредитов
    });

    // 3. Модальное окно кредитов: кнопка "Подтвердить"
    confirmCreditsBtn.addEventListener('click', async () => {
        const credits = creditsInput.value;
        if (credits && parseInt(credits) > 0) {
            hideModal(creditsModal); // Скрываем модальное окно кредитов

            // ОБНОВЛЕНО: После ввода суммы, переключаемся на главное меню и затем показываем синхронизацию
            showScreen(mainMenuScreen); // Переключаемся на главное меню

            // Затем показываем сообщения синхронизации и ждем их завершения
            await showSyncProgress();

            // После завершения синхронизации, показываем статус-бар анализа
            await startAnalysisProgressBar();

            // После завершения анализа, показываем модальное окно с результатом
            showModal(predictionResultModal);
            predictionResultsDiv.innerHTML = `<p>${generatePrediction()}</p>`; // Вставляем сгенерированное предсказание

            // Анимация многоточия для "Анализ..." (в окне предсказания)
            let dots = 0;
            predictionDotsInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                predictionEllipsis.textContent = '.'.repeat(dots);
            }, 500);

        } else {
            alert('Пожалуйста, введите корректную сумму кредитов.');
        }
    });

    // 4. Модальное окно предсказания: кнопка "Закрыть"
    closePredictionResultBtn.addEventListener('click', () => {
        hideModal(predictionResultModal);
        clearInterval(predictionDotsInterval); // Останавливаем анимацию многоточия
    });

    // 5. Вступительная сцена: кнопка "Все игры"
    allGamesBtnIntro.addEventListener('click', () => {
        alert('Переход к списку всех игр (пока не реализовано)');
        // В будущем здесь будет переход на другой экран или внешний ресурс
    });

    // 6. Главное меню: кнопка "Все игры = назад"
    mainMenuBackButton.addEventListener('click', () => {
        showScreen(introSceneScreen); // Возвращаемся на вступительную сцену
    });

    // 7. Главное меню: кнопка "НАЧАТЬ" (если пользователь нажмет ее после возвращения)
    mainMenuStartButton.addEventListener('click', async () => {
        showModal(creditsModal); // Снова показываем модальное окно кредитов
    });

    // Дополнительно: обработка кнопок смены языка (пока только вывод в консоль)
    langRuBtn.addEventListener('click', () => console.log('Выбран русский язык'));
    langEngBtn.addEventListener('click', () => console.log('Выбран английский язык'));

    // Запускаем анимацию загрузочного экрана при старте
    startLoadingAnimation();
});