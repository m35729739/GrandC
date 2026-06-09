// СПИСОК БИЗНЕСОВ
const businessItems = [
    {id: "shaurma", name: "🌯 Шаурмечная", price: 500, profit: 1.5, icon: "🌯", desc: "Классический стрит-фуд бизнес."},
    {id: "coffee", name: "☕ Кофе-Точка", price: 3000, profit: 12, icon: "☕", desc: "Продажа бодрящих напитков."},
    {id: "carwash", name: "🚗 Автомойка 24/7", price: 25000, profit: 85, icon: "🚗", desc: "Сервисный бизнес для автомобилей."},
    {id: "computer", name: "🖥️ Компьютерный Клуб", price: 120000, profit: 420, icon: "🖥️", desc: "Сфера развлечений."},
    {id: "crypto", name: "⛏️ Майнинг Ферма", price: 650000, profit: 2100, icon: "⛏️", desc: "Высокотехнологичный майнинг."},
    {id: "hotel", name: "🏨 Отель Grand", price: 3500000, profit: 11500, icon: "🏨", desc: "Отельный бизнес премиум-сегмента."},
    {id: "oil", name: "🛢️ Нефтяная Корпорация", price: 25000000, profit: 95000, icon: "🛢️", desc: "Сырьевой гигант."},
    {id: "space", name: "🚀 Космическая Программа", price: 150000000, profit: 680000, icon: "🚀", desc: "Частные коммерческие запуски ракет."}
];

// АВАТАРКИ И ОБОДКИ
const avatarItems = [
    {id: 0, name: "Обычный", style: "background: #34495e;", price: 0, emoji: "👤", frameClass: ""},
    {id: 1, name: "Инвестор", style: "background: #f1c40f;", price: 15000, emoji: "💎", frameClass: "frame-pulse"},
    {id: 2, name: "Кибер-Драйвер", style: "background: #3498db;", price: 60000, emoji: "🤖", frameClass: "frame-spin"},
    {id: 3, name: "Халиф Неоновый", style: "background: #00ffcc;", price: 250000, emoji: "👑", frameClass: "frame-neon"},
    {id: 4, name: "Олигарх", style: "background: #e74c3c;", price: 1000000, emoji: "💰", frameClass: "frame-shake"},
    {id: 98, name: "Аура Разработчика", style: "background: #8e44ad;", price: 500000, emoji: "⚡", frameClass: "frame-spin"},
    {id: 99, name: "Корона Создателя", style: "background: linear-gradient(135deg,#ff0055,#00ffcc);", price: 0, emoji: "👑", frameClass: "frame-rainbow"}
];

// НАСТРОЙКИ КАЛЕНДАРЯ
function getCalendarRewardInfo(day) {
    if (day === 5) return { type: "upgrade", target: "tap", val: 5, label: "🔨 Сила клика +5 ур."};
    if (day === 10) return { type: "coins", val: 50000, label: "+50,000 G"};
    if (day === 15) return { type: "upgrade", target: "regen", val: 10, label: "🌀 Регенерация +10 ур."};
    if (day === 22) return { type: "upgrade", target: "energy", val: 15, label: "⚡ Энергия +15 ур."};
    if (day === 31) return { type: "coins", val: 1000000, label: "🎁 +1,000,000 G"};
    return { type: "coins", val: day * 5000, label: `+${(day*5000).toLocaleString()} G`};
}

// ПОЛУЧЕНИЕ ТЕКУЩЕЙ СТАВКИ (7% обычные дни, 15% по субботам)
function getCurrentReferralRate() {
    let now = new Date();
    let dayOfWeek = now.getDay();
    if (dayOfWeek === 6) return 0.15;
    return 0.07;
}

// ГЕНЕРАЦИЯ УНИКАЛЬНОГО ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
}

