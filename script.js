document.addEventListener('DOMContentLoaded', () => {
    // Состояние приложения (в памяти, так как это демо для GitHub Pages)
    let state = {
        balance: 1000000.0,
        currentUser: null,
        targetPassword: 'strongpassword1234'
    };

    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const errorMsg = document.getElementById('error-msg');
    const balanceAmount = document.getElementById('balance-amount');
    const transferBtn = document.getElementById('transfer-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const successModal = document.getElementById('success-modal');
    const closeModal = document.getElementById('close-modal');

    // Логика Консоли Хакера
    const hackerConsole = document.getElementById('hacker-console');
    const showHackerBtn = document.getElementById('show-hacker-tools-btn');
    const closeConsole = document.getElementById('close-console');
    const startHackBtn = document.getElementById('start-hack-btn');
    const hackLogs = document.getElementById('hack-logs');
    const hackStatus = document.getElementById('hack-status');
    const hackAttempts = document.getElementById('hack-attempts');
    const hackSpeed = document.getElementById('hack-speed');
    const currentTarget = document.getElementById('current-target');

    let isHacking = false;
    let hackInterval = null;

    showHackerBtn.addEventListener('click', () => {
        hackerConsole.classList.add('active');
    });

    closeConsole.addEventListener('click', () => {
        hackerConsole.classList.remove('active');
        stopHacking();
    });

    startHackBtn.addEventListener('click', () => {
        if (isHacking) {
            stopHacking();
        } else {
            startHacking();
        }
    });

    function addLog(msg, type = '') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        hackLogs.appendChild(entry);
        if (hackLogs.childNodes.length > 50) {
            hackLogs.removeChild(hackLogs.firstChild);
        }
    }

    // Симуляция алгоритма брутфорса (аналог Rust Engine)
    function startHacking() {
        isHacking = true;
        startHackBtn.textContent = 'ОСТАНОВИТЬ';
        startHackBtn.style.background = 'var(--error)';
        hackStatus.textContent = 'АТАКА...';
        hackStatus.style.color = 'var(--error)';

        const startTime = Date.now();
        addLog("Запуск JS BruteForce Engine v3.0 (Static)...", "neutral");

        const prefixes = ["password", "123456", "admin", "admin123", "qwerty", "superman", "bank", "secure", "login", "trust", "pass", "strongpassword"];
        const suffixes = ["", "1", "12", "123", "1234", "!", "@", "2024", "2025", "admin", "qwerty"];

        let pIdx = 0;
        let sIdx = 0;
        let count = 0;

        const performNextStep = () => {
            if (!isHacking) return;

            count++;
            let guess = "";
            let isMatch = false;

            // Логика перебора
            if (pIdx < prefixes.length) {
                guess = prefixes[pIdx] + suffixes[sIdx];
                sIdx++;
                if (sIdx >= suffixes.length) {
                    sIdx = 0;
                    pIdx++;
                }
            } else {
                // Если все варианты из списка перебрали, выдаем финальный результат
                guess = state.targetPassword;
                isMatch = true;
            }

            if (guess === state.targetPassword) isMatch = true;

            // Обновление UI
            hackAttempts.textContent = count;
            currentTarget.textContent = guess;
            const elapsed = (Date.now() - startTime) / 1000;
            hackSpeed.textContent = (count / elapsed).toFixed(1) + ' req/s';

            if (isMatch) {
                addLog(`УСПЕХ: Пароль найден! [${guess}] - HTTP 200 OK`, 'success');
                stopHacking(true, guess);
            } else {
                addLog(`ОШИБКА: Попытка "${guess}" - HTTP 401 Unauthorized`);

                // Планируем следующий шаг (ускоряемся со временем)
                const delay = count < 10 ? 300 : (count < 50 ? 50 : 10);
                hackInterval = setTimeout(performNextStep, delay);
            }
        };

        performNextStep();
    }

    function stopHacking(isSuccess = false, pwd = '') {
        isHacking = false;
        if (hackInterval) clearTimeout(hackInterval);

        startHackBtn.textContent = 'ЗАПУСК АТАКИ';
        startHackBtn.style.background = '';
        hackStatus.textContent = isSuccess ? 'ВЗЛОМАНО' : 'ОЖИДАНИЕ';
        hackStatus.style.color = isSuccess ? 'var(--success)' : '#22c55e';

        if (isSuccess) {
            setTimeout(() => {
                hackerConsole.classList.remove('active');
                document.getElementById('username').value = 'admin';
                document.getElementById('password').value = pwd;
                loginForm.dispatchEvent(new Event('submit'));
            }, 2000);
        }
    }

    // Обработка Входа (Локальная симуляция)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Симуляция задержки сети
        loginForm.style.opacity = '0.5';

        setTimeout(() => {
            loginForm.style.opacity = '1';
            if (username === 'admin' && password === state.targetPassword) {
                loginSection.classList.remove('active');
                dashboardSection.classList.add('active');
                balanceAmount.textContent = state.balance.toLocaleString('en-US', { minimumFractionDigits: 2 });
            } else {
                errorMsg.textContent = 'Ошибка аутентификации. Проверьте данные.';
            }
        }, 500);
    });

    // Перевод Средств
    const transferModal = document.getElementById('transfer-modal');
    const confirmTransferBtn = document.getElementById('confirm-transfer-btn');
    const cancelTransferBtn = document.getElementById('cancel-transfer-btn');
    const phoneNumberInput = document.getElementById('phone-number');
    const targetPhoneDisplay = document.getElementById('target-phone-display');

    transferBtn.addEventListener('click', () => {
        transferModal.classList.add('active');
    });

    cancelTransferBtn.addEventListener('click', () => {
        transferModal.classList.remove('active');
        phoneNumberInput.value = '';
    });

    confirmTransferBtn.addEventListener('click', () => {
        const phone = phoneNumberInput.value.trim();
        if (!phone) {
            alert('Пожалуйста, введите номер телефона');
            return;
        }

        confirmTransferBtn.disabled = true;
        confirmTransferBtn.textContent = 'Обработка...';

        setTimeout(() => {
            state.balance = 0;
            balanceAmount.textContent = '0.00';
            targetPhoneDisplay.textContent = phone;
            transferModal.classList.remove('active');
            successModal.classList.add('active');
            phoneNumberInput.value = '';

            confirmTransferBtn.disabled = false;
            confirmTransferBtn.textContent = 'Подтвердить перевод';
        }, 1500);
    });

    // Закрытие Модального Окна
    closeModal.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    // Выход
    logoutBtn.addEventListener('click', () => {
        dashboardSection.classList.remove('active');
        loginSection.classList.add('active');
        document.getElementById('password').value = '';
        errorMsg.textContent = '';
    });
});
