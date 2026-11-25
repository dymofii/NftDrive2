export type LanguageCode = 'uk' | 'en' | 'ru' | 'pl';

export interface LanguageMeta {
  code: LanguageCode;
  shortLabel: string;
  name: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'uk', shortLabel: 'UA', name: 'Українська' },
  { code: 'en', shortLabel: 'EN', name: 'English' },
  { code: 'ru', shortLabel: 'RU', name: 'Русский' },
  { code: 'pl', shortLabel: 'PL', name: 'Polski' },
];

export interface Translations {
  // Title Screen
  subtitle: string;
  description: string;
  continueBtn: string;
  newGameBtn: string;
  startBtn: string;
  savedGarageInfo: (money: string, count: number) => string;
  controlHintTitle: string;

  // HUD
  balance: string;
  income: string;
  garage: string;
  goal: string;
  upgrades: string;
  pause: string;
  muteOn: string;
  muteOff: string;
  perSec: string;

  // Conveyor
  conveyorTitle: string;
  conveyorSubtitle: string;
  rerollCooldown: (sec: number) => string;
  rerollBtn: string;
  minterBonus: string;
  noSlots: string;
  buyBtn: string;
  noFunds: string;

  // Garage
  garageTitle: string;
  garageSubtitle: string;
  occupiedCount: (used: number, max: number) => string;
  lvlShort: string;
  sellTitle: (price: string) => string;
  limitedEdition: string;
  boostBtn: string;
  slotLabel: (num: number) => string;
  dropHere: string;
  notEnoughFunds: string;
  dragCarHere: string;
  mergeInto: (lvl: number) => string;
  swapSlots: string;

  // Catch Minigame
  difficultyLabel: string;
  catchTitle: (name: string) => string;
  priceOnSuccess: string;
  holdAnywhere: string;
  spaceHint: string;
  catchRules: string;
  cancelPurchase: string;

  // Upgrades
  upgradesTitle: string;
  availableBalance: string;
  currentEffect: string;
  maxLevel: string;
  upgradeBtn: (cost: string) => string;
  upgradeNames: Record<string, { title: string; desc: string }>;
  effectSlots: (n: number) => string;
  effectSpeed: (pct: number) => string;
  effectZone: (pct: number) => string;
  effectLevel: (lvl: number) => string;

  // Pause & Milestone
  pausedTitle: string;
  pausedSubtitle: string;
  currentBalance: string;
  passiveIncome: string;
  totalEarned: string;
  boughtMerged: string;
  resumeBtn: string;
  returnTitleBtn: string;
  resetProgressBtn: string;

  victoryTitle: string;
  victoryDesc: (goal: string) => string;
  totalEarnedLabel: string;
  incomeSpeedLabel: string;
  carsBoughtLabel: string;
  mergesLabel: string;
  playAgainBtn: string;

  // Toasts & Flyers
  flyToGarage: (name: string) => string;
  toastGarageFull: string;
  toastSlotOccupied: string;
  toastNeedMore: (amount: string) => string;
  toastSecretCaught: (name: string) => string;
  toastEscaped: string;
  toastMerged: (name: string, lvl: number) => string;
  toastSold: (amount: string) => string;
  toastNoMoneyUpgrade: string;
  toastUpgraded: (name: string, lvl: number) => string;
  boostWord: string;

  // Car localized specs
  carSpecs: Record<string, string>;
}

