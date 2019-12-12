const main = document.querySelector('.page__main');
let settingsComponent = null; // компонент настроек
let gameComponent = null; // компонент игры
let resultComponent = null; // компонент результатов
let settingsForm = null; // форма настроек
const settings = { // объект для настроек игры
  regime: null,
  multipliers: null,
  present: null,
  infinite: null
};
let selectAllBtn = null;
let multiplicators = null;
// Экран игры
let exitBtn = null;
let nextBtn = null;
let gameForm = null;
let multiplicator_1 = null;
let multiplicator_2 = null;
let mult_result = null;
//////////////////////////

// ОБЩИЙ СТЕЙТ игры
const state = {
  stage: null,
  settings: null,
  expressions: null,
  errorGameMessage: ''
};

// Объект примера
const expression = {
  mult_1: null,
  mult_2: null,
  response: null
};

// Запись в стейт
const setState = (key, val) => {
  state[key] = val;
};

// Читаем из стейта
const getStateKey = (key) => {
  return state[key] ? state[key] : null;
};

// Перемешиваем массив примеров
const shuffleArray = (array) => {
  const copiedArray = array;
  for (let i = copiedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
  }
  return copiedArray;
};

// Функция по генерации набора примероа
const generateNumbers = (arr, mixed = false) => {
  // В стейт записывается тоже из места вызова
  // А если рандомное расположение чисел, то можно будет случайно генерировать: в mult_1 или mult_2
  const numArr = [];
  const amount = 10;
  arr.forEach((num) => {
    for (let i = 1; i <= amount; i++) {
      const expr = Object.assign({}, expression);
      let num_list = [num, i];
      if (mixed) {
        num_list = shuffleArray(num_list.slice());
      }
      expr.mult_1 = Number(num_list[0]);
      expr.mult_2 = Number(num_list[1]);
      expr.response = num * i;
      numArr.push(expr);
    }
  });
  return numArr;
};

// Сброс обраб-в с экрана настроек
const removeSettingsListeners = () => {
  settingsForm.removeEventListener('submit', settingsFormSubmitHandler);
  selectAllBtn.removeEventListener('click', selectAllBtnClickHandler);
};

// Сброс обраб-в с элементов экрана игры
const removeGameScreenListeners = () => {
  exitBtn.removeEventListener('click', exitBtnClickHandler);
  nextBtn.removeEventListener('click', nextBtnClickHandler);
};

// Обработчик клика по кнопке "Выйти"
const exitBtnClickHandler = (evt) => {
  evt.preventDefault();
  renderSettingsScreen();
  setState('stage', 'settings');
  setState('settings', null);
  setState('expressions', null);
  setState('errorGameMessage', '');
  removeGameScreenListeners();
};

// Обработчик клика по кнопке "Следующий"
const nextBtnClickHandler = (evt) => {
  evt.preventDefault();
  console.log('next');
};

// Вешаем обработчики на элементы экрана игры
const initGameScreen = () => {
  gameComponent = document.querySelector('.game-screen');
  exitBtn = gameComponent.querySelector('.game-screen__exit-btn');
  nextBtn = gameComponent.querySelector('.game-screen__next-btn');
  gameForm = gameComponent.querySelector('.game__form');
  multiplicator_1 = gameComponent.querySelector('.mult-1');
  multiplicator_2 = gameComponent.querySelector('.mult-2');
  mult_result = gameComponent.querySelector('.mult-result');
  // Обработчики
  exitBtn.addEventListener('click', exitBtnClickHandler);
  nextBtn.addEventListener('click', nextBtnClickHandler);
};

// Рендерим экран игры
const renderGameScreen = () => {
  main.innerHTML = '';
  const gameScreen = renderGameScreenEl(state.expressions[0]);
  main.appendChild(gameScreen);
  initGameScreen();
};

// Старт игры
const startGame = () => {
  // Меняем состояние игры
  setState('stage', 'game');
  // Получаем настройки
  const currSet = getStateKey('settings');
  // console.log(currSet);
  // Генерируем набор примеров в соотв-вии с настройками
  if (currSet.infinite === 'on') {
    setState('errorGameMessage', 'Этот режим игры ещё не реализован');
  } else if (currSet.regime === 'lesson') {
    // Готовим примеры для отобр-ния
    const rand = currSet.present === 'random';
    let expressions = generateNumbers(currSet.multipliers);
    if (rand) {
      expressions = shuffleArray(expressions.slice())
    }
    setState('expressions', expressions);
    console.log(expressions);
  } else if (currSet.regime === 'exam') {
    setState('errorGameMessage', 'Этот режим игры ещё не реализован');
  } else {
    setState('errorGameMessage', 'Что-то пошло не так');
  }
  // Генерируем и меняем экран
  renderGameScreen();
};

// Обработчик сабмита формы настроек
const settingsFormSubmitHandler = (evt) => {
  evt.preventDefault();
  // Собираем настройки и записываем в объект
  const data = new FormData(settingsForm);
  const settingsObj = Object.assign({}, settings);
  settingsObj.regime = data.get('regime');
  settingsObj.multipliers = data.getAll('multipliers');
  settingsObj.present = data.get('present');
  settingsObj.infinite = data.get('infinite');
  state.settings = settingsObj;
  // Сброс обработчиков с экрана настроек
  removeSettingsListeners();
  // Запускаем игру
  startGame();
};

// Рендерим экран результатов
const renderResultScreen = () => {
  main.appendChild(renderResultScreesEl());
  resultComponent = document.querySelector('.results');
  // Обработчики эл-тов в компоненте
  // gameScreenInit();
};

// Обработчик клика по кнопке "Выбрать все (множители)"
const selectAllBtnClickHandler = (evt) => {
  evt.preventDefault();
  // Отмечаем все чекбоксы
  multiplicators.forEach((it) => {
    if (!it.checked) {
      it.checked = true;
    }
  });
};

// Вешаем обработчики на элементы экрана настроек
const initSettingsScreen = () => {
  settingsComponent = document.querySelector('.settings');
  settingsForm = settingsComponent.querySelector('.settings__form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', settingsFormSubmitHandler);
    // Кнопка Выбрать все и мультипликаторы
    selectAllBtn = settingsComponent.querySelector('.multiplier__all');
    selectAllBtn.addEventListener('click', selectAllBtnClickHandler);
    multiplicators = settingsComponent.querySelectorAll('.multiplier__check');
  }
};

// Рендерим экран настроек
const renderSettingsScreen = () => {
  main.innerHTML = '';
  main.appendChild(renderSettingsEl());
  setState('stage', 'settings');
  initSettingsScreen();
};

// Запуск игры
const start = () => {
  renderSettingsScreen(); // Рендерим экран настроек
  // renderResultScreen();
};

start();