// СТАНДАРТНЫЙ ПРОФИЛЬ
const defaultData = {
    userId: null,
    score: 0,
    totalEarned: 0,
    energy: 5000,
    boostTapLvl: 1,
    boostEnergyLvl: 1,
    boostRegenLvl: 1,
    boostAutoLvl: 0,
    nickname: "Игрок",
    currentAvatarId: 0,
    ownedAvatars: [0],
    adminLevel: 0,
    dailyCurrentDay: 1,
    dailyLastClaimTime: 0,
    isBanned: false,
    bannedNicknames: [],
    business: { shaurma: 0, coffee: 0, carwash: 0, computer: 0, crypto: 0, hotel: 0, oil: 0, space: 0 },
    isInfiniteEnergy: false,
    customMaxEnergy: 0,
    invitedBy: null,
    referralsCount: 0,
    referralEarnings: 0,
    earningsHistory: []
};

// ЗАГРУЗКА ДАННЫХ
let allUsersData = JSON.parse(localStorage.getItem('grand_coin_all_users')) || {};
let currentUserId = localStorage.getItem('grand_coin_current_user');

if (!currentUserId || !allUsersData[currentUserId]) {
    currentUserId = generateUserId();
    allUsersData[currentUserId] = JSON.parse(JSON.stringify(defaultData));
    allUsersData[currentUserId].userId = currentUserId;
    allUsersData[currentUserId].nickname = "Игрок_" + Math.floor(Math.random() * 10000);
    allUsersData[currentUserId].earningsHistory = [];
    localStorage.setItem('grand_coin_current_user', currentUserId);
    localStorage.setItem('grand_coin_all_users', JSON.stringify(allUsersData));
}

let gameData = allUsersData[currentUserId];

if (gameData.invitedBy === undefined) gameData.invitedBy = null;
if (gameData.referralsCount === undefined) gameData.referralsCount = 0;
if (gameData.referralEarnings === undefined) gameData.referralEarnings = 0;
if (gameData.earningsHistory === undefined) gameData.earningsHistory = [];

let globalPromos = JSON.parse(localStorage.getItem('grand_global_promos')) || {};

if (gameData.isBanned || (gameData.bannedNicknames && gameData.bannedNicknames.includes(gameData.nickname))) {
    gameData.isBanned = true;
    let banScreen = document.getElementById('global-ban-screen');
    if (banScreen) banScreen.style.display = 'flex';
}

const scoreEl = document.getElementById('score');
const coinEl = document.getElementById('coin');
const energyTextEl = document.getElementById('energy-text');
const energyFillEl = document.getElementById('energy-fill');
const mainAvatarEl = document.getElementById('main-avatar');
const frameWrapperEl = document.getElementById('profile-frame-wrapper');

function getTapPower() { return 1 + (gameData.boostTapLvl - 1) * 2; }
function getMaxEnergy() {
    if (gameData.customMaxEnergy > 0) return gameData.customMaxEnergy;
    let max = 5000 + (gameData.boostEnergyLvl - 1) * 50;
    if (max > 25000000) max = 25000000;
    return max;
}
function getRegenPower() { return 15 + (gameData.boostRegenLvl - 1) * 1.5; }
function getAutoClickPower() { return gameData.boostAutoLvl * 5000; }
function getBusinessRevenuePerSecond() {
    let total = 0;
    businessItems.forEach(b => { total += b.profit * (gameData.business[b.id] || 0); });
    return total;
}
function getTotalPassive() { return getBusinessRevenuePerSecond() + getAutoClickPower(); }

function getBoosterPrice(type, currentLvl) {
    if (type === 'tap') return Math.floor(currentLvl * 150000);
    if (type === 'auto') return Math.floor(250 * Math.pow(1.18, currentLvl));
    if (type === 'energy') return Math.floor(currentLvl * 120000);
    if (type === 'regen') return Math.floor(currentLvl * 90000);
    return Infinity;
}

function saveData() {
    allUsersData[currentUserId] = gameData;
    localStorage.setItem('grand_coin_all_users', JSON.stringify(allUsersData));
}

function addEarningToHistory(amount) {
    if (amount <= 0) return;
    if (!gameData.earningsHistory) gameData.earningsHistory = [];
    let today = new Date().toISOString().slice(0, 10);
    let lastEntry = gameData.earningsHistory[gameData.earningsHistory.length - 1];
    if (lastEntry && lastEntry.date === today) {
        lastEntry.amount += amount;
    } else {
        gameData.earningsHistory.push({ date: today, amount: amount });
    }
    let cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    let cutoffStr = cutoff.toISOString().slice(0, 10);
    gameData.earningsHistory = gameData.earningsHistory.filter(entry => entry.date >= cutoffStr);
    saveData();
}