const UK: Translations = {
  subtitle: 'СИМУЛЯТОР КОЛЕКЦІЙНОГО КОНВЕЄРА',
  description:
    'Ловіть фото рідкісних автомобілів на стрічці конвеєра, перетягуйте їх у свій гараж, обʼєднуйте однакові моделі та нарощуйте пасивний дохід щосекунди.',
  continueBtn: 'Продовжити гру',
  newGameBtn: 'Нова гра',
  startBtn: 'Почати гру',
  savedGarageInfo: (m, c) => `Збережений гараж · ${m} · ${c} авто`,
  controlHintTitle:
    'Клік або перетягування — купити авто · Перетягніть авто на таке саме — обʼєднати · Пробіл — старт · Esc — пауза',

  balance: 'Баланс',
  income: 'Прибуток',
  garage: 'Гараж',
  goal: 'Ціль колекції',
  upgrades: 'Покращення',
  pause: 'Пауза',
  muteOn: 'Увімкнути звук',
  muteOff: 'Вимкнути звук',
  perSec: '/сек',

  conveyorTitle: 'Аукціонний конвеєр',
  conveyorSubtitle: 'Натисніть або перетягніть фото в гараж нижче',
  rerollCooldown: (s) => `Оновлення (${s}с)`,
  rerollBtn: 'Нова партія',
  minterBonus: 'Мінт +25%',
  noSlots: 'Місць нема',
  buyBtn: 'Купити',
  noFunds: 'Мало коштів',

  garageTitle: 'Гараж колекціонера',
  garageSubtitle: 'Клік по авто дає миттєвий бонус · Перетягніть два однакових авто для обʼєднання',
  occupiedCount: (u, m) => `Зайнято ${u} з ${m}`,
  lvlShort: 'Рів.',
  sellTitle: (p) => `Продати за ${p}`,
  limitedEdition: 'Лімітований випуск',
  boostBtn: 'Буст',
  slotLabel: (n) => `Місце ${n}`,
  dropHere: 'Відпустіть тут',
  notEnoughFunds: 'Недостатньо коштів',
  dragCarHere: 'Перетягніть авто сюди',
  mergeInto: (lvl) => `Обʼєднати → Рівень ${lvl}`,
  swapSlots: 'Поміняти місцями',

  difficultyLabel: 'Складність',
  catchTitle: (name) => `Перехоплення: ${name}`,
  priceOnSuccess: 'Ціна при успіху',
  holdAnywhere: 'Натисніть і утримуйте будь-де!',
  spaceHint: '· Пробіл',
  catchRules:
    'Утримуйте вертикальну лінію авто всередині білої зони. Якщо зірветься — гроші НЕ списуються.',
  cancelPurchase: 'Скасувати покупку',

  upgradesTitle: 'Покращення автосалону',
  availableBalance: 'Доступний баланс:',
  currentEffect: 'Поточний ефект:',
  maxLevel: 'Максимальний рівень',
  upgradeBtn: (cost) => `Покращити · ${cost}`,
  upgradeNames: {
    garage_slots: {
      title: 'Розширення гаража',
      desc: 'Додає +2 місця в інвентарі для зберігання та злиття машин.',
    },
    income_mult: {
      title: 'Дохідність колекції',
      desc: 'Підвищує пасивний прибуток усіх машин у гаражі на +20% за рівень.',
    },
    catch_zone: {
      title: 'Ширина захвату',
      desc: 'Розширює світлий сегмент у міні-грі перехоплення авто.',
    },
    belt_speed: {
      title: 'Швидкість конвеєра',
      desc: 'Прискорює рух стрічки та частоту появи нових фотографій авто.',
    },
    rare_luck: {
      title: 'Елітні поставки',
      desc: 'Підвищує шанс появи Epic, Legendary, Mythic та SECRET машин.',
    },
  },
  effectSlots: (n) => `${n} місць`,
  effectSpeed: (p) => `+${p}% темп`,
  effectZone: (p) => `+${p}% зона`,
  effectLevel: (l) => `Рівень ${l}`,

  pausedTitle: 'Гру призупинено',
  pausedSubtitle: 'Прогрес автоматично зберігається у вашому браузері.',
  currentBalance: 'Поточний баланс',
  passiveIncome: 'Пасивний дохід',
  totalEarned: 'Усього зароблено',
  boughtMerged: 'Куплено / Злито',
  resumeBtn: 'Продовжити гру',
  returnTitleBtn: 'На головний екран',
  resetProgressBtn: 'Скинути прогрес і почати заново',

  victoryTitle: 'Імперія NFT Drive зібрана',
  victoryDesc: (g) =>
    `Ви досягли мети в ${g} сумарного капіталу. Можете продовжити безкінечну колекцію або почати новий заїзд.`,
  totalEarnedLabel: 'Зароблено всього',
  incomeSpeedLabel: 'Швидкість доходу',
  carsBoughtLabel: 'Куплено машин',
  mergesLabel: 'Обʼєднань',
  playAgainBtn: 'Почати заново',

  flyToGarage: (n) => `${n} → Гараж`,
  toastGarageFull: 'Гараж заповнений! Розширте місця або обʼєднайте авто.',
  toastSlotOccupied: 'Це місце вже зайняте.',
  toastNeedMore: (a) => `Потрібно ще ${a}`,
  toastSecretCaught: (n) => `СЕКРЕТНЕ АВТО! ${n} тепер у вашому гаражі!`,
  toastEscaped: 'Авто зірвалося — $0 списано, кошти збережено!',
  toastMerged: (n, l) => `Обʼєднано! ${n} · Рівень ${l}`,
  toastSold: (a) => `Продано за ${a}`,
  toastNoMoneyUpgrade: 'Недостатньо коштів для покращення',
  toastUpgraded: (n, l) => `${n}: рівень ${l}`,
  boostWord: 'Буст',

  carSpecs: {
    city_hatch: '1.6L Turbo · Хетчбек 90-х',
    retro_coupe: '3.2L V8 · Ретро купе',
    rally_evo: 'AWD · Ралійна серія',
    jdm_tuner: 'Twin-Turbo · Стріт-спек',
    muscle_gt: '6.2L Supercharged · Вайдбоді',
    offroad_monster: '6×6 Броньований · Монстр',
    hyper_aero: 'Активна аеро · Карбон',
    prototype_gold: 'Трековий прототип',
    cyber_concept: 'Реактивна аеро · Концепт',
    banana_mobile: 'Стиглий слік-спорткар',
    toilet_kart: 'V12 Фаянсовий болід',
  },
};

