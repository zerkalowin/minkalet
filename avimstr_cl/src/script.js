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

    // Новые кнопки языка в главном меню
    const mainMenuLangRuButton = document.getElementById('mainMenuLangRuButton');
    const mainMenuLangEngButton = document.getElementById('mainMenuLangEngButton');

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

    const predictionResultsDiv = document.getElementById('prediction-results');
    const closePredictionResultBtn = document.getElementById('closePredictionResultBtn');

    // Глобальные переменные для управления состояниями
    let currentScreen = loadingScreen;
    let loadingDotsInterval;

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

    function showModal(modalToShow) {
        modalToShow.style.display = 'flex';
        requestAnimationFrame(() => {
            modalToShow.classList.remove('hidden');
            modalToShow.classList.add('active');
        });
    }

    function hideModal(modalToHide) {
        modalToHide.classList.remove('active');
        modalToHide.classList.add('hidden');
        setTimeout(() => {
            modalToHide.style.display = 'none';
        }, 300);
    }

    // --- Логика загрузочного экрана ---
    function startLoadingAnimation() {
        let dots = 0;
        loadingDotsInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingEllipsis.textContent = '.'.repeat(dots);
        }, 300);

        setTimeout(() => {
            clearInterval(loadingDotsInterval);
            loadingEllipsis.textContent = ''; // Убираем многоточие
            loadingStartButton.classList.remove('hidden');
            gameLogo.style.opacity = '1';
        }, 3000);
    }

    // --- Объекты переводов ---
    const translations = {
        ru: {
            title: "Avia Masters Hack",
            loading: "Загрузка",
            start: "НАЧАТЬ",
            chooseLanguage: "Выбор языка:",
            ruLangCode: "RU",
            enLangCode: "ENG",
            allGames: "Все игры",
            predictorTitle: "ПРЕДСКАЗАТЕЛЬ",
            changeLangRu: "Смена языков RUS",
            changeLangEng: "Смена языков ENG",
            allGamesBack: "Все игры = назад",
            analyzing: "Идет анализ...",
            enterCreditsTitle: "Введите сумму ставки:",
            enterAmountPlaceholder: "Ведите сумму",
            confirm: "ПОДТВЕРДИТЬ",
            syncDataTitle: "СИНХРОНИЗАЦИЯ ДАННЫХ",
            flightFinishedTitle: "ПОЛЕТ ЗАВЕРШЕН",
            close: "Закрыть",
            alertMessages: {
                invalidCredits: "Пожалуйста, введите корректную сумму кредитов.",
                allGamesNotImplemented: "Переход к списку всех игр (пока не реализовано)"
            },
            syncMessages: [
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
            ],
            // Перевод для alt атрибутов изображений
            aircraftCarrierAlt: "Авианосец",
            airplaneAlt: "Самолет",
            gameLogoAlt: "Логотип Игры", // Добавьте это, если хотите переводить alt для game-logo
            introLogoAlt: "Логотип Avia Masters Hack" // Добавьте это, если хотите переводить alt для intro-logo
            // predictionMessage будет формироваться динамически из этой строки
            ,predictionMessage: "Вам осталось <span class=\"highlight-text\">${games}</span> игр со ставкой <span class=\"highlight-text\">${userCredits}</span>, до заноса <span class=\"highlight-text\">x${zanos}</span> c шансом <span class=\"highlight-text\">${chance}%</span>"
        },
        en: {
            title: "Avia Masters Hack",
            loading: "Loading",
            start: "START",
            chooseLanguage: "Choose language:",
            ruLangCode: "RU",
            enLangCode: "ENG",
            allGames: "All Games",
            predictorTitle: "PREDICTOR",
            changeLangRu: "Switch to Russian",
            changeLangEng: "Switch to English",
            allGamesBack: "All games = back", // Keeping as literal as possible for now
            analyzing: "Analyzing...",
            enterCreditsTitle: "Enter bet amount:",
            enterAmountPlaceholder: "Enter amount",
            confirm: "CONFIRM",
            syncDataTitle: "DATA SYNCHRONIZATION",
            flightFinishedTitle: "FLIGHT COMPLETED",
            close: "Close",
            alertMessages: {
                invalidCredits: "Please enter a valid amount of credits.",
                allGamesNotImplemented: "Transition to all games list (not yet implemented)"
            },
            syncMessages: [
                { text: "Initializing modules...", type: "normal" },
                { text: "Attempting to connect to BGAMING API...", type: "normal" },
                { text: "BGAMING API connection error. Code: 503.", type: "error" },
                { text: "Retrying connection...", type: "warning" },
                { text: "Connection established.", type: "success" },
                { text: "Loading client parameters...", type: "normal" },
                { text: "Synchronizing user data...", type: "normal" },
                { text: "New updates detected...", type: "normal" },
                { text: "Applying updates...", type: "normal" },
                { text: "All systems synchronized. Launching.", type: "success" }
            ],
            aircraftCarrierAlt: "Aircraft Carrier",
            airplaneAlt: "Airplane",
            gameLogoAlt: "Game Logo",
            introLogoAlt: "Avia Masters Hack Logo"
            ,predictionMessage: "You have <span class=\"highlight-text\">${games}</span> games left with a bet of <span class=\"highlight-text\">${userCredits}</span>, until a cash-out of <span class=\"highlight-text\">x${zanos}</span> with <span class=\"highlight-text\">${chance}%</span> chance"
        }
    };

    // Определяем текущий язык из localStorage или по умолчанию 'ru'
    let currentLang = localStorage.getItem('language') || 'ru';

    // Функция для применения переводов
    function setLanguage(lang) {
        document.documentElement.lang = lang; // Устанавливаем атрибут lang для HTML
        localStorage.setItem('language', lang); // Сохраняем выбор языка

        // Обновляем title страницы
        document.title = translations[lang].title;

        // Обновляем все элементы с data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Специальный случай для loadingEllipsis, чтобы не удалять спан с точками
                if (element.id === 'loading-ellipsis') {
                   // У loadingEllipsis только текст до спана с точками, но он уже пустой после анимации
                   // Поэтому просто обновляем его родительский текст, если он есть
                   if (element.parentNode && element.parentNode.querySelector('p')) {
                       element.parentNode.querySelector('p').childNodes[0].textContent = translations[lang][key];
                   }
                } else {
                    element.textContent = translations[lang][key];
                }
            }
        });

        // Обновляем placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                element.placeholder = translations[lang][key];
            }
        });

        // Обновляем alt атрибуты изображений
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            if (translations[lang][key]) {
                element.alt = translations[lang][key];
            }
        });

        // Отдельно для элемента <p>Загрузка<span id="loading-ellipsis">...</span></p>
        // Его textContent будет "Загрузка", а ellipsis отдельно.
        // Нужно найти <p> в loading-screen и обновить его textContent до спана.
        const loadingParagraph = document.querySelector('#loading-screen p');
        if (loadingParagraph) {
            // Создаем текстовый узел для "Загрузка" и добавляем его перед span
            const loadingTextNode = document.createTextNode(translations[lang].loading);
            // Если есть уже текст до спана, обновляем его
            if (loadingParagraph.firstChild && loadingParagraph.firstChild.nodeType === Node.TEXT_NODE) {
                loadingParagraph.firstChild.textContent = translations[lang].loading;
            } else { // Иначе вставляем в начало
                loadingParagraph.prepend(loadingTextNode);
            }
        }
    }


    // Логика модального окна "СИНХРОНИЗАЦИЯ ДАННЫХ" с построчным выводом
    function showSyncProgress() {
        return new Promise(resolve => {
            syncMessagesContainer.innerHTML = ''; // Очищаем контейнер перед началом
            showModal(analysisMessageModal); // Показываем модальное окно

            let i = 0;
            const delayBetweenMessages = 1000; // Задержка между сообщениями (1 секунда)

            function displayNextSyncMessage() {
                // Используем сообщения для текущего языка
                const messages = translations[currentLang].syncMessages;

                if (i < messages.length) {
                    const messageData = messages[i];
                    const messageElement = document.createElement('p');
                    messageElement.classList.add('sync-message');
                    messageElement.textContent = messageData.text;

                    if (messageData.type && messageData.type !== "normal") {
                        messageElement.classList.add(messageData.type);
                    }

                    syncMessagesContainer.appendChild(messageElement);
                    syncMessagesContainer.scrollTop = syncMessagesContainer.scrollHeight;

                    i++;
                    setTimeout(displayNextSyncMessage, delayBetweenMessages);
                } else {
                    setTimeout(() => {
                        hideModal(analysisMessageModal);
                        resolve();
                    }, 1000);
                }
            }
            displayNextSyncMessage();
        });
    }

    // Логика статус-бара анализа
    function startAnalysisProgressBar() {
        return new Promise(resolve => {
            analysisProgressBar.style.width = '0%';
            analysisBarContainer.style.display = 'block';

            let width = 0;
            const duration = Math.random() * (6000 - 3000) + 3000;
            const interval = duration / 100;

            let progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        analysisBarContainer.style.display = 'none';
                        resolve();
                    }, 300);
                } else {
                    width++;
                    analysisProgressBar.style.width = width + '%';
                }
            }, interval);
        });
    }

    // --- Логика генерации предсказания ---
    function generatePrediction(userCredits) {
        const STORAGE_KEY_PREFIX = 'prediction_';
        const EXPIRATION_TIME = 2 * 60 * 1000;

        const storageKey = STORAGE_KEY_PREFIX + userCredits;

        const storedPredictionString = localStorage.getItem(storageKey);

        let games, zanos, chance;

        if (storedPredictionString) {
            try {
                const storedPrediction = JSON.parse(storedPredictionString);
                const currentTime = Date.now();

                if (currentTime - storedPrediction.timestamp < EXPIRATION_TIME) {
                    console.log(`Используем сохраненное предсказание для ставки ${userCredits}`);
                    games = storedPrediction.games;
                    zanos = storedPrediction.zanos;
                    chance = storedPrediction.chance;
                } else {
                    console.log(`Срок действия предсказания для ставки ${userCredits} истек.`);
                    localStorage.removeItem(storageKey);
                }
            } catch (e) {
                console.error("Ошибка при парсинге сохраненного предсказания из localStorage:", e);
                localStorage.removeItem(storageKey);
            }
        }

        if (games === undefined) { // Если не нашли сохраненное или оно устарело
            console.log(`Генерируем новое предсказание для ставки ${userCredits}`);
            const minZanos = 68.00;
            const maxZanos = 159.95;
            zanos = (Math.random() * (maxZanos - minZanos) + minZanos).toFixed(2);

            if (zanos < 90) {
                chance = Math.floor(Math.random() * (92 - 80) + 80);
            } else if (zanos < 120) {
                chance = Math.floor(Math.random() * (85 - 75) + 75);
            } else {
                chance = Math.floor(Math.random() * (75 - 69) + 69);
            }
            chance = Math.max(69, Math.min(92, chance));

            if (zanos < 90) {
                games = Math.floor(Math.random() * (25 - 19) + 19);
            } else if (zanos < 120) {
                games = Math.floor(Math.random() * (40 - 25) + 25);
            } else {
                games = Math.floor(Math.random() * (53 - 40) + 40);
            }
            games = Math.max(19, Math.min(53, games));

            const newPrediction = {
                games: games,
                zanos: zanos,
                chance: chance,
                timestamp: Date.now()
            };
            localStorage.setItem(storageKey, JSON.stringify(newPrediction));
        }

        // Используем шаблонную строку из переводов
        // Важно: в predictionMessage в translations должны быть плейсхолдеры ${games}, ${userCredits} и т.д.
        // которые будут заменены значениями.
        const messageTemplate = translations[currentLang].predictionMessage;
        return messageTemplate
            .replace('${games}', `<span class="highlight-text">${games}</span>`)
            .replace('${userCredits}', `<span class="highlight-text">${userCredits}</span>`)
            .replace('${zanos}', `<span class="highlight-text">${zanos}</span>`)
            .replace('${chance}', `<span class="highlight-text">${chance}</span>`);
    }

    // --- Обработчики событий ---

    loadingStartButton.addEventListener('click', () => {
        showScreen(introSceneScreen);
    });

    startGameBtnIntro.addEventListener('click', () => {
        showModal(creditsModal);
    });

    confirmCreditsBtn.addEventListener('click', async () => {
        const credits = creditsInput.value;
        if (credits && parseInt(credits) > 0) {
            hideModal(creditsModal);
            showScreen(mainMenuScreen);

            await showSyncProgress();
            await startAnalysisProgressBar();

            showModal(predictionResultModal);
            predictionResultsDiv.innerHTML = `<p>${generatePrediction(parseInt(credits))}</p>`;

        } else {
            // Используем переведенное сообщение
            alert(translations[currentLang].alertMessages.invalidCredits);
        }
    });

    closePredictionResultBtn.addEventListener('click', () => {
        hideModal(predictionResultModal);
    });

    // Изменение здесь: вместо открытия ссылки, закрываем WebApp
    allGamesBtnIntro.addEventListener('click', () => {
        // Закрываем Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        } else {
            console.warn("Telegram WebApp API is not available. Cannot close the app.");
            // Опционально: если вы хотите сохранить старое поведение для отладки вне Telegram
            // window.open('https://polumertvec.github.io/SWbot/', '_blank');
        }
    });

    mainMenuBackButton.addEventListener('click', () => {
        showScreen(introSceneScreen);
    });

    mainMenuStartButton.addEventListener('click', async () => {
        showModal(creditsModal);
    });

    // Обработчики для кнопок смены языка
    langRuBtn.addEventListener('click', () => {
        setLanguage('ru');
        currentLang = 'ru'; // Обновляем текущий язык
    });
    langEngBtn.addEventListener('click', () => {
        setLanguage('en');
        currentLang = 'en'; // Обновляем текущий язык
    });
    // Добавляем обработчики для кнопок в главном меню
    if (mainMenuLangRuButton) {
        mainMenuLangRuButton.addEventListener('click', () => {
            setLanguage('ru');
            currentLang = 'ru';
        });
    }
    if (mainMenuLangEngButton) {
        mainMenuLangEngButton.addEventListener('click', () => {
            setLanguage('en');
            currentLang = 'en';
        });
    }

    // Запускаем анимацию загрузочного экрана при старте
    startLoadingAnimation();
    // Применяем язык при загрузке страницы
    setLanguage(currentLang);
});