function getLast14DaysEarnings() {
    if (!gameData.earningsHistory) return 0;
    let total = 0;
    for (let entry of gameData.earningsHistory) total += entry.amount;
    return total;
}

function addCoins(amount, source = "game") {
    if (amount <= 0) return;
    
    gameData.score += amount;
    gameData.totalEarned += amount;
    addEarningToHistory(amount);
    
    if (gameData.invitedBy) {
        let referrer = allUsersData[gameData.invitedBy];
        if (referrer) {
            let rate = getCurrentReferralRate();
            let bonus = Math.floor(amount * rate);
            if (bonus > 0) {
                referrer.score += bonus;
                referrer.referralEarnings += bonus;
                referrer.totalEarned += bonus;
                if (!referrer.earningsHistory) referrer.earningsHistory = [];
                let today = new Date().toISOString().slice(0, 10);
                let lastEntryRef = referrer.earningsHistory[referrer.earningsHistory.length - 1];
                if (lastEntryRef && lastEntryRef.date === today) {
                    lastEntryRef.amount += bonus;
                } else {
                    referrer.earningsHistory.push({ date: today, amount: bonus });
                }
                allUsersData[gameData.invitedBy] = referrer;
                if (localStorage.getItem('grand_coin_current_user') === gameData.invitedBy) {
                    setTimeout(() => {
                        let msg = document.createElement('div');
                        msg.className = 'leaderboard-footer';
                        msg.innerText = `🎉 Реферальный бонус: +${bonus} G (${rate*100}% от дохода)`;
                        document.body.appendChild(msg);
                        setTimeout(() => msg.remove(), 3000);
                    }, 100);
                }
            }
        }
    }
    
    saveData();
    updateUI();
}

function saveNickname() {
    let newNick = document.getElementById('player-nickname').value.trim();
    if (!newNick) newNick = "Игрок_" + Math.floor(Math.random() * 10000);
    gameData.nickname = newNick;
    saveData();
    updateUI();
}

function copyReferralLink() {
    let input = document.getElementById('ref-link-display');
    if (input) {
        input.select();
        navigator.clipboard.writeText(input.value);
        alert("Ссылка скопирована!");
    }
}

function updateLeaderboard() {
    let container = document.getElementById('leaderboard-list');
    if (!container) return;
    
    let leaderboard = [];
    for (let userId in allUsersData) {
        let user = allUsersData[userId];
        if (user && !user.isBanned && user.nickname) {
            let earnings14d = 0;
            if (user.earningsHistory) {
                for (let entry of user.earningsHistory) earnings14d += entry.amount;
            }
            leaderboard.push({ userId: userId, nickname: user.nickname, earnings: earnings14d });
        }
    }
    
    leaderboard.sort((a, b) => b.earnings - a.earnings);
    let top20 = leaderboard.slice(0, 20);
    
    container.innerHTML = "";
    for (let i = 0; i < top20.length; i++) {
        let player = top20[i];
        let rank = i + 1;
        let item = document.createElement('div');
        item.className = 'leaderboard-item';
        if (rank === 1) item.classList.add('top-1');
        else if (rank === 2) item.classList.add('top-2');
        else if (rank === 3) item.classList.add('top-3');
        if (player.userId === currentUserId) item.classList.add('leaderboard-self');
        item.innerHTML = `<div class="leaderboard-rank">#${rank}</div><div class="leaderboard-name">${escapeHtml(player.nickname)}</div><div class="leaderboard-score">${Math.floor(player.earnings).toLocaleString()} G</div>`;
        container.appendChild(item);
    }
    
    if (top20.length === 0) container.innerHTML = '<div style="text-align:center; padding:20px;">Пока нет данных. Начните зарабатывать монеты!</div>';
    
    let myIndex = leaderboard.findIndex(p => p.userId === currentUserId);
    let myEarnings = getLast14DaysEarnings();
    let footer = document.querySelector('.leaderboard-footer');
    if (footer) {
        if (myIndex !== -1) footer.innerHTML = `📊 Ваше место: #${myIndex + 1} | За 14 дней: ${Math.floor(myEarnings).toLocaleString()} G | Обновляется раз в минуту`;
        else footer.innerHTML = `📊 За 14 дней: ${Math.floor(myEarnings).toLocaleString()} G | Обновляется раз в минуту`;
    }
}