const EN: Translations = {
  subtitle: 'COLLECTOR CONVEYOR SIMULATOR',
  description:
    'Catch rare car photos rolling down the auction conveyor, drag them into your garage, merge matching models, and grow your passive income every second.',
  continueBtn: 'Continue Game',
  newGameBtn: 'New Game',
  startBtn: 'Start Game',
  savedGarageInfo: (m, c) => `Saved Garage · ${m} · ${c} cars`,
  controlHintTitle:
    'Click or drag to buy · Drag matching cars together to merge · Space to start · Esc to pause',

  balance: 'Balance',
  income: 'Income',
  garage: 'Garage',
  goal: 'Collection Goal',
  upgrades: 'Upgrades',
  pause: 'Pause',
  muteOn: 'Unmute audio',
  muteOff: 'Mute audio',
  perSec: '/sec',

  conveyorTitle: 'Auction Conveyor',
  conveyorSubtitle: 'Click or drag a car photo into the garage below',
  rerollCooldown: (s) => `Refresh (${s}s)`,
  rerollBtn: 'New Batch',
  minterBonus: 'Mint +25%',
  noSlots: 'Garage full',
  buyBtn: 'Buy',
  noFunds: 'Low funds',

  garageTitle: 'Collector Garage',
  garageSubtitle: 'Click a car for an instant boost · Drag two identical cars together to merge',
  occupiedCount: (u, m) => `Used ${u} of ${m}`,
  lvlShort: 'Lv.',
  sellTitle: (p) => `Sell for ${p}`,
  limitedEdition: 'Limited Mint',
  boostBtn: 'Boost',
  slotLabel: (n) => `Slot ${n}`,
  dropHere: 'Drop here',
  notEnoughFunds: 'Not enough funds',
  dragCarHere: 'Drag car here',
  mergeInto: (lvl) => `Merge → Level ${lvl}`,
  swapSlots: 'Swap slots',

  difficultyLabel: 'Difficulty',
  catchTitle: (name) => `Intercept: ${name}`,
  priceOnSuccess: 'Cost on catch',
  holdAnywhere: 'Click & Hold Anywhere!',
  spaceHint: '· Space',
  catchRules:
    'Keep the vertical car line inside the white zone to fill the bar. Zero cost if it escapes.',
  cancelPurchase: 'Cancel purchase',

  upgradesTitle: 'Showroom Upgrades',
  availableBalance: 'Available balance:',
  currentEffect: 'Current effect:',
  maxLevel: 'Max level reached',
  upgradeBtn: (cost) => `Upgrade · ${cost}`,
  upgradeNames: {
    garage_slots: {
      title: 'Garage Expansion',
      desc: 'Adds +2 inventory slots for storing and merging more cars.',
    },
    income_mult: {
      title: 'Collection Yield',
      desc: 'Boosts passive income of all garage cars by +20% per level.',
    },
    catch_zone: {
      title: 'Control Bar Width',
      desc: 'Widens the white control segment during the car catch minigame.',
    },
    belt_speed: {
      title: 'Conveyor Speed',
      desc: 'Speeds up the belt movement and how fast new cars arrive.',
    },
    rare_luck: {
      title: 'Elite Shipments',
      desc: 'Increases spawn odds for Epic, Legendary, Mythic, and SECRET cars.',
    },
  },
  effectSlots: (n) => `${n} slots`,
  effectSpeed: (p) => `+${p}% pace`,
  effectZone: (p) => `+${p}% zone`,
  effectLevel: (l) => `Level ${l}`,

  pausedTitle: 'Game Paused',
  pausedSubtitle: 'Your progress is automatically saved in your browser.',
  currentBalance: 'Current Balance',
  passiveIncome: 'Passive Income',
  totalEarned: 'Total Earned',
  boughtMerged: 'Bought / Merged',
  resumeBtn: 'Resume Game',
  returnTitleBtn: 'Main Menu',
  resetProgressBtn: 'Reset Progress & Start Over',

  victoryTitle: 'NFT Drive Empire Complete',
  victoryDesc: (g) =>
    `You reached ${g} in total capital! Keep playing in endless mode or start a fresh run.`,
  totalEarnedLabel: 'Total Earned',
  incomeSpeedLabel: 'Income Rate',
  carsBoughtLabel: 'Cars Bought',
  mergesLabel: 'Merges',
  playAgainBtn: 'Play Again',

  flyToGarage: (n) => `${n} → Garage`,
  toastGarageFull: 'Garage is full! Expand slots or merge matching cars.',
  toastSlotOccupied: 'This slot is already occupied.',
  toastNeedMore: (a) => `Need ${a} more`,
  toastSecretCaught: (n) => `SECRET CAR! ${n} added to your garage!`,
  toastEscaped: 'Car escaped — $0 charged, your cash is safe!',
  toastMerged: (n, l) => `Merged! ${n} · Level ${l}`,
  toastSold: (a) => `Sold for ${a}`,
  toastNoMoneyUpgrade: 'Not enough funds for upgrade',
  toastUpgraded: (n, l) => `${n}: level ${l}`,
  boostWord: 'Boost',

  carSpecs: {
    city_hatch: '1.6L Turbo · 90s Hot Hatch',
    retro_coupe: '3.2L V8 · Retro Coupe',
    rally_evo: 'AWD · Rally Spec',
    jdm_tuner: 'Twin-Turbo · Street Tuned',
    muscle_gt: '6.2L Supercharged · Widebody',
    offroad_monster: '6×6 Armored · Offroad Beast',
    hyper_aero: 'Active Aero · Carbon Body',
    prototype_gold: 'Endurance Prototype',
    cyber_concept: 'Jet-Canopy · Hyper Concept',
    banana_mobile: 'Ripe Slick-Tire Roadster',
    toilet_kart: 'V12 Porcelain Formula 1',
  },
};