function buildBusinessList() {
    let container = document.getElementById('business-container');
    if (!container) return;
    container.innerHTML = "";
    businessItems.forEach(b => {
        let owned = gameData.business[b.id] || 0;
        let card = document.createElement('div');
        card.className = "biz-card";
        card.onclick = () => openBusinessSheet(b.id);
        card.innerHTML = `<div class="biz-info"><h3>${b.icon} ${b.name}</h3><p>Куплено: <b>${owned} шт.</b></p></div>
                          <div style="text-align:right;"><div class="biz-profit-badge">+${b.profit.toLocaleString()} G/c</div>
                          <div style="font-size:11px; color:#ffd700;">Цена: ${b.price.toLocaleString()}</div></div>`;
        container.appendChild(card);
    });
}

function openBusinessSheet(id) {
    let biz = businessItems.find(b => b.id === id);
    if (!biz) return;
    document.getElementById('sheet-biz-title').innerHTML = `${biz.icon} ${biz.name}`;
    document.getElementById('sheet-biz-desc').innerText = biz.desc;
    document.getElementById('sheet-biz-price').innerText = `${biz.price.toLocaleString()} G`;
    document.getElementById('sheet-biz-sec').innerHTML = `<span style="color:#2ecc71;">+${biz.profit} G/c</span>`;
    document.getElementById('sheet-biz-owned').innerText = `${gameData.business[biz.id] || 0} шт.`;
    let btn = document.getElementById('sheet-biz-buy-btn');
    btn.onclick = () => {
        if (gameData.score >= biz.price) {
            gameData.score -= biz.price;
            gameData.business[biz.id] = (gameData.business[biz.id] || 0) + 1;
            saveData();
            updateUI();
            openBusinessSheet(id);
        } else alert("Недостаточно монет!");
    };
    document.getElementById('biz-sheet-overlay').style.display = 'block';
    setTimeout(() => document.getElementById('biz-sheet').classList.add('open'), 10);
}

function closeBusinessSheet() {
    document.getElementById('biz-sheet').classList.remove('open');
    setTimeout(() => document.getElementById('biz-sheet-overlay').style.display = 'none', 300);
}

function buildAvatarShop() {
    let container = document.getElementById('avatar-shop-list');
    if (!container) return;
    container.innerHTML = "";
    avatarItems.forEach(item => {
        let owned = gameData.ownedAvatars.includes(item.id);
        let active = gameData.currentAvatarId === item.id;
        let btnHtml = "";
        if (active) btnHtml = `<button class="btn-avatar-action btn-avatar-active">✅ Надет</button>`;
        else if (owned) btnHtml = `<button class="btn-avatar-action btn-avatar-equip" onclick="equipAvatar(${item.id})">🔧 Надеть</button>`;
        else btnHtml = `<button class="btn-avatar-action btn-avatar-buy" onclick="buyAvatar(${item.id}, ${item.price})">${item.price.toLocaleString()} G</button>`;
        let card = document.createElement('div');
        card.className = "shop-avatar-card";
        card.innerHTML = `<div style="display:flex; gap:8px; align-items:center;">
                            <div class="avatar-frame-wrapper ${item.frameClass}" style="width:38px; height:38px; padding:2px; margin:0;">
                                <div class="avatar-display-box" style="${item.style || ''}; font-size:18px;">${item.emoji}</div>
                            </div>
                            <div><b>${item.name}</b></div>
                          </div>${btnHtml}`;
        container.appendChild(card);
    });
}

function buyAvatar(id, price) {
    if (gameData.score >= price) {
        gameData.score -= price;
        gameData.ownedAvatars.push(id);
        saveData();
        updateUI();
    } else alert("Недостаточно монет!");
}

function equipAvatar(id) {
    gameData.currentAvatarId = id;
    saveData();
    updateUI();
}