const RU: Translations = {
  subtitle: 'СИМУЛЯТОР КОЛЛЕКЦИОННОГО КОНВЕЙЕРА',
  description:
    'Ловите фото редких машин на ленте конвейера, перетаскивайте их в свой гараж, объединяйте одинаковые модели и увеличивайте пассивный доход каждую секунду.',
  continueBtn: 'Продолжить игру',
  newGameBtn: 'Новая игра',
  startBtn: 'Начать игру',
  savedGarageInfo: (m, c) => `Сохранённый гараж · ${m} · ${c} авто`,
  controlHintTitle:
    'Клик или перетаскивание — купить авто · Перетащите авто на такое же — объединить · Пробел — старт · Esc — пауза',

  balance: 'Баланс',
  income: 'Доход',
  garage: 'Гараж',
  goal: 'Цель коллекции',
  upgrades: 'Улучшения',
  pause: 'Пауза',
  muteOn: 'Включить звук',
  muteOff: 'Выключить звук',
  perSec: '/сек',

  conveyorTitle: 'Аукционный конвейер',
  conveyorSubtitle: 'Нажмите или перетащите фото в гараж ниже',
  rerollCooldown: (s) => `Обновление (${s}с)`,
  rerollBtn: 'Новая партия',
  minterBonus: 'Минт +25%',
  noSlots: 'Нет мест',
  buyBtn: 'Купить',
  noFunds: 'Мало средств',

  garageTitle: 'Гараж коллекционера',
  garageSubtitle: 'Клик по авто даёт мгновенный бонус · Перетащите два одинаковых авто для слияния',
  occupiedCount: (u, m) => `Занято ${u} из ${m}`,
  lvlShort: 'Ур.',
  sellTitle: (p) => `Продать за ${p}`,
  limitedEdition: 'Лимитированный выпуск',
  boostBtn: 'Буст',
  slotLabel: (n) => `Место ${n}`,
  dropHere: 'Отпустите здесь',
  notEnoughFunds: 'Недостаточно средств',
  dragCarHere: 'Перетащите авто сюда',
  mergeInto: (lvl) => `Объединить → Уровень ${lvl}`,
  swapSlots: 'Поменять местами',

  difficultyLabel: 'Сложность',
  catchTitle: (name) => `Перехват: ${name}`,
  priceOnSuccess: 'Цена при успехе',
  holdAnywhere: 'Нажмите и удерживайте в любом месте!',
  spaceHint: '· Пробел',
  catchRules:
    'Удерживайте вертикальную линию авто внутри белой зоны. При срыве деньги НЕ списываются.',
  cancelPurchase: 'Отменить покупку',

  upgradesTitle: 'Улучшения автосалона',
  availableBalance: 'Доступный баланс:',
  currentEffect: 'Текущий эффект:',
  maxLevel: 'Максимальный уровень',
  upgradeBtn: (cost) => `Улучшить · ${cost}`,
  upgradeNames: {
    garage_slots: {
      title: 'Расширение гаража',
      desc: 'Добавляет +2 места в инвентаре для хранения и слияния машин.',
    },
    income_mult: {
      title: 'Доходность коллекции',
      desc: 'Повышает пассивный доход всех машин в гараже на +20% за уровень.',
    },
    catch_zone: {
      title: 'Ширина захвата',
      desc: 'Расширяет светлый сегмент в мини-игре перехвата авто.',
    },
    belt_speed: {
      title: 'Скорость конвейера',
      desc: 'Ускоряет движение ленты и частоту появления новых фото машин.',
    },
    rare_luck: {
      title: 'Элитные поставки',
      desc: 'Повышает шанс появления Epic, Legendary, Mythic и SECRET машин.',
    },
  },
  effectSlots: (n) => `${n} мест`,
  effectSpeed: (p) => `+${p}% темп`,
  effectZone: (p) => `+${p}% зона`,
  effectLevel: (l) => `Уровень ${l}`,

  pausedTitle: 'Игра на паузе',
  pausedSubtitle: 'Прогресс автоматически сохраняется в вашем браузере.',
  currentBalance: 'Текущий баланс',
  passiveIncome: 'Пассивный доход',
  totalEarned: 'Всего заработано',
  boughtMerged: 'Куплено / Слияний',
  resumeBtn: 'Продолжить игру',
  returnTitleBtn: 'На главный экран',
  resetProgressBtn: 'Сбросить прогресс и начать заново',

  victoryTitle: 'Империя NFT Drive собрана',
  victoryDesc: (g) =>
    `Вы достигли цели в ${g} суммарного капитала. Можно продолжить бесконечную коллекцию или начать заново.`,
  totalEarnedLabel: 'Заработано всего',
  incomeSpeedLabel: 'Скорость дохода',
  carsBoughtLabel: 'Куплено машин',
  mergesLabel: 'Слияний',
  playAgainBtn: 'Начать заново',

  flyToGarage: (n) => `${n} → Гараж`,
  toastGarageFull: 'Гараж заполнен! Расширьте места или объедините авто.',
  toastSlotOccupied: 'Это место уже занято.',
  toastNeedMore: (a) => `Нужно ещё ${a}`,
  toastSecretCaught: (n) => `СЕКРЕТНОЕ АВТО! ${n} теперь в вашем гараже!`,
  toastEscaped: 'Авто сорвалось — $0 списано, средства сохранены!',
  toastMerged: (n, l) => `Объединено! ${n} · Уровень ${l}`,
  toastSold: (a) => `Продано за ${a}`,
  toastNoMoneyUpgrade: 'Недостаточно средств для улучшения',
  toastUpgraded: (n, l) => `${n}: уровень ${l}`,
  boostWord: 'Буст',

  carSpecs: {
    city_hatch: '1.6L Turbo · Хэтчбек 90-х',
    retro_coupe: '3.2L V8 · Ретро купе',
    rally_evo: 'AWD · Раллийная серия',
    jdm_tuner: 'Twin-Turbo · Стрит-спек',
    muscle_gt: '6.2L Supercharged · Вайдбоди',
    offroad_monster: '6×6 Бронированный · Монстр',
    hyper_aero: 'Активная аэро · Карбон',
    prototype_gold: 'Трековый прототип',
    cyber_concept: 'Реактивная аэро · Концепт',
    banana_mobile: 'Спелый слик-спорткар',
    toilet_kart: 'V12 Фаянсовый болид',
  },
};