function toggleShopMenu() {
    let content = document.querySelector('.shop-accordion-content');
    let arrow = document.getElementById('arrow-av');
    if (content && arrow) {
        if (content.style.display === 'flex') {
            content.style.display = 'none';
            arrow.innerText = "▼";
        } else {
            content.style.display = 'flex';
            arrow.innerText = "▲";
        }
    }
}

function renderDailyCalendar() {
    let container = document.getElementById('daily-days-container');
    if (!container) return;
    container.innerHTML = "";
    let canClaim = (Date.now() - gameData.dailyLastClaimTime) >= 24 * 3600 * 1000;
    for (let d = 1; d <= 31; d++) {
        let reward = getCalendarRewardInfo(d);
        let box = document.createElement('div');
        box.className = "daily-day-box";
        if (d < gameData.dailyCurrentDay) box.classList.add('completed');
        else if (d === gameData.dailyCurrentDay) box.classList.add('current');
        else box.classList.add('locked');
        box.innerHTML = `<div class="bonus-title">День ${d}</div><div class="bonus-desc">${reward.label}</div>`;
        container.appendChild(box);
    }
    let btn = document.getElementById('btn-claim-daily');
    if (!canClaim) {
        btn.disabled = true;
        let diff = (24 * 3600 * 1000) - (Date.now() - gameData.dailyLastClaimTime);
        let h = Math.floor(diff / 3600000);
        let m = Math.floor((diff % 3600000) / 60000);
        btn.innerText = `⏳ Доступно через: ${h}ч ${m}м`;
    } else {
        btn.disabled = false;
        btn.innerText = `🎁 Забрать награду (День ${gameData.dailyCurrentDay})`;
    }
}

function claimDailyReward() {
    let now = Date.now();
    if ((now - gameData.dailyLastClaimTime) < 24 * 3600 * 1000) return;
    let day = gameData.dailyCurrentDay;
    let reward = getCalendarRewardInfo(day);
    if (reward.type === "coins") {
        addCoins(reward.val, "daily");
    } else if (reward.type === "upgrade") {
        if (reward.target === "tap") gameData.boostTapLvl = Math.min(1000, gameData.boostTapLvl + reward.val);
        if (reward.target === "regen") gameData.boostRegenLvl = Math.min(1000, gameData.boostRegenLvl + reward.val);
        if (reward.target === "energy") gameData.boostEnergyLvl = Math.min(1000, gameData.boostEnergyLvl + reward.val);
        saveData();
    }
    gameData.dailyLastClaimTime = now;
    gameData.dailyCurrentDay = (day >= 31) ? 1 : day + 1;
    saveData();
    updateUI();
    alert("Награда получена!");
}

function buyBooster(type) {
    if (type === 'tap') {
        let price = getBoosterPrice('tap', gameData.boostTapLvl);
        if (gameData.score >= price && gameData.boostTapLvl < 1000) {
            gameData.score -= price;
            gameData.boostTapLvl++;
        } else { alert("Недостаточно монет!"); return; }
    } else if (type === 'auto') {
        let price = getBoosterPrice('auto', gameData.boostAutoLvl);
        if (gameData.score >= price && gameData.boostAutoLvl < 1000) {
            gameData.score -= price;
            gameData.boostAutoLvl++;
        } else { alert("Недостаточно монет!"); return; }
    } else if (type === 'energy') {
        let price = getBoosterPrice('energy', gameData.boostEnergyLvl);
        if (gameData.score >= price && gameData.boostEnergyLvl < 1000) {
            gameData.score -= price;
            gameData.boostEnergyLvl++;
        } else { alert("Недостаточно монет!"); return; }
    } else if (type === 'regen') {
        let price = getBoosterPrice('regen', gameData.boostRegenLvl);
        if (gameData.score >= price && gameData.boostRegenLvl < 1000) {
            gameData.score -= price;
            gameData.boostRegenLvl++;
        } else { alert("Недостаточно монет!"); return; }
    }
    saveData();
    updateUI();
}