const PL: Translations = {
  subtitle: 'SYMULATOR TAŚMY KOLEKCJONERSKIEJ',
  description:
    'Łap zdjęcia rzadkich aut z taśmy aukcyjnej, przeciągaj je do garażu, łącz identyczne modele i zwiększaj pasywny przychód każdej sekundy.',
  continueBtn: 'Kontynuuj grę',
  newGameBtn: 'Nowa gra',
  startBtn: 'Rozpocznij grę',
  savedGarageInfo: (m, c) => `Zapisany garaż · ${m} · ${c} aut`,
  controlHintTitle:
    'Kliknij lub przeciągnij, aby kupić · Połącz identyczne auta · Spacja — start · Esc — pauza',

  balance: 'Saldo',
  income: 'Przychód',
  garage: 'Garaż',
  goal: 'Cel kolekcji',
  upgrades: 'Ulepszenia',
  pause: 'Pauza',
  muteOn: 'Włącz dźwięk',
  muteOff: 'Wycisz dźwięk',
  perSec: '/sek',

  conveyorTitle: 'Taśma aukcyjna',
  conveyorSubtitle: 'Kliknij lub przeciągnij zdjęcie do garażu poniżej',
  rerollCooldown: (s) => `Odśwież (${s}s)`,
  rerollBtn: 'Nowa partia',
  minterBonus: 'Mint +25%',
  noSlots: 'Brak miejsc',
  buyBtn: 'Kup',
  noFunds: 'Za mało środków',

  garageTitle: 'Garaż kolekcjonera',
  garageSubtitle: 'Kliknij auto po szybki bonus · Przeciągnij dwa takie same auta, by je połączyć',
  occupiedCount: (u, m) => `Zajęte ${u} z ${m}`,
  lvlShort: 'Poz.',
  sellTitle: (p) => `Sprzedaj za ${p}`,
  limitedEdition: 'Edycja limitowana',
  boostBtn: 'Boost',
  slotLabel: (n) => `Miejsce ${n}`,
  dropHere: 'Upuść tutaj',
  notEnoughFunds: 'Brak środków',
  dragCarHere: 'Przeciągnij auto tutaj',
  mergeInto: (lvl) => `Połącz → Poziom ${lvl}`,
  swapSlots: 'Zamień miejsca',

  difficultyLabel: 'Trudność',
  catchTitle: (name) => `Przechwycenie: ${name}`,
  priceOnSuccess: 'Cena po złapaniu',
  holdAnywhere: 'Kliknij i przytrzymaj gdziekolwiek!',
  spaceHint: '· Spacja',
  catchRules:
    'Utrzymuj pionową linię auta w białym polu, aby napełnić pasek. Brak opłaty przy ucieczce.',
  cancelPurchase: 'Anuluj zakup',

  upgradesTitle: 'Ulepszenia salonu',
  availableBalance: 'Dostępne saldo:',
  currentEffect: 'Obecny efekt:',
  maxLevel: 'Maksymalny poziom',
  upgradeBtn: (cost) => `Ulepsz · ${cost}`,
  upgradeNames: {
    garage_slots: {
      title: 'Rozbudowa garażu',
      desc: 'Dodaje +2 miejsca w garażu na kolejne auta i fuzje.',
    },
    income_mult: {
      title: 'Wydajność kolekcji',
      desc: 'Zwiększa pasywny przychód wszystkich aut o +20% za poziom.',
    },
    catch_zone: {
      title: 'Szerokość strefy',
      desc: 'Poszerza biały pasek sterowania w mini-grze przechwytywania.',
    },
    belt_speed: {
      title: 'Prędkość taśmy',
      desc: 'Przyspiesza ruch taśmy oraz tempo pojawiania się nowych aut.',
    },
    rare_luck: {
      title: 'Elitarne dostawy',
      desc: 'Zwiększa szansę na auta Epic, Legendary, Mythic oraz SECRET.',
    },
  },
  effectSlots: (n) => `${n} miejsc`,
  effectSpeed: (p) => `+${p}% tempo`,
  effectZone: (p) => `+${p}% strefa`,
  effectLevel: (l) => `Poziom ${l}`,

  pausedTitle: 'Gra wstrzymana',
  pausedSubtitle: 'Postęp zapisuje się automatycznie w Twojej przeglądarce.',
  currentBalance: 'Obecne saldo',
  passiveIncome: 'Pasywny przychód',
  totalEarned: 'Łącznie zarobiono',
  boughtMerged: 'Kupione / Połączone',
  resumeBtn: 'Wznów grę',
  returnTitleBtn: 'Menu główne',
  resetProgressBtn: 'Resetuj postęp i zacznij od nowa',

  victoryTitle: 'Imperium NFT Drive gotowe',
  victoryDesc: (g) =>
    `Osiągnąłeś cel ${g} łącznego kapitału! Graj dalej bez limitu lub rozpocznij nową rozgrywkę.`,
  totalEarnedLabel: 'Zarobiono łącznie',
  incomeSpeedLabel: 'Tempo przychodu',
  carsBoughtLabel: 'Kupione auta',
  mergesLabel: 'Połączenia',
  playAgainBtn: 'Zagraj ponownie',

  flyToGarage: (n) => `${n} → Garaż`,
  toastGarageFull: 'Garaż pełny! Rozbuduj miejsca lub połącz auta.',
  toastSlotOccupied: 'To miejsce jest już zajęte.',
  toastNeedMore: (a) => `Brakuje jeszcze ${a}`,
  toastSecretCaught: (n) => `SEKRETNE AUTO! ${n} trafia do Twojego garażu!`,
  toastEscaped: 'Auto uciekło — $0 pobrane, środki bezpieczne!',
  toastMerged: (n, l) => `Połączono! ${n} · Poziom ${l}`,
  toastSold: (a) => `Sprzedano za ${a}`,
  toastNoMoneyUpgrade: 'Za mało środków na ulepszenie',
  toastUpgraded: (n, l) => `${n}: poziom ${l}`,
  boostWord: 'Boost',

  carSpecs: {
    city_hatch: '1.6L Turbo · Hatchback 90.',
    retro_coupe: '3.2L V8 · Retro Coupe',
    rally_evo: 'AWD · Seria Rajdowa',
    jdm_tuner: 'Twin-Turbo · Street Spec',
    muscle_gt: '6.2L Supercharged · Widebody',
    offroad_monster: '6×6 Opancerzony · Monster',
    hyper_aero: 'Aktywne Aero · Karbon',
    prototype_gold: 'Prototyp Wyścigowy',
    cyber_concept: 'Odrzutowy Koncept',
    banana_mobile: 'Dojrzały Bolid Bananowy',
    toilet_kart: 'V12 Porcelanowa Formuła 1',
  },
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  uk: UK,
  en: EN,
  ru: RU,
  pl: PL,
};