function updateUI() {
    if (gameData.isBanned) return;
    
    scoreEl.innerText = Math.floor(gameData.score).toLocaleString();
    let maxE = getMaxEnergy();
    energyTextEl.innerText = `${Math.floor(gameData.energy).toLocaleString()} / ${maxE.toLocaleString()}`;
    energyFillEl.style.width = `${(gameData.energy / maxE) * 100}%`;
    
    document.getElementById('boost-tap-lvl').innerText = `Уровень: ${gameData.boostTapLvl}`;
    let tapPrice = getBoosterPrice('tap', gameData.boostTapLvl);
    let tapBtn = document.getElementById('btn-buy-tap');
    tapBtn.innerText = tapPrice.toLocaleString();
    tapBtn.disabled = gameData.score < tapPrice;
    
    document.getElementById('boost-auto-lvl').innerText = `Уровень: ${gameData.boostAutoLvl}`;
    let autoPrice = getBoosterPrice('auto', gameData.boostAutoLvl);
    let autoBtn = document.getElementById('btn-buy-auto');
    autoBtn.innerText = autoPrice.toLocaleString();
    autoBtn.disabled = gameData.score < autoPrice;
    
    document.getElementById('boost-energy-lvl').innerText = `Уровень: ${gameData.boostEnergyLvl}`;
    let energyPrice = getBoosterPrice('energy', gameData.boostEnergyLvl);
    let energyBtn = document.getElementById('btn-buy-energy');
    energyBtn.innerText = energyPrice.toLocaleString();
    energyBtn.disabled = gameData.score < energyPrice;
    
    document.getElementById('boost-regen-lvl').innerText = `Уровень: ${gameData.boostRegenLvl}`;
    let regenPrice = getBoosterPrice('regen', gameData.boostRegenLvl);
    let regenBtn = document.getElementById('btn-buy-regen');
    regenBtn.innerText = regenPrice.toLocaleString();
    regenBtn.disabled = gameData.score < regenPrice;
    
    let totalPassive = getTotalPassive();
    document.getElementById('auto-timer').innerText = `Пассивный доход: +${totalPassive.toLocaleString()} G/c`;
    document.getElementById('stat-tap').innerText = `${getTapPower().toLocaleString()} G`;
    document.getElementById('stat-maxenergy').innerText = getMaxEnergy().toLocaleString();
    document.getElementById('stat-regen').innerText = `${Math.floor(getRegenPower()).toLocaleString()} / сек`;
    document.getElementById('stat-bot').innerText = `${getAutoClickPower().toLocaleString()} G/c`;
    document.getElementById('stat-biz-income').innerText = `${getBusinessRevenuePerSecond().toLocaleString()} G/c`;
    document.getElementById('stat-pps').innerText = `${totalPassive.toLocaleString()} G/c`;
    
    let currentAv = avatarItems.find(a => a.id === gameData.currentAvatarId) || avatarItems[0];
    if (mainAvatarEl) {
        mainAvatarEl.textContent = currentAv.emoji;
        mainAvatarEl.style = currentAv.style || "";
    }
    if (frameWrapperEl) frameWrapperEl.className = "avatar-frame-wrapper " + (currentAv.frameClass || "");
    
    let rootUrl = window.location.origin + window.location.pathname;
    let refLinkInput = document.getElementById('ref-link-display');
    if (refLinkInput) refLinkInput.value = `${rootUrl}?ref=${gameData.userId}`;
    document.getElementById('ref-count-val').innerText = gameData.referralsCount;
    document.getElementById('ref-earned-val').innerText = Math.floor(gameData.referralEarnings).toLocaleString();
    
    let rate = getCurrentReferralRate();
    let rateText = (rate === 0.15) ? "15% (СУББОТА!) 🔥" : "7% (обычный день)";
    document.getElementById('ref-rate-display').innerHTML = `📊 Ставка сегодня: ${rateText}`;
    
    let topHeader = document.getElementById('admin-top-header');
    let profTitle = document.getElementById('prof-title');
    if (gameData.adminLevel > 0) {
        if (topHeader) topHeader.style.display = "block";
        if (gameData.adminLevel === 5) {
            if (topHeader) topHeader.innerText = "👑 Главный Разработчик (Lvl 5)";
            if (profTitle) profTitle.innerText = "Создатель";
        } else if (gameData.adminLevel === 2) {
            if (topHeader) topHeader.innerText = "⚙️ Администратор (Lvl 2)";
            if (profTitle) profTitle.innerText = "Администратор";
        } else {
            if (topHeader) topHeader.innerText = "🛡️ Модератор (Lvl 1)";
            if (profTitle) profTitle.innerText = "Модератор";
        }
    } else {
        if (topHeader) topHeader.style.display = "none";
        if (profTitle) profTitle.innerText = "Предприниматель";
    }
    
    buildBusinessList();
    buildAvatarShop();
    renderDailyCalendar();
    updateLeaderboard();
}

function checkUrlReferral() {
    let params = new URLSearchParams(window.location.search);
    let refUserId = params.get('ref');
    
    if (refUserId && refUserId !== gameData.userId && !gameData.invitedBy) {
        let referrer = allUsersData[refUserId];
        if (referrer) {
            gameData.invitedBy = refUserId;
            referrer.referralsCount = (referrer.referralsCount || 0) + 1;
            allUsersData[refUserId] = referrer;
            saveData();
            gameData.score += 10000;
            gameData.totalEarned += 10000;
            addEarningToHistory(10000);
            alert(`🎉 Вы перешли по реферальной ссылке от ${referrer.nickname}! +10 000 G на баланс!`);
            updateUI();
        }
    }
}

function switchPage(pageId, element) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    let profBtn = document.getElementById('nav-prof-btn');
    if (profBtn) profBtn.classList.remove('active');
    let page = document.getElementById(`page-${pageId}`);
    if (page) page.classList.add('active');
    if (element) element.classList.add('active');
    updateUI();
}

function escapeHtml(str) {
    if (!str) return "Игрок";
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ОБРАБОТЧИКИ СОБЫТИЙ
if (coinEl) {
    coinEl.addEventListener('click', (e) => {
        if (gameData.isBanned) return;
        let power = getTapPower();
        if (gameData.energy >= power) {
            gameData.energy -= power;
            addCoins(power, "click");
            let plus = document.createElement('div');
            plus.className = 'plus-one';
            plus.innerText = `+${power.toLocaleString()}`;
            let rect = coinEl.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            plus.style.left = `${x}px`;
            plus.style.top = `${y}px`;
            document.querySelector('.coin-container').appendChild(plus);
            setTimeout(() => plus.remove(), 800);
            updateUI();
        }
    });
}

setInterval(() => {
    if (gameData.isBanned) return;
    let income = getTotalPassive();
    if (income > 0) addCoins(income, "passive");
    let maxE = getMaxEnergy();
    if (gameData.isInfiniteEnergy) gameData.energy = maxE;
    else if (gameData.energy < maxE) gameData.energy = Math.min(maxE, gameData.energy + getRegenPower());
    saveData();
    updateUI();
}, 1000);

setInterval(() => updateLeaderboard(), 60000);

function handleAdminClick() {
    if (gameData.adminLevel > 0) showAdminModal();
    else {
        let modal = document.getElementById('login-modal');
        if (modal) modal.style.display = 'flex';
    }
}

function closeModal(id) {
    let modal = document.getElementById(id);
    if (modal) modal.style.display = 'none';
}

function showAdminModal() {
    let panelTitle = document.getElementById('admin-panel-title');
    if (panelTitle) panelTitle.innerHTML = `Панель управления (Уровень ${gameData.adminLevel})`;
    let modal = document.getElementById('admin-modal');
    if (modal) modal.style.display = 'flex';
    let infChk = document.getElementById('adm-infinite-energy');
    if (infChk) infChk.checked = gameData.isInfiniteEnergy;
}

function tryLogin() {
    let login = document.getElementById('adm-login').value;
    let pass = document.getElementById('adm-pass').value;
    if (login === "grand4" && pass === "STRELNIKOV") {
        gameData.adminLevel = 5;
        if (!gameData.ownedAvatars.includes(99)) gameData.ownedAvatars.push(99);
        gameData.currentAvatarId = 99;
        closeModal('login-modal');
        showAdminModal();
        saveData();
        updateUI();
    } else if (login === "admin2" && pass === "GRAND2026") {
        gameData.adminLevel = 2;
        closeModal('login-modal');
        showAdminModal();
        saveData();
        updateUI();
    } else if (login === "moderator" && pass === "MODER123") {
        gameData.adminLevel = 1;
        closeModal('login-modal');
        showAdminModal();
        saveData();
        updateUI();
    } else alert("Неверный логин или пароль!");
}

function adminLogout() {
    gameData.adminLevel = 0;
    saveData();
    updateUI();
    closeModal('admin-modal');
}

function adminAddCustomMoney() {
    let val = parseInt(document.getElementById('adm-money-amount').value);
    if (!isNaN(val) && val > 0) {
        addCoins(val, "admin");
        alert(`Выдано ${val.toLocaleString()} монет!`);
    }
}

function adminCreatePromoCode() {
    let code = document.getElementById('adm-promo-code').value.trim();
    let reward = parseInt(document.getElementById('adm-promo-reward').value);
    let uses = parseInt(document.getElementById('adm-promo-uses').value);
    if (!code || reward <= 0 || uses <= 0) { alert("Заполните все поля!"); return; }
    globalPromos[code] = { reward: reward, uses: uses };
    localStorage.setItem('grand_global_promos', JSON.stringify(globalPromos));
    alert(`Промокод "${code}" создан!\nНаграда: ${reward} монет\nАктиваций: ${uses}`);
    document.getElementById('adm-promo-code').value = "";
    document.getElementById('adm-promo-reward').value = "";
    document.getElementById('adm-promo-uses').value = "";
}

function adminGiveAllAvatars() {
    avatarItems.forEach(item => { if (!gameData.ownedAvatars.includes(item.id)) gameData.ownedAvatars.push(item.id); });
    saveData(); updateUI(); alert("Все аватарки и ободки выданы!");
}

function adminGiveAllUpgrades() {
    gameData.boostTapLvl = 50; gameData.boostEnergyLvl = 50; gameData.boostRegenLvl = 50;
    saveData(); updateUI(); alert("Прокачка выдана (50 ур)!");
}

function adminGiveUltimateMax() {
    gameData.boostTapLvl = 1000; gameData.boostEnergyLvl = 1000; gameData.boostRegenLvl = 1000;
    gameData.boostAutoLvl = 500; gameData.customMaxEnergy = 0; gameData.energy = getMaxEnergy();
    saveData(); updateUI(); alert("Максимальная прокачка выдана!");
}

function toggleInfiniteEnergy() {
    let chk = document.getElementById('adm-infinite-energy');
    if (chk) gameData.isInfiniteEnergy = chk.checked;
    if (gameData.isInfiniteEnergy) gameData.energy = getMaxEnergy();
    saveData(); updateUI();
}

function adminRestoreEnergy() {
    gameData.energy = getMaxEnergy();
    saveData(); updateUI();
    alert("Энергия восстановлена!");
}

function adminBanAndResetByNickname() {
    let nick = document.getElementById('adm-ban-nickname').value.trim();
    if (!nick) { alert("Введите никнейм!"); return; }
    if (!gameData.bannedNicknames.includes(nick)) gameData.bannedNicknames.push(nick);
    if (gameData.nickname === nick) {
        gameData.isBanned = true;
        gameData.score = 0;
        gameData.business = { shaurma: 0, coffee: 0, carwash: 0, computer: 0, crypto: 0, hotel: 0, oil: 0, space: 0 };
        gameData.boostTapLvl = 1; gameData.boostEnergyLvl = 1; gameData.boostRegenLvl = 1; gameData.boostAutoLvl = 0;
        gameData.isInfiniteEnergy = false; gameData.customMaxEnergy = 0; gameData.referralsCount = 0;
        saveData();
        closeModal('admin-modal');
        let banScreen = document.getElementById('global-ban-screen');
        if (banScreen) banScreen.style.display = 'flex';
        alert(`Игрок ${nick} забанен и обнулён!`);
    } else { saveData(); alert(`Никнейм "${nick}" добавлен в бан-лист.`); }
}

// ИНИЦИАЛИЗАЦИЯ
let nickInput = document.getElementById('player-nickname');
if (nickInput) nickInput.value = gameData.nickname;
checkUrlReferral();
updateUI();