(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('slideCounter');
  const progressFill = document.getElementById('progressFill');
  const overviewBtn = document.getElementById('overviewBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  let current = 0;

  function show(index) {
    if (index < 0 || index >= slides.length) return;
    slides[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    updateUI();
    history.replaceState(null, '', `#${current + 1}`);
  }

  function updateUI() {
    counter.textContent = `${current + 1} / ${slides.length}`;
    progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  function next() { show(current + 1); }
  function prev() { show(current - 1); }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  overviewBtn?.addEventListener('click', () => {
    document.body.classList.toggle('overview-mode');
    overviewBtn.textContent = document.body.classList.contains('overview-mode') ? 'Слайд' : 'Обзор';
  });

  fullscreenBtn?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (document.body.classList.contains('overview-mode')) {
        document.body.classList.remove('overview-mode');
        overviewBtn.textContent = 'Обзор';
        show(i);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('overview-mode') && e.key === 'Escape') {
      document.body.classList.remove('overview-mode');
      overviewBtn.textContent = 'Обзор';
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        next();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prev();
        break;
      case 'Home':
        e.preventDefault();
        show(0);
        break;
      case 'End':
        e.preventDefault();
        show(slides.length - 1);
        break;
      case 'f':
      case 'F':
        fullscreenBtn?.click();
        break;
      case 'o':
      case 'O':
        overviewBtn?.click();
        break;
    }
  });

  const hash = parseInt(location.hash.replace('#', ''), 10);
  if (hash >= 1 && hash <= slides.length) show(hash - 1);
  else updateUI();

  /* ===== Interactive ASUTP panel ===== */
  const asutpInfo = {
    intro: {
      title: 'Обзор',
      html: '<p>АСУТП строится по функциональной схеме с двумя уровнями управления.</p><p>Нажмите на <strong>синюю</strong> или <strong>зелёную</strong> зону схемы, на блок или на кнопку внизу — здесь появится определение.</p>'
    },
    upper: {
      title: 'Верхний уровень',
      html: '<p>Управляющая <strong>ЭВМ</strong> или <strong>ПЛК</strong> с доступом <strong>оператора</strong> и устройствами сопряжения с объектом (<strong>УСО</strong>).</p><p><strong>ПЛК</strong> — специализированная управляющая ЭВМ с фиксированным набором функций; модули ввода-вывода для датчиков и ИУ.</p>'
    },
    lower: {
      title: 'Нижний уровень',
      html: '<p>Объект управления, датчики (<strong>Д</strong>) и исполнительные устройства (<strong>ИУ</strong>), в том числе УМ и УПУ.</p><p>Здесь могут работать <strong>СА</strong> и <strong>САУ</strong>. Пунктир на схеме — сигналы датчиков (<strong>Y</strong>) для отрицательной обратной связи.</p>'
    },
    uso: {
      title: 'УСО и ПО',
      html: '<p><strong>УСО</strong> — устройства сопряжения с объектом: связывают ЭВМ/ПЛК с датчиками и ИУ.</p><p>Подключение: слоты расширения, порты, унифицированная шина.</p><p><strong>ПО включает:</strong> драйверы УСО (конфигурирование, измерение, передача в ОЗУ) и прикладное ПО для обработки сигналов.</p>'
    },
    operator: {
      title: 'Оператор',
      html: '<p>Человек в контуре АСУТП: наблюдает состояние объекта, задаёт команды через ЭВМ/ПЛК.</p><p>В отличие от СА и САУ, в АСУТП участие человека принципиально предусмотрено.</p>'
    },
    evm: {
      title: 'ЭВМ / ПЛК',
      html: '<p><strong>ЭВМ</strong> — управляющая вычислительная машина верхнего уровня.</p><p><strong>ПЛК</strong> — программируемый логический контроллер: специализированная ЭВМ с фиксированным набором функций.</p>'
    },
    sensor: {
      title: 'Д — датчик',
      html: '<p>Датчик состояния объекта: преобразует параметры процесса в электрический сигнал <strong>Y</strong> и передаёт его на УСО верхнего уровня.</p>'
    },
    object: {
      title: 'Объект',
      html: '<p>Объект управления (технологический объект) — то, чем управляет АСУТП.</p>'
    },
    actuator: {
      title: 'ИУ — исполнительное устройство',
      html: '<p>Исполнительные устройства получают управляющий сигнал <strong>X</strong> от УСО и воздействуют на объект (клапаны, двигатели, УМ, УПУ и т.п.).</p>'
    }
  };

  const asutpPanel = document.getElementById('asutpPanel');
  const asutpSlide = document.querySelector('.slide-asutp-interactive');

  function showAsutpInfo(key) {
    const data = asutpInfo[key] || asutpInfo.intro;
    if (!asutpPanel) return;
    asutpPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 'upper', 'lower', 'uso'];
    asutpSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    asutpSlide?.querySelectorAll('.asutp-zone').forEach((zone) => {
      zone.classList.toggle('is-active', zone.dataset.info === key);
    });
  }

  asutpSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showAsutpInfo(target.dataset.info);
  });

  /* ===== Lecture 2: SAU chain ===== */
  const sauChainSlide = document.querySelector('.slide-sau-chain-interactive');
  if (sauChainSlide) {
    const sauChainPanel = document.getElementById('sauChainPanel');
    const sauChainInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Сигнал датчика сравнивают с <strong>уставкой</strong>; разность усиливают и подают на <strong>исполнительный орган</strong>.</p><p>Замкнутый контур: объект → датчик → сравнение → снова воздействие на объект.</p>'
      },
      set: {
        title: 'Уставка Z',
        html: '<p>Заданное значение: «какой должна быть» величина на объекте.</p><p>В САУ человек задаёт уставку; дальше контур работает сам.</p>'
      },
      cmp: {
        title: 'Сравнение',
        html: '<p>Уставка минус сигнал датчика: <var>ε</var> = <var>Z</var> − <var>Y</var>.</p><p>Ошибка <var>ε</var> показывает, насколько объект отклонился от задания.</p>'
      },
      amp: {
        title: 'Усилитель',
        html: '<p>Усиливает ошибку до уровня, достаточного для исполнительного органа.</p><p>Без усиления слабый сигнал датчика не сдвинет ИО.</p>'
      },
      io: {
        title: 'ИО — исполнительный орган',
        html: '<p>Воздействует на объект: двигатель, клапан, нагреватель.</p><p>Получает уже усиленный сигнал ошибки.</p>'
      },
      obj: {
        title: 'Объект управления',
        html: '<p>То, чем управляют: механизм, печь, уровень в ёмкости.</p><p>Его состояние измеряет датчик — иначе контур «слепой».</p>'
      },
      sens: {
        title: 'Датчик',
        html: '<p>Измеряет состояние объекта и даёт сигнал <var>Y</var> на сравнение.</p><p>Это обратная связь: без датчика нет замкнутой САУ, только разомкнутая СА.</p>'
      }
    };
    const sauChainTabs = ['intro', 'sens', 'cmp', 'amp', 'io'];

    function showSauChainInfo(key) {
      const data = sauChainInfo[key] || sauChainInfo.intro;
      if (sauChainPanel) sauChainPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      sauChainSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', sauChainTabs.includes(key) && btn.dataset.info === key);
      });
      sauChainSlide.querySelectorAll('.scada-block').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
    }

    sauChainSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      showSauChainInfo(target.dataset.info);
    });
    showSauChainInfo('intro');
  }

  /* ===== Interactive SA / SAU panel ===== */
  const saInfo = {
    intro: {
      title: 'Обзор',
      html: '<p><strong>Управление</strong> — процесс достижения поставленной цели.</p><p>Нажмите на блок схемы или кнопку <strong>СА</strong> / <strong>САУ</strong> — здесь появится определение компонента.</p><p>В СА и САУ участие человека принципиально исключено (в САУ человек лишь задаёт уставку).</p>'
    },
    sa: {
      title: 'СА — системы автоматики',
      html: '<p>Разомкнутый цикл: <strong>Д → ИУ → О</strong>.</p><p>Сигнализация, пуск/останов, блокировки и защиты. Обратной связи нет.</p>'
    },
    sau: {
      title: 'САУ — системы авт. управления',
      html: '<p>Замкнутый цикл: <strong>З → УС → УПУ → УМ → ДВ → О</strong>.</p><p>Обратная связь: <strong>О → Д → УС</strong>. Управление «по отклонению».</p>'
    },
    d: {
      title: 'Д — датчик',
      html: '<p>Датчик: преобразует параметры объекта в электрический сигнал.</p><p>В САУ сигнал <strong>Y</strong> с датчика идёт на устройство сравнения.</p>'
    },
    iu: {
      title: 'ИУ — исполнительное устройство',
      html: '<p>Исполнительные устройства: двигатели, клапаны, усилители мощности (УМ), усилительно-преобразовательные устройства (УПУ) и т.п.</p>'
    },
    o: {
      title: 'О / ОУ — объект управления',
      html: '<p>Физический объект, модель или математическая модель на ЭВМ — то, чем управляют.</p>'
    },
    z: {
      title: 'З — задающее устройство',
      html: '<p>Задаёт требуемое значение (уставку) — сигнал <strong>X</strong> на вход устройства сравнения.</p>'
    },
    us: {
      title: 'УС — устройство сравнения',
      html: '<p>Сравнивает задание <strong>X</strong> и сигнал датчика <strong>Y</strong>, формирует отклонение <strong>Δ = X − Y</strong> (отрицательная обратная связь).</p>'
    },
    upu: {
      title: 'УПУ — усилительно-преобразовательное устройство',
      html: '<p>Усиливает и преобразует сигнал отклонения для дальнейшей передачи на усилитель мощности.</p>'
    },
    um: {
      title: 'УМ — усилитель мощности',
      html: '<p>Усиливает сигнал до уровня, достаточного для привода исполнительного механизма (двигателя).</p>'
    },
    dv: {
      title: 'ДВ — двигатель',
      html: '<p>Двигатель (исполнительный механизм): непосредственно воздействует на объект управления.</p>'
    }
  };

  /* ===== Lecture 1: apparatus classification by purpose ===== */
  const appPurposeSlide = document.querySelector('.slide-app-purpose-interactive');
  if (appPurposeSlide) {
    const appPurposePanel = document.getElementById('appPurposePanel');
    const appPurposeInfo = {
      switch: {
        title: 'Коммутационные',
        html: '<p>Замыкают и размыкают электрические цепи в <strong>нормальных</strong> режимах.</p><p><strong>Примеры:</strong> контактор, магнитный пускатель, рубильник, разъединитель, автоматический выключатель (как коммутатор).</p><p>В АСУТП — силовые цепи двигателей, нагревателей, питание шкафов.</p>'
      },
      protect: {
        title: 'Защитные',
        html: '<p>Отключают цепь при <strong>аварийных</strong> режимах: перегрузка, КЗ, утечка, недопустимое напряжение.</p><p><strong>Примеры:</strong> автоматический выключатель, предохранитель, УЗО / дифференциальный автомат, реле максимального тока.</p><p>Часто совмещают функции коммутации и защиты в одном аппарате.</p>'
      },
      control: {
        title: 'Управляющие / регулирующие',
        html: '<p>Формируют или усиливают сигнал управления по заданному закону.</p><p><strong>Примеры:</strong> реле управления, ПЛК, регулятор, частотный преобразователь, усилитель.</p><p>Связующее звено между датчиками и исполнительными механизмами.</p>'
      },
      measure: {
        title: 'Измерительные',
        html: '<p>Преобразуют физическую величину в сигнал, удобный для измерения и управления.</p><p><strong>Примеры:</strong> датчики (температура, давление, перемещение), трансформаторы тока/напряжения, нормирующие преобразователи.</p><p>Подробно — в лекции 2 (электрические датчики).</p>'
      },
      signal: {
        title: 'Сигнальные',
        html: '<p>Информируют оператора или систему о состоянии объекта и режимах.</p><p><strong>Примеры:</strong> светосигнальная арматура, звуковые извещатели, табло, индикаторы на HMI / SCADA.</p><p>Часть подсистемы сигнализации в СА и АСУТП.</p>'
      },
      drive: {
        title: 'Пусковые / исполнительные',
        html: '<p>Обеспечивают пуск, реверс, торможение и механическое воздействие на объект.</p><p><strong>Примеры:</strong> магнитный пускатель, сервопривод, электропривод задвижки, электромагнит, пневмо/гидроклапан с электроуправлением.</p><p>Именно они «двигают» объект управления.</p>'
      }
    };
    const appPurposeKeys = ['switch', 'protect', 'control', 'measure', 'signal', 'drive'];

    function showAppPurposeInfo(key) {
      const data = appPurposeInfo[key] || appPurposeInfo.switch;
      if (!appPurposePanel) return;
      appPurposePanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      appPurposeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      appPurposeSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', appPurposeKeys.includes(key) && btn.dataset.info === key);
      });
    }

    appPurposeSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      showAppPurposeInfo(target.dataset.info);
    });
    showAppPurposeInfo('switch');
  }

  /* ===== Lecture 1: IP code interactive ===== */
  const ipCodeSlide = document.querySelector('.slide-ip-code-interactive');
  if (ipCodeSlide) {
    const ipCodePanel = document.getElementById('ipCodePanel');
    const ipXSelect = ipCodeSlide.querySelector('.ip-x-select');
    const ipYSelect = ipCodeSlide.querySelector('.ip-y-select');
    const ipDigitX = ipCodeSlide.querySelector('#ipDigitX');
    const ipDigitY = ipCodeSlide.querySelector('#ipDigitY');

    const ipXMean = {
      '0': 'защиты от твёрдых тел нет',
      '1': 'защита от предметов &gt; 50 мм (рука)',
      '2': 'защита от предметов &gt; 12,5 мм (палец)',
      '3': 'защита от предметов &gt; 2,5 мм (инструмент)',
      '4': 'защита от предметов &gt; 1 мм (проволока)',
      '5': 'пылезащита (неполная пыленепроницаемость)',
      '6': 'пыленепроницаемость'
    };
    const ipYMean = {
      '0': 'защиты от воды нет',
      '1': 'вертикальные капли',
      '2': 'капли под углом до 15°',
      '3': 'дождь / брызги под углом до 60°',
      '4': 'брызги с любого направления',
      '5': 'струи воды',
      '6': 'мощные струи воды',
      '7': 'кратковременное погружение',
      '8': 'длительное погружение'
    };
    const ipWhere = {
      '20': 'Открытые клеммы, щиты внутри сухих помещений — только от пальцев, без воды.',
      '54': 'Шкафы и аппараты в цехе без прямого орошения — пыль + брызги.',
      '65': 'Уличное / моющее оборудование — пыленепроницаемость и струи воды.',
      '67': 'Затопляемые зоны, мобильная техника — кратковременное погружение.'
    };

    function updateIpCode() {
      const x = ipXSelect?.value || '5';
      const y = ipYSelect?.value || '4';
      const code = `IP${x}${y}`;
      if (ipDigitX) ipDigitX.textContent = x;
      if (ipDigitY) ipDigitY.textContent = y;
      const where = ipWhere[`${x}${y}`] || 'Подбирайте IP по среде: пыль, влага, мойка, улица. В ТЗ на шкаф и датчик IP указывают обязательно.';
      if (ipCodePanel) {
        ipCodePanel.innerHTML = `<h3>${code}</h3><p><strong>${x}</strong> — ${ipXMean[x]}.</p><p><strong>${y}</strong> — ${ipYMean[y]}.</p><p>${where}</p>`;
      }
      ipCodeSlide.querySelectorAll('.ip-ex-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.x === x && btn.dataset.y === y);
      });
    }

    ipXSelect?.addEventListener('change', updateIpCode);
    ipYSelect?.addEventListener('change', updateIpCode);
    ipCodeSlide.addEventListener('click', (e) => {
      const btn = e.target.closest('.ip-ex-btn');
      if (!btn) return;
      if (ipXSelect) ipXSelect.value = btn.dataset.x;
      if (ipYSelect) ipYSelect.value = btn.dataset.y;
      updateIpCode();
    });
    updateIpCode();
  }

  const saPanel = document.getElementById('saPanel');
  const saSlide = document.querySelector('.slide-sa-interactive');

  function showSaInfo(key) {
    const data = saInfo[key] || saInfo.intro;
    if (!saPanel) return;
    saPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 'sa', 'sau'];
    saSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    saSlide?.querySelectorAll('.sa-block').forEach((block) => {
      block.classList.toggle('is-active', block.dataset.info === key);
    });
  }

  saSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showSaInfo(target.dataset.info);
  });

  /* ===== Interactive SCADA hardware panel ===== */
  const scadaInfo = {
    intro: {
      title: 'Обзор',
      html: '<p>Техническое обеспечение SCADA строится вокруг <strong>сервера сбора и хранения данных (СУБД)</strong>.</p><p>Нажмите на блок схемы или кнопку внизу — здесь появится определение.</p>'
    },
    server: {
      title: 'Сервер сбора и хранения (СУБД)',
      html: '<p>Центральный узел SCADA: сбор данных с ПЛК, хранение в базе, обмен с АРМ и смежными системами.</p><p>Связь: Ethernet, RS-232, FEP. Часто применяют «горячее» резервирование серверов.</p>'
    },
    arm: {
      title: 'АРМ операторов',
      html: '<p><strong>АРМ</strong> — автоматизированное рабочее место оператора (как правило, ПК).</p><p>Отображение информации, приём команд оператора, обмен с сервером данных.</p>'
    },
    erp: {
      title: 'Связь с ERP',
      html: '<p><strong>ERP</strong> — уровень АСУП (предприятие): планирование, учёт, ресурсы.</p><p>Двусторонняя связь сервера SCADA с ERP передаёт агрегированные данные вверх и задания вниз.</p>'
    },
    plc: {
      title: 'Связь с ПЛК',
      html: '<p><strong>ПЛК</strong> — программируемые логические контроллеры нижнего уровня АСУТП.</p><p>Сервер собирает измерения и статусы с ПЛК и может передавать уставки и команды управления.</p>'
    },
    display: {
      title: 'Отображение состояния ОУ',
      html: '<p>Крупный дисплей / мнемосхема общего состояния объекта управления.</p><p>Односторонний вывод с сервера для диспетчерского контроля (HMI).</p>'
    },
    archive: {
      title: 'Архив данных (БД)',
      html: '<p>Резервное копирование и восстановление архива технологической базы данных.</p><p>Обеспечивает сохранность истории процесса и возможность восстановления после сбоев.</p>'
    },
    printer: {
      title: 'Вывод отчётов на печать',
      html: '<p>Печать отчётов с АРМ оператора: сменные, аварийные, технологические сводки.</p>'
    }
  };

  const scadaPanel = document.getElementById('scadaPanel');
  const scadaSlide = document.querySelector('.slide-scada-interactive');

  function showScadaInfo(key) {
    const data = scadaInfo[key] || scadaInfo.intro;
    if (!scadaPanel) return;
    scadaPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 'server', 'arm', 'erp', 'plc'];
    scadaSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    scadaSlide?.querySelectorAll('.scada-block').forEach((block) => {
      block.classList.toggle('is-active', block.dataset.info === key);
    });
  }

  scadaSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showScadaInfo(target.dataset.info);
  });

  /* ===== Interactive PLC segment panel ===== */
  const plcInfo = {
    intro: {
      title: 'Обзор',
      html: '<p>Детализация уровня ПЛК зависит от сложности задач.</p><p>Схема одного сегмента сети на базе ПЛК, реализующего подсистему АСУТП.</p>'
    },
    scada: {
      title: 'Связь со SCADA',
      html: '<p>Верхний уровень сегмента связан с <strong>SCADA</strong>: передача данных вверх и приём заданий / уставок вниз.</p>'
    },
    high: {
      title: 'Контроллер высокого уровня',
      html: '<p>Более производительный ПЛК: собирает и обрабатывает данные с нижних контроллеров, наверх передаёт только нужное (по изменению или периоду).</p><p>Формирует команды сам или по заданию сверху: законы <strong>P, I, PI, PD, PID</strong>, аварийные отключения. Обмен со SCADA и локальными АРМ.</p>'
    },
    arm: {
      title: 'Локальное АРМ',
      html: '<p>Прямое управление локальным объектом: пульт с индикацией или ПК/сенсор в защитном корпусе.</p><p>Данные — <strong>напрямую с ПЛК</strong> в реальном времени (не из архива сервера); команды фиксируются в архиве верхнего уровня.</p>'
    },
    low: {
      title: 'ПЛК нижнего уровня',
      html: '<p>Контроллеры уровня связи с объектом: прямой обмен с датчиками и ИУ. Всё чаще их роль берут на себя <strong>микропроцессорные датчики</strong> (например, по Modbus).</p>'
    },
    field: {
      title: 'Датчики и ИУ',
      html: '<p>Полевые устройства объекта управления: измерения и исполнительные механизмы, подключённые к ПЛК нижнего уровня.</p>'
    }
  };

  const plcPanel = document.getElementById('plcPanel');
  const plcSlide = document.querySelector('.slide-plc-interactive');

  function showPlcInfo(key) {
    const data = plcInfo[key] || plcInfo.intro;
    if (!plcPanel) return;
    plcPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 'scada', 'high', 'low', 'field'];
    plcSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    plcSlide?.querySelectorAll('.scada-block').forEach((block) => {
      block.classList.toggle('is-active', block.dataset.info === key);
    });
  }

  plcSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showPlcInfo(target.dataset.info);
  });

  /* ===== Interactive TZ design stages ===== */
  const tzInfo = {
    intro: {
      title: 'Обзор',
      html: '<p>Функциональная схема <strong>угловой следящей системы</strong> и последовательность этапов проектирования.</p><p>Номера на схеме — порядок расчёта блоков. Итог — проверка макета по <strong>ТЗ</strong>.</p>'
    },
    s1: {
      title: 'Этап 1 — Дв и Ред',
      html: '<p>Выбор <strong>двигателя (Дв)</strong> и расчёт <strong>редуктора (Ред)</strong>:</p><ul><li>предварительный выбор Дв и оценка передаточного числа;</li><li>расчёт редуктора;</li><li>проверка пригодности связки Дв–Ред для нагрузки (Нагр).</li></ul>'
    },
    s2: {
      title: 'Этап 2 — УМ',
      html: '<p>Расчёт <strong>усилителя мощности (УМ)</strong> — звена, обеспечивающего достаточную мощность для привода двигателя.</p>'
    },
    s3: {
      title: 'Этап 3 — Измерение',
      html: '<p>Выбор измерительного устройства (класс точности) и оценка передаточной функции <strong>разомкнутой</strong> системы.</p><p>На схеме — узел сравнения φвх и обратной связи φвых.</p>'
    },
    s4: {
      title: 'Этап 4 — УПУ и коррекция',
      html: '<p>Синтез корректирующих звеньев и расчёт <strong>усилительно-преобразовательного устройства (УПУ)</strong>.</p>'
    },
    s5: {
      title: 'Этап 5 — Макет и ТЗ',
      html: '<p>Изготовление макета системы и проверка качества работы на <strong>соответствие требованиям ТЗ</strong> (технического задания).</p>'
    }
  };

  const tzPanel = document.getElementById('tzPanel');
  const tzSlide = document.querySelector('.slide-tz-interactive');

  function showTzInfo(key) {
    const data = tzInfo[key] || tzInfo.intro;
    if (!tzPanel) return;
    tzPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 's1', 's2', 's3', 's4', 's5'];
    tzSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    tzSlide?.querySelectorAll('.scada-block').forEach((block) => {
      block.classList.toggle('is-active', block.dataset.info === key);
    });
  }

  tzSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showTzInfo(target.dataset.info);
  });

  /* ===== Lecture 2: structural IP diagram ===== */
  const ipInfo = {
    intro: {
      title: 'Обзор',
      html: '<p>Структурная схема показывает путь сигнала: <strong>X → ЧЭ → F(x) → НП/У → Y</strong>.</p><p>Нажмите элемент схемы или кнопку внизу — здесь появится определение.</p>'
    },
    ip: {
      title: 'ИП — измерительный преобразователь',
      html: '<p><strong>ИП</strong> — датчик в широком смысле: устройство, преобразующее физическую величину в сигнал, удобный для САУ.</p><p>На схеме пунктиром выделен весь преобразователь: чувствительный элемент и блок нормировки/усиления.</p>'
    },
    x: {
      title: 'X — входная величина',
      html: '<p><strong>X</strong> — измеряемый параметр объекта или среды: температура, давление, перемещение, уровень, расход и т.п.</p><p>На вход ИП поступает физическая величина, которую нужно «увидеть» для управления.</p>'
    },
    che: {
      title: 'ЧЭ — чувствительный элемент',
      html: '<p><strong>ЧЭ</strong> непосредственно воспринимает X и формирует промежуточный сигнал <strong>F(x)</strong>.</p><p>Примеры: термопара (X → ЭДС), резистивный элемент (X → R), пьезокристалл (сила → заряд).</p><p>Именно ЧЭ находится в агрессивной среде и чаще всего страдает от помех.</p>'
    },
    fx: {
      title: 'F(x) — промежуточный сигнал',
      html: '<p><strong>F(x)</strong> — сигнал на выходе чувствительного элемента до нормировки.</p><p>Он может быть слабым, нелинейным или нестандартным по уровню — поэтому нужен блок <strong>НП/У</strong>.</p>'
    },
    noise: {
      title: 'Помехи',
      html: '<p><strong>Помехи</strong> — внешние воздействия на ЧЭ: температура окружающей среды, вибрация, электромагнитные поля, старение материала.</p><p>Они искажают F(x) и увеличивают погрешность всего ИП — отсюда требования к избирательности и защите датчика.</p>'
    },
    npu: {
      title: 'НП/У — нормирующий преобразователь / усилитель',
      html: '<p><strong>НП/У</strong> линеаризует, усиливает и приводит F(x) к стандартному виду выхода.</p><p>Здесь могут быть: усилитель, фильтр, АЦП, гальваническая развязка, интерфейс (4–20 мА, 0–10 В, Modbus…).</p>'
    },
    y: {
      title: 'Y — выходной сигнал',
      html: '<p><strong>Y</strong> — сигнал на выходе ИП для передачи в САУ, ПЛК или вторичный прибор.</p><p>Обычно Y — напряжение, ток или цифровой код; его параметры должны соответствовать входу устройства управления.</p>'
    }
  };

  const ipPanel = document.getElementById('ipPanel');
  const ipSlide = document.querySelector('.slide-ip-interactive');

  function showIpInfo(key) {
    const data = ipInfo[key] || ipInfo.intro;
    if (!ipPanel) return;
    ipPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
    const tabKeys = ['intro', 'che', 'npu', 'noise', 'y'];
    ipSlide?.querySelectorAll('.asutp-tab').forEach((btn) => {
      btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
    });
    ipSlide?.querySelectorAll('.scada-block').forEach((block) => {
      block.classList.toggle('is-active', block.dataset.info === key);
    });
  }

  ipSlide?.addEventListener('click', (e) => {
    const target = e.target.closest('[data-info]');
    if (!target) return;
    e.stopPropagation();
    showIpInfo(target.dataset.info);
  });

  /* ===== Lecture 2: sensor requirements ===== */
  const sensorReqSlide = document.querySelector('.slide-req-interactive');
  if (sensorReqSlide) {
    const sensorReqPanel = document.getElementById('sensorReqPanel');
    const sensorReqFig = document.getElementById('sensorReqFig');
    const axis = '<line x1="36" y1="148" x2="188" y2="148" stroke="#1e293b" stroke-width="1.4"/><line x1="36" y1="148" x2="36" y2="28" stroke="#1e293b" stroke-width="1.4"/><text x="192" y="154" font-size="12" fill="#475569">X</text><text x="22" y="28" font-size="12" fill="#475569">Y</text>';
    const sensorReqInfo = {
      unique: {
        title: '1. Однозначность',
        html: '<p>Каждому <var>X</var> — одно <var>Y</var>.</p><p><strong>Нарушение:</strong> гистерезис — вверх и вниз датчик даёт разные значения.</p><p>Контроллер должен однозначно знать состояние объекта.</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Однозначность и гистерезис"><rect width="420" height="180" fill="#fafafa"/>${axis}<line x1="48" y1="132" x2="168" y2="44" stroke="#1e40af" stroke-width="2.2"/><text x="108" y="172" text-anchor="middle" font-size="11" fill="#1e40af">нужно: одна линия</text><g transform="translate(210 0)"><line x1="36" y1="148" x2="188" y2="148" stroke="#1e293b" stroke-width="1.4"/><line x1="36" y1="148" x2="36" y2="28" stroke="#1e293b" stroke-width="1.4"/><text x="192" y="154" font-size="12" fill="#475569">X</text><text x="22" y="28" font-size="12" fill="#475569">Y</text><path d="M48 128 C90 120 110 70 168 48" fill="none" stroke="#dc2626" stroke-width="2"/><path d="M168 48 C120 90 80 140 48 128" fill="none" stroke="#f59e0b" stroke-width="2"/><text x="112" y="172" text-anchor="middle" font-size="11" fill="#b91c1c">плохо: петля гистерезиса</text></g></svg>`
      },
      select: {
        title: '2. Избирательность',
        html: '<p>Датчик реагирует на <strong>нужную</strong> величину и слабо — на помехи.</p><p><strong>Пример:</strong> датчик давления почти не меняет показания от температуры и вибрации.</p>',
        fig: `<svg viewBox="0 0 440 200" xmlns="http://www.w3.org/2000/svg" aria-label="Избирательность"><rect width="440" height="200" fill="#fafafa"/><rect x="168" y="78" width="104" height="52" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="220" y="109" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">датчик</text><path d="M36 104 H166" stroke="#1e293b" stroke-width="1.8"/><polygon points="166,104 156,99 156,109" fill="#1e293b"/><text x="92" y="88" text-anchor="middle" font-size="16" font-style="italic" font-weight="700" fill="#1e40af">X</text><text x="92" y="128" text-anchor="middle" font-size="11" fill="#64748b">измеряемая</text><path d="M272 104 H404" stroke="#1e293b" stroke-width="1.8"/><polygon points="404,104 394,99 394,109" fill="#1e293b"/><text x="338" y="88" text-anchor="middle" font-size="16" font-style="italic" font-weight="700" fill="#1e40af">Y</text><text x="338" y="128" text-anchor="middle" font-size="11" fill="#64748b">сигнал</text><path d="M220 28 V76" stroke="#94a3b8" stroke-width="1.4" stroke-dasharray="5 4"/><polygon points="220,76 215,66 225,66" fill="#94a3b8"/><text x="220" y="22" text-anchor="middle" font-size="12" fill="#64748b">T, вибрация</text><text x="220" y="186" text-anchor="middle" font-size="12" fill="#475569">помехи влияют слабо — это и есть избирательность</text></svg>`
      },
      linear: {
        title: '3. Линейность',
        html: '<p>Желательно <var>Y</var> ≈ <var>KX</var> — проще калибровка.</p><p>Отклонение от прямой — <strong>погрешность нелинейности</strong>.</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Линейность">${axis}<line x1="48" y1="132" x2="168" y2="44" stroke="#1e40af" stroke-width="2.2"/><text x="108" y="172" text-anchor="middle" font-size="11" fill="#1e40af">линейно: Y ≈ KX</text><g transform="translate(210 0)"><line x1="36" y1="148" x2="188" y2="148" stroke="#1e293b" stroke-width="1.4"/><line x1="36" y1="148" x2="36" y2="28" stroke="#1e293b" stroke-width="1.4"/><text x="192" y="154" font-size="12" fill="#475569">X</text><text x="22" y="28" font-size="12" fill="#475569">Y</text><path d="M48 136 Q100 40 168 52" fill="none" stroke="#dc2626" stroke-width="2.2"/><text x="112" y="172" text-anchor="middle" font-size="11" fill="#b91c1c">нелинейность</text></g></svg>`
      },
      sense: {
        title: '4. Чувствительность',
        html: '<p><var>s</var> = d<var>Y</var>/d<var>X</var> — наклон характеристики.</p><p>Должна быть достаточной и <strong>стабильной</strong> (температура, питание, время).</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Чувствительность">${axis}<line x1="48" y1="128" x2="168" y2="96" stroke="#94a3b8" stroke-width="2"/><line x1="48" y1="128" x2="168" y2="36" stroke="#1e40af" stroke-width="2.2"/><text x="178" y="44" font-size="12" fill="#1e40af">s велико</text><text x="178" y="100" font-size="12" fill="#64748b">s мало</text><text x="210" y="172" text-anchor="middle" font-size="12" fill="#475569">круче линия — выше чувствительность</text></svg>`
      },
      direction: {
        title: '5. Направленность',
        html: '<p>Сигнал идёт <var>X</var> → <var>Y</var>, а не наоборот.</p><p>Измерительная цепь почти не меняет сам процесс — <strong>малое обратное воздействие</strong>.</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Направленность"><rect width="420" height="180" fill="#fafafa"/><rect x="48" y="68" width="88" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="92" y="95" text-anchor="middle" font-size="16" font-weight="700" fill="#1e40af">X</text><rect x="166" y="62" width="88" height="56" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="210" y="96" text-anchor="middle" font-size="13" font-weight="700">датчик</text><rect x="284" y="68" width="88" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="328" y="95" text-anchor="middle" font-size="16" font-weight="700" fill="#1e40af">Y</text><path d="M136 90 H164" stroke="#1e293b" stroke-width="1.8"/><polygon points="164,90 154,85 154,95" fill="#1e293b"/><path d="M254 90 H282" stroke="#1e293b" stroke-width="1.8"/><polygon points="282,90 272,85 272,95" fill="#1e293b"/><path d="M328 112 V138 H92 V112" fill="none" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="4 3"/><text x="210" y="158" text-anchor="middle" font-size="12" fill="#64748b">обратное влияние — минимально</text></svg>`
      },
      speed: {
        title: '6. Быстродействие',
        html: '<p><var>Y</var> должен быстро следовать за <var>X</var>.</p><p>Медленный датчик даёт запаздывание и портит регулирование.</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Быстродействие"><rect width="420" height="180" fill="#fafafa"/><line x1="40" y1="150" x2="390" y2="150" stroke="#1e293b" stroke-width="1.3"/><line x1="40" y1="150" x2="40" y2="24" stroke="#1e293b" stroke-width="1.3"/><text x="396" y="154" font-size="11" fill="#475569">t</text><text x="24" y="24" font-size="11" fill="#475569">Y</text><path d="M40 128 H90 V48 H390" fill="none" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="5 3"/><text x="248" y="42" font-size="11" fill="#64748b">скачок X</text><path d="M90 128 C120 128 140 52 210 50 H390" fill="none" stroke="#1e40af" stroke-width="2.2"/><text x="248" y="72" font-size="12" fill="#1e40af">быстрый отклик</text><path d="M90 128 C160 128 220 80 390 62" fill="none" stroke="#dc2626" stroke-width="1.8"/><text x="300" y="108" font-size="12" fill="#b91c1c">медленный</text></svg>`
      },
      resist: {
        title: '7. Стойкость',
        html: '<p>Характеристики сохраняются в реальной среде.</p><p><strong>Воздействия:</strong> температура, влага, пыль, вибрация, помехи. Защита — корпус, герметизация, экран.</p>',
        fig: `<svg viewBox="0 0 420 180" xmlns="http://www.w3.org/2000/svg" aria-label="Стойкость"><rect width="420" height="180" fill="#fafafa"/><rect x="148" y="58" width="124" height="72" rx="6" fill="#fff" stroke="#1e293b" stroke-width="1.8"/><text x="210" y="92" text-anchor="middle" font-size="14" font-weight="700">датчик</text><text x="210" y="112" text-anchor="middle" font-size="11" fill="#64748b">корпус · IP</text><text x="70" y="48" text-anchor="middle" font-size="12" fill="#b45309">T</text><text x="70" y="128" text-anchor="middle" font-size="12" fill="#2563eb">влага</text><text x="350" y="48" text-anchor="middle" font-size="12" fill="#475569">вибрация</text><text x="350" y="128" text-anchor="middle" font-size="12" fill="#7c3aed">помехи</text><path d="M96 52 H146" stroke="#cbd5e1" stroke-width="1.2"/><path d="M96 122 H146" stroke="#cbd5e1" stroke-width="1.2"/><path d="M274 52 H324" stroke="#cbd5e1" stroke-width="1.2"/><path d="M274 122 H324" stroke="#cbd5e1" stroke-width="1.2"/></svg>`
      }
    };
    const sensorReqKeys = ['unique', 'select', 'linear', 'sense', 'direction', 'speed', 'resist'];

    function showSensorReqInfo(key) {
      const data = sensorReqInfo[key] || sensorReqInfo.unique;
      if (sensorReqPanel) sensorReqPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (sensorReqFig) sensorReqFig.innerHTML = data.fig;
      sensorReqSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', sensorReqKeys.includes(key) && btn.dataset.info === key);
      });
    }

    sensorReqSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      showSensorReqInfo(tab.dataset.info);
    });
    showSensorReqInfo('unique');
  }

  /* ===== Lecture 2: sensor classification ===== */
  const classSlide = document.querySelector('.slide-class-interactive');
  if (classSlide) {
    const classPanel = document.getElementById('classPanel');
    const classFig = document.getElementById('classFig');
    const box = (x, y, w, h, t1, t2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="${x + w / 2}" y="${t2 ? y + 24 : y + 32}" text-anchor="middle" font-size="13" font-weight="700" fill="#0f172a">${t1}</text>${t2 ? `<text x="${x + w / 2}" y="${y + 42}" text-anchor="middle" font-size="11" fill="#64748b">${t2}</text>` : ''}`;
    const classInfo = {
      out: {
        title: 'По выходу',
        html: '<p>Для АСУ удобны датчики с <strong>электрическим</strong> выходом: сигнал легко усиливать, передавать и обрабатывать в ПЛК.</p><p><strong>Неэлектрические</strong> (пневматические, гидравлические) в этой лекции не рассматриваются.</p>',
        fig: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="200" fill="#fafafa"/><text x="240" y="28" text-anchor="middle" font-size="13" fill="#64748b">выходной сигнал датчика</text>${box(40, 56, 180, 88, 'электрический', 'U, I, код')}${box(260, 56, 180, 88, 'неэлектрический', 'давление, ход')}<path d="M220 100 H258" stroke="#1e293b" stroke-width="1.3"/><text x="240" y="178" text-anchor="middle" font-size="12" fill="#1e40af">в курсе — электрические</text></svg>`
      },
      energy: {
        title: 'По энергии',
        html: '<p><strong>Генераторные</strong> сами дают сигнал (пьезо: заряд <var>q</var>).</p><p><strong>Параметрические</strong> меняют параметр цепи: <var>R</var>, <var>L</var>, <var>C</var> — тензо, реостат, индуктивный.</p>',
        fig: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="200" fill="#fafafa"/>${box(28, 28, 200, 72, 'генераторные', 'сами дают сигнал')}${box(252, 28, 200, 72, 'параметрические', 'меняют R, L, C')}${box(48, 122, 160, 52, 'пьезо', 'q → U')}${box(272, 122, 160, 52, 'тензо · индукт.', 'R, L')}</svg>`
      },
      meas: {
        title: 'По измеряемой величине',
        html: '<p>Классифицируют по тому, <strong>что</strong> измеряют: температура, давление, перемещение, уровень, расход, сила.</p><p>Дальше в лекции: контактные и реостатные (перемещение), пьезо (сила), тензо (деформация), индуктивные (зазор).</p>',
        fig: `<svg viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="200" fill="#fafafa"/>${box(16, 36, 104, 56, 'T', 'термо')}${box(132, 36, 104, 56, 'сила', 'пьезо')}${box(248, 36, 104, 56, 'ход', 'контакт')}${box(364, 36, 100, 56, 'зазор δ', 'индукт.')}${box(74, 118, 140, 56, 'деформация', 'тензо')}${box(266, 118, 140, 56, 'уровень, расход', '…')}</svg>`
      }
    };

    function showClassInfo(key) {
      const data = classInfo[key] || classInfo.out;
      if (classPanel) classPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (classFig) classFig.innerHTML = data.fig;
      classSlide.querySelectorAll('.class-axis-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }

    classSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.class-axis-card');
      if (!card) return;
      showClassInfo(card.dataset.info);
    });
    showClassInfo('out');
  }

  /* ===== Lecture 2: contact pressure ===== */
  const contactPressureSlide = document.querySelector('.slide-contact-pressure-interactive');
  if (contactPressureSlide) {
    const pressureRange = contactPressureSlide.querySelector('.contact-pressure-range');
    const movingContact = contactPressureSlide.querySelector('.contact-pressure-moving');
    const pressureReadout = contactPressureSlide.querySelector('.contact-pressure-readout');
    const pressureValue = contactPressureSlide.querySelector('.contact-pressure-value');
    const pressureLive = contactPressureSlide.querySelector('.contact-pressure-live');
    const pressureSpots = [...contactPressureSlide.querySelectorAll('.contact-pressure-spots circle')];

    function updateContactPressure() {
      const force = Number(pressureRange?.value) || 0;
      const t = force / 100;
      const resistance = 8 + 52 * Math.pow(1 - t, 1.65);
      const shift = -Math.min(5, t * 5);
      if (movingContact) {
        movingContact.setAttribute('transform', `translate(0 ${shift.toFixed(1)})`);
      }
      pressureSpots.forEach((spot, index) => {
        const threshold = index / pressureSpots.length;
        const active = t + 0.18 >= threshold;
        spot.setAttribute('opacity', active ? String(0.45 + t * 0.55) : '0.1');
        spot.setAttribute('r', String(active ? 2.2 + t * 1.2 : 1.4));
      });
      if (pressureReadout) {
        pressureReadout.textContent = `F = ${force}% · Rₖ ≈ ${resistance.toFixed(0)} мОм`;
      }
      if (pressureValue) pressureValue.textContent = `${force}%`;
      if (pressureLive) {
        let state;
        if (force < 25) {
          state = 'слабое нажатие — мало пятен касания, Rₖ велико, возможен нестабильный сигнал.';
        } else if (force < 70) {
          state = 'среднее нажатие — устойчивый электрический контакт.';
        } else {
          state = 'сильное нажатие — Rₖ мало, но растут механическая нагрузка и износ.';
        }
        pressureLive.innerHTML = `<strong>Сейчас:</strong> ${state}`;
      }
    }

    pressureRange?.addEventListener('input', updateContactPressure);
    updateContactPressure();
  }

  /* ===== Lecture 2: contact types ===== */
  const contactTypeSlide = document.querySelector('.slide-contact-type-interactive');
  if (contactTypeSlide) {
    const contactTypePanel = document.getElementById('contactTypePanel');
    const contactTypeFig = document.getElementById('contactTypeFig');
    const contactTypeRange = contactTypeSlide.querySelector('.contact-type-range');
    const contactTypeVal = contactTypeSlide.querySelector('.contact-type-ctrl-val');
    const contactTypeToggle = contactTypeSlide.querySelector('.contact-type-toggle');
    const contactTypeLabel = contactTypeSlide.querySelector('.contact-type-ctrl-label');
    let contactTypeKey = 'no';
    const contactTypeInfo = {
      no: {
        title: 'Замыкающий (НО)',
        html: '<p>В покое цепь <strong>разомкнута</strong>. При срабатывании замыкается.</p><p><strong>Примеры:</strong> концевик «деталь на месте», кнопка пуска.</p>',
        label: 'воздействие',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><circle cx="140" cy="90" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><circle cx="300" cy="90" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><path d="M80 90 H132 M308 90 H360" stroke="#1e293b" stroke-width="1.8"/><path class="ct-arm" d="M148 90 L292 58" fill="none" stroke="#1e293b" stroke-width="2.2"/><circle class="ct-lamp" cx="380" cy="90" r="16" fill="#e2e8f0" stroke="#94a3b8"/><text x="220" y="36" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="ct-state">покой · разомкнут</text><text x="220" y="168" text-anchor="middle" font-size="12" fill="#475569">НО: двигайте ползунок — цепь замыкается</text></svg>`
      },
      nc: {
        title: 'Размыкающий (НЗ)',
        html: '<p>В покое цепь <strong>замкнута</strong>. При срабатывании размыкается.</p><p><strong>Примеры:</strong> обрыв = авария, концевик безопасности.</p>',
        label: 'воздействие',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><circle cx="140" cy="90" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><circle cx="300" cy="90" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><path d="M80 90 H132 M308 90 H360" stroke="#1e293b" stroke-width="1.8"/><path class="ct-arm" d="M148 90 H292" fill="none" stroke="#1e40af" stroke-width="2.2"/><circle class="ct-lamp" cx="380" cy="90" r="16" fill="#fbbf24" stroke="#d97706"/><text x="220" y="36" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="ct-state">покой · замкнут</text><text x="220" y="168" text-anchor="middle" font-size="12" fill="#475569">НЗ: двигайте ползунок — цепь размыкается</text></svg>`
      },
      co: {
        title: 'Переключающий',
        html: '<p>Общий контакт переходит с Б на М.</p><p><strong>Примеры:</strong> датчик «больше / меньше».</p>',
        label: 'воздействие',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><circle cx="240" cy="40" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="258" y="36" font-size="13" fill="#1e40af">Б</text><circle cx="240" cy="150" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="258" y="156" font-size="13" fill="#2563eb">М</text><circle cx="120" cy="95" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="88" y="100" text-anchor="end" font-size="12" fill="#475569">общий</text><path d="M70 95 H112" stroke="#1e293b" stroke-width="1.8"/><path class="ct-arm" d="M128 95 L232 46" fill="none" stroke="#1e40af" stroke-width="2.2"/><text x="330" y="100" font-size="13" font-weight="700" fill="#1e40af" class="ct-state">цепь Б</text></svg>`
      },
      point: {
        title: 'Точечный и линейный',
        html: '<p>Ползунок — сила нажатия. Точечный: малое пятно. Линейный: касание по линии.</p>',
        label: 'нажатие',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><rect x="70" y="40" width="110" height="26" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><g class="ct-move-l"><rect x="70" y="92" width="110" height="26" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><circle class="ct-spot" cx="125" cy="92" r="4" fill="#1e40af"/></g><text x="125" y="154" text-anchor="middle" font-size="12" fill="#475569">точечный</text><rect x="260" y="40" width="110" height="26" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><g class="ct-move-r"><rect x="260" y="92" width="110" height="26" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><line class="ct-line" x1="272" y1="92" x2="358" y2="92" stroke="#1e40af" stroke-width="3"/></g><text x="315" y="154" text-anchor="middle" font-size="12" fill="#475569">линейный</text><text x="220" y="176" text-anchor="middle" font-size="12" fill="#1e40af" class="ct-state">нажатие 0%</text></svg>`
      },
      ring: {
        title: 'Кольцевой',
        html: '<p>Щётка едет по окружности. Угол → сигнал.</p>',
        label: 'угол',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><circle cx="220" cy="92" r="54" fill="#fff" stroke="#1e293b" stroke-width="1.8"/><circle cx="220" cy="92" r="34" fill="#fafafa" stroke="#94a3b8" stroke-width="1.2"/><circle cx="220" cy="92" r="7" fill="#fff" stroke="#1e293b"/><g class="ct-brush" transform="rotate(0 220 92)"><rect x="262" y="82" width="24" height="20" rx="2" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.4"/></g><text x="220" y="170" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="ct-state">угол 0°</text></svg>`
      },
      slide: {
        title: 'Скользящий (щётка)',
        html: '<p>Движок по дорожке. Положение → <var>R</var> или <var>U</var><sub>вых</sub>.</p>',
        label: 'положение',
        fig: `<svg viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg"><rect width="440" height="190" fill="#fafafa"/><rect x="70" y="84" width="300" height="16" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><rect class="ct-active" x="70" y="84" width="0" height="16" fill="#dbeafe"/><g class="ct-wiper"><rect x="-12" y="72" width="24" height="40" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/><line x1="0" y1="112" x2="0" y2="140" stroke="#1e293b" stroke-width="1.5"/></g><text x="220" y="50" text-anchor="middle" font-size="12" fill="#64748b">резистивная дорожка</text><text x="220" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="ct-state">положение 0%</text></svg>`
      }
    };
    const contactTypeKeys = ['no', 'nc', 'co', 'point', 'ring', 'slide'];

    function updateContactTypeAnim() {
      const t = Math.max(0, Math.min(100, Number(contactTypeRange?.value) || 0)) / 100;
      const pct = Math.round(t * 100);
      if (contactTypeVal) contactTypeVal.textContent = `${pct}%`;
      if (contactTypeToggle) {
        contactTypeToggle.classList.toggle('is-on', t >= 0.5);
        contactTypeToggle.textContent = t >= 0.5 ? 'Сработал' : 'Покой';
      }
      const arm = contactTypeFig?.querySelector('.ct-arm');
      const state = contactTypeFig?.querySelector('.ct-state');
      const lamp = contactTypeFig?.querySelector('.ct-lamp');
      if (contactTypeKey === 'no') {
        const closed = t > 0.85;
        const y = 58 + t * 32;
        if (arm) {
          arm.setAttribute('d', `M148 90 L292 ${y.toFixed(1)}`);
          arm.setAttribute('stroke', closed ? '#1e40af' : '#1e293b');
        }
        if (lamp) {
          lamp.setAttribute('fill', closed ? '#fbbf24' : '#e2e8f0');
          lamp.setAttribute('stroke', closed ? '#d97706' : '#94a3b8');
        }
        if (state) state.textContent = closed ? 'сработал · замкнут' : 'покой · разомкнут';
      } else if (contactTypeKey === 'nc') {
        const closed = t < 0.15;
        const y = 90 - t * 32;
        if (arm) {
          arm.setAttribute('d', closed ? 'M148 90 H292' : `M148 90 L292 ${y.toFixed(1)}`);
          arm.setAttribute('stroke', closed ? '#1e40af' : '#1e293b');
        }
        if (lamp) {
          lamp.setAttribute('fill', closed ? '#fbbf24' : '#e2e8f0');
          lamp.setAttribute('stroke', closed ? '#d97706' : '#94a3b8');
        }
        if (state) state.textContent = closed ? 'покой · замкнут' : 'сработал · разомкнут';
      } else if (contactTypeKey === 'co') {
        const y = 46 + t * 104;
        if (arm) {
          arm.setAttribute('d', `M128 95 L232 ${y.toFixed(1)}`);
          arm.setAttribute('stroke', t < 0.5 ? '#1e40af' : '#2563eb');
        }
        if (state) state.textContent = t < 0.5 ? 'цепь Б' : 'цепь М';
      } else if (contactTypeKey === 'point') {
        const dy = t * 26;
        const moveL = contactTypeFig?.querySelector('.ct-move-l');
        const moveR = contactTypeFig?.querySelector('.ct-move-r');
        const spot = contactTypeFig?.querySelector('.ct-spot');
        const line = contactTypeFig?.querySelector('.ct-line');
        if (moveL) moveL.setAttribute('transform', `translate(0 ${(-dy).toFixed(1)})`);
        if (moveR) moveR.setAttribute('transform', `translate(0 ${(-dy).toFixed(1)})`);
        if (spot) spot.setAttribute('r', String(3 + t * 3));
        if (line) line.setAttribute('stroke-width', String(2.5 + t * 2));
        if (state) state.textContent = `нажатие ${pct}%`;
      } else if (contactTypeKey === 'ring') {
        const ang = t * 270 - 20;
        const brush = contactTypeFig?.querySelector('.ct-brush');
        if (brush) brush.setAttribute('transform', `rotate(${ang.toFixed(1)} 220 92)`);
        if (state) state.textContent = `угол ${Math.round(t * 270)}°`;
      } else if (contactTypeKey === 'slide') {
        const x = 82 + t * 276;
        const wiper = contactTypeFig?.querySelector('.ct-wiper');
        const active = contactTypeFig?.querySelector('.ct-active');
        if (wiper) wiper.setAttribute('transform', `translate(${x.toFixed(1)} 0)`);
        if (active) active.setAttribute('width', String(Math.max(0, x - 70)));
        if (state) state.textContent = `положение ${pct}%`;
      }
    }

    function showContactTypeInfo(key) {
      contactTypeKey = key;
      const data = contactTypeInfo[key] || contactTypeInfo.no;
      if (contactTypePanel) contactTypePanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (contactTypeFig) contactTypeFig.innerHTML = data.fig || '';
      if (contactTypeLabel) contactTypeLabel.textContent = data.label || 'воздействие';
      contactTypeSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', contactTypeKeys.includes(key) && btn.dataset.info === key);
      });
      updateContactTypeAnim();
    }

    contactTypeSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showContactTypeInfo(tab.dataset.info);
        return;
      }
      const toggle = e.target.closest('.contact-type-toggle');
      if (toggle && contactTypeRange) {
        e.stopPropagation();
        contactTypeRange.value = Number(contactTypeRange.value) >= 50 ? '0' : '100';
        updateContactTypeAnim();
      }
    });
    contactTypeRange?.addEventListener('input', updateContactTypeAnim);
    showContactTypeInfo('no');
  }

  /* ===== Lecture 2: contact construction ===== */
  const contactConstSlide = document.querySelector('.slide-contact-const-interactive');
  if (contactConstSlide) {
    const contactConstPanel = document.getElementById('contactConstPanel');
    const contactConstInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Слева — <strong>размыкающая пара</strong> (концевик, реле). Справа — <strong>скользящий</strong> контакт потенциометра.</p><p>Нажмите элемент схемы или кнопку — здесь появится роль узла.</p>'
      },
      fixed: {
        title: 'Неподвижный контакт',
        html: '<p>Закреплён на изоляторе. Задаёт одну сторону цепи.</p><p>Поверхность должна быть чистой: окисел увеличивает <var>R</var><sub>k</sub>.</p>'
      },
      move: {
        title: 'Подвижный контакт',
        html: '<p>Перемещается вместе с якорем, рычагом или штоком датчика.</p><p>Замыкает или размыкает цепь при достижении порога.</p>'
      },
      spring: {
        title: 'Пружина нажатия',
        html: '<p>Задаёт <strong>силу сжатия</strong> контактной пары. От неё зависит <var>R</var><sub>k</sub> и устойчивость к вибрации.</p><p>Слишком слабая — дребезг и окисление; слишком жёсткая — износ и большой момент на штоке.</p>'
      },
      term: {
        title: 'Выводы',
        html: '<p>Соединяют пару с внешней цепью. Часто медь или латунь.</p><p>Не путать с самой контактной поверхностью: выводы проводят ток, контакт работает на сжатие.</p>'
      },
      wiper: {
        title: 'Движок (щётка)',
        html: '<p>Скользящий контакт по резистору или ламели. Зона износа — дорожка, по которой ходит щётка.</p><p>Материал движка <strong>мягче</strong> обмотки, чтобы истиралась щётка, а не резистор.</p>'
      }
    };
    const contactConstTabs = ['intro', 'fixed', 'move', 'spring', 'wiper'];

    function showContactConstInfo(key) {
      const data = contactConstInfo[key] || contactConstInfo.intro;
      if (!contactConstPanel) return;
      contactConstPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      contactConstSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', contactConstTabs.includes(key) && btn.dataset.info === key);
      });
      contactConstSlide.querySelectorAll('.scada-block').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
    }

    contactConstSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      showContactConstInfo(target.dataset.info);
    });
    showContactConstInfo('intro');
  }

  /* ===== Lecture 2: contact operating modes ===== */
  const contactModeSlide = document.querySelector('.slide-contact-mode-interactive');
  if (contactModeSlide) {
    const contactModePanel = document.getElementById('contactModePanel');
    const contactModeLive = contactModeSlide.querySelector('.contact-mode-live');
    const contactModeInfo = {
      low: {
        title: 'Слаботочный',
        live: 'Слаботочный: важны R<sub>k</sub> и плёнка; дуга — у силовых контактов',
        html: '<p>Токи датчиков малы. Главное — <strong>контактное сопротивление</strong> и плёнка, а не нагрев дугой.</p><p><strong>Нагрев дугой</strong> — у силовых контактов: при размыкании большого тока вспыхивает плазма, металл подгорает.</p><p>У датчика дуги почти нет. Окисел или грязь поднимают <var>R</var><sub>k</sub>: пара замкнута механически, а ПЛК видит «обрыв».</p>'
      },
      dc: {
        title: 'Постоянный ток',
        live: 'Постоянный ток: дуга не гаснет сама → эрозия поверхности',
        html: '<p>Это как раз <strong>нагрев дугой</strong>: при размыкании большого тока дуга <strong>не проходит через ноль</strong> и горит дольше, чем на переменном.</p><p>Портится <strong>эта</strong> пара: эрозия, подгорание, рост <var>R</var><sub>k</sub>, залипание. Не «дуга на соседние контакторы».</p>'
      },
      ac: {
        title: 'Переменный ток',
        live: 'Переменный ток: дуга гаснет в нуле → выше ресурс',
        html: '<p>Дуга гаснет при переходе тока через <strong>ноль</strong>. Ресурс контакта выше, чем на постоянном токе той же величины.</p><p>Контактные датчики работают и на переменном, и на постоянном токе.</p>'
      },
      slide: {
        title: 'Скользящий',
        live: 'Скользящий контакт: трение, износ, шум при движении',
        html: '<p>Трение и износ дорожки, нагрев от <var>I</var>²<var>R</var><sub>k</sub>, ВЧ-шум при движении движка.</p><p>Это главная причина отказа потенциометрических датчиков — дальше на слайде погрешностей.</p>'
      },
      bounce: {
        title: 'Дребезг',
        live: 'Дребезг: пачка импульсов при одном замыкании → ПЛК видит несколько фронтов',
        html: '<p>При замыкании пара несколько раз отскакивает — на выходе пачка импульсов вместо одного фронта.</p><p>Для <strong>ПЛК</strong> нужна фильтрация (задержка, аппаратный RC). Иначе ложный счёт срабатываний.</p>'
      }
    };

    function showContactModeInfo(key) {
      const data = contactModeInfo[key] || contactModeInfo.low;
      if (contactModePanel) contactModePanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (contactModeLive) contactModeLive.innerHTML = data.live;
      contactModeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }

    contactModeSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      showContactModeInfo(target.dataset.info);
    });
    showContactModeInfo('low');
  }

  /* ===== Lecture 2: contact resistance Rk ===== */
  const rkSlide = document.querySelector('.slide-rk-interactive');
  if (rkSlide) {
    const rkPanel = document.getElementById('rkPanel');
    const rkFig = document.getElementById('rkFig');
    const rkRange = rkSlide.querySelector('.rk-range');
    const rkVal = rkSlide.querySelector('.rk-ctrl-val');
    const rkLabel = rkSlide.querySelector('.rk-ctrl-label');
    let rkKey = 'formula';
    const rkInfo = {
      formula: {
        title: 'Два слагаемых',
        label: 'качество контакта',
        html: '<p><var>R</var><sub>k</sub> = <var>R</var><sub>пер</sub> + <var>R</var><sub>сж</sub>.</p><p><var>R</var><sub>пер</sub> — плёнка: окисел, грязь, влага на воздухе. <var>R</var><sub>сж</sub> — сжатие пятен касания.</p><p>Ток идёт только через пятна, не через всю видимую площадь.</p>',
        fig: `<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="200" fill="#fafafa"/><rect x="36" y="28" width="176" height="40" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="124" y="52" text-anchor="middle" font-size="12" fill="#334155">верхний контакт</text><rect class="rk-film" x="36" y="68" width="176" height="10" fill="#fde68a" stroke="#d97706" stroke-width="1.2"/><g class="rk-spots" fill="#dc2626"><circle class="rk-spot" cx="64" cy="88" r="3.2"/><circle class="rk-spot" cx="94" cy="88" r="3.2"/><circle class="rk-spot" cx="124" cy="88" r="3.2"/><circle class="rk-spot" cx="154" cy="88" r="3.2"/><circle class="rk-spot" cx="184" cy="88" r="3.2"/></g><g class="rk-lower"><rect x="36" y="96" width="176" height="40" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="124" y="120" text-anchor="middle" font-size="12" fill="#334155">нижний контакт</text></g><text x="124" y="154" text-anchor="middle" font-size="11" fill="#92400e">плёнка Rпер</text><text x="124" y="170" text-anchor="middle" font-size="11" fill="#1e40af">пятна Rсж</text><rect x="268" y="28" width="92" height="36" fill="#fff" stroke="#d97706" stroke-width="1.6"/><text x="314" y="50" text-anchor="middle" font-size="13" font-weight="700" fill="#92400e">Rпер</text><text x="314" y="78" text-anchor="middle" font-size="16" fill="#64748b">+</text><rect x="268" y="86" width="92" height="36" fill="#fff" stroke="#1e40af" stroke-width="1.6"/><text x="314" y="108" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">Rсж</text><text x="314" y="136" text-anchor="middle" font-size="16" fill="#64748b">=</text><rect x="268" y="144" width="92" height="36" fill="#dbeafe" stroke="#1e40af" stroke-width="1.8"/><text x="314" y="166" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">Rk</text><text x="124" y="192" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af" class="rk-state">Rk ≈ 40 мОм</text></svg>`
      },
      film: {
        title: 'Переходное Rпер',
        label: 'толщина плёнки',
        html: '<p><strong>Плёнка</strong> — тонкий слой не металла на поверхности контакта (жёлтая полоска на схеме).</p><p>Металл на воздухе окисляется; плюс пыль, масло, конденсат. Влага ускоряет рост. Слой растёт сам, особенно если контакт слабо нажат и редко срабатывает.</p><p>Плёнка почти не проводит. Малый ток датчика её не пробивает: пара замкнута механически, ПЛК видит «обрыв». Это и есть <var>R</var><sub>пер</sub>.</p>',
        fig: `<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="200" fill="#fafafa"/><rect x="80" y="24" width="300" height="48" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="230" y="52" text-anchor="middle" font-size="13" fill="#334155">металл</text><rect class="rk-film" x="80" y="72" width="300" height="8" fill="#fde68a" stroke="#d97706" stroke-width="1.3"/><g class="rk-lower"><rect x="80" y="96" width="300" height="48" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="230" y="124" text-anchor="middle" font-size="13" fill="#334155">металл</text></g><path class="rk-current" d="M50 48 H80 M380 48 H410" fill="none" stroke="#1e40af" stroke-width="2"/><circle class="rk-lamp" cx="430" cy="48" r="12" fill="#e2e8f0" stroke="#94a3b8"/><text x="50" y="44" font-size="13" font-style="italic" font-weight="700" fill="#1e40af">I</text><text x="230" y="176" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="rk-state">плёнка тонкая · ток проходит</text></svg>`
      },
      spots: {
        title: 'Сжатие Rсж',
        label: 'сила нажатия F',
        html: '<p>Поверхность шероховатая. Ток — только через микропятна.</p><p>Больше <var>F</var> → больше пятен → меньше <var>R</var><sub>сж</sub>.</p><p>Геометрическая площадь контакта больше реальной.</p>',
        fig: `<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="200" fill="#fafafa"/><rect x="90" y="22" width="280" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="230" y="48" text-anchor="middle" font-size="12" fill="#334155">видимая площадь</text><g class="rk-spots" fill="#dc2626"><circle class="rk-spot" cx="130" cy="86" r="4"/><circle class="rk-spot" cx="180" cy="86" r="4"/><circle class="rk-spot" cx="230" cy="86" r="4"/><circle class="rk-spot" cx="280" cy="86" r="4"/><circle class="rk-spot" cx="330" cy="86" r="4"/></g><g class="rk-lower"><rect x="90" y="96" width="280" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="230" y="122" text-anchor="middle" font-size="12" fill="#334155">реальные пятна</text></g><path d="M230 178 V152" stroke="#1e293b" stroke-width="2"/><polygon points="230,152 224,162 236,162" fill="#1e293b"/><text x="246" y="172" font-size="14" font-style="italic" font-weight="700" fill="#1e40af">F</text><text x="230" y="196" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="rk-state">F мало · Rсж велико</text></svg>`
      },
      current: {
        title: 'Ток',
        label: 'ток через контакт',
        html: '<p>Малый ток не пробивает плёнку — проблема датчика.</p><p>Большой ток даёт <strong>нагрев дугой</strong> внутри <strong>этой</strong> пары при размыкании: плазма, эрозия, рост <var>R</var><sub>k</sub>, возможное сваривание. Пока дуга горит, нагрузка ещё включена (кружок справа).</p><p>Это ресурс реле или пускателя, а не дуга на соседние контакторы. У концевика на вход ПЛК такого почти нет.</p>',
        fig: `<svg viewBox="0 0 460 200" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="200" fill="#fafafa"/><rect x="70" y="28" width="130" height="36" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><rect x="260" y="28" width="130" height="36" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="135" y="50" text-anchor="middle" font-size="12" fill="#334155">контакт</text><text x="325" y="50" text-anchor="middle" font-size="12" fill="#334155">контакт</text><path d="M40 46 H70 M390 46 H420" stroke="#1e293b" stroke-width="1.8"/><path class="rk-gap" d="M200 46 H260" fill="none" stroke="#1e293b" stroke-width="1.4" stroke-dasharray="4 3"/><path class="rk-arc" d="M202 46 Q230 8 258 46" fill="none" stroke="#f59e0b" stroke-width="2.4" opacity="0"/><circle class="rk-lamp" cx="440" cy="46" r="12" fill="#e2e8f0" stroke="#94a3b8"/><g class="rk-pits" fill="#94a3b8" opacity="0"><circle cx="196" cy="40" r="3"/><circle cx="264" cy="52" r="2.6"/><circle cx="198" cy="54" r="2.2"/></g><text x="230" y="100" text-anchor="middle" font-size="12" fill="#64748b">зазор при размыкании</text><text x="230" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af" class="rk-state">малый ток · дуги нет</text></svg>`
      }
    };
    const rkKeys = ['formula', 'film', 'spots', 'current'];

    function updateRkAnim() {
      const t = Math.max(0, Math.min(100, Number(rkRange?.value) || 0)) / 100;
      const pct = Math.round(t * 100);
      if (rkVal) rkVal.textContent = `${pct}%`;
      const state = rkFig?.querySelector('.rk-state');
      const film = rkFig?.querySelector('.rk-film');
      const lower = rkFig?.querySelector('.rk-lower');
      const lamp = rkFig?.querySelector('.rk-lamp');
      const spots = [...(rkFig?.querySelectorAll('.rk-spot') || [])];
      const current = rkFig?.querySelector('.rk-current');
      const arc = rkFig?.querySelector('.rk-arc');
      const pits = rkFig?.querySelector('.rk-pits');

      if (rkKey === 'formula') {
        const filmH = 14 - t * 8;
        if (film) {
          film.setAttribute('height', filmH.toFixed(1));
          film.setAttribute('fill', t < 0.35 ? '#f59e0b' : '#fde68a');
        }
        spots.forEach((spot, i) => {
          const on = t + 0.12 >= i / spots.length;
          spot.setAttribute('opacity', on ? String(0.4 + t * 0.6) : '0.12');
          spot.setAttribute('r', String(on ? 2.4 + t * 1.6 : 2));
        });
        const rkOhm = 8 + 72 * (1 - t) * (1 - t);
        if (state) state.textContent = t < 0.35 ? `плохо · Rk ≈ ${rkOhm.toFixed(0)} мОм` : `хорошо · Rk ≈ ${rkOhm.toFixed(0)} мОм`;
      } else if (rkKey === 'film') {
        const h = 6 + t * 22;
        if (film) {
          film.setAttribute('height', h.toFixed(1));
          film.setAttribute('fill', t > 0.55 ? '#f59e0b' : '#fde68a');
        }
        if (lower) lower.setAttribute('transform', `translate(0 ${(t * 18).toFixed(1)})`);
        const blocked = t > 0.55;
        if (current) current.setAttribute('opacity', blocked ? '0.25' : '1');
        if (lamp) {
          lamp.setAttribute('fill', blocked ? '#e2e8f0' : '#fbbf24');
          lamp.setAttribute('stroke', blocked ? '#94a3b8' : '#d97706');
        }
        if (state) state.textContent = blocked ? 'плёнка толстая · «обрыв» для ПЛК' : 'плёнка тонкая · ток проходит';
      } else if (rkKey === 'spots') {
        if (lower) lower.setAttribute('transform', `translate(0 ${(-t * 10).toFixed(1)})`);
        spots.forEach((spot, i) => {
          const on = t + 0.08 >= i / Math.max(spots.length, 1);
          spot.setAttribute('opacity', on ? '1' : '0.12');
          spot.setAttribute('r', String(on ? 3 + t * 2.5 : 2.5));
        });
        const rComp = 6 + 48 * Math.pow(1 - t, 1.5);
        if (state) state.textContent = t < 0.3 ? `F мало · Rсж ≈ ${rComp.toFixed(0)} мОм` : `F растёт · Rсж ≈ ${rComp.toFixed(0)} мОм`;
      } else if (rkKey === 'current') {
        const arcing = t > 0.7;
        if (arc) {
          arc.setAttribute('opacity', t < 0.45 ? '0' : String((t - 0.45) / 0.55));
          arc.setAttribute('stroke-width', String(1.6 + t * 2.4));
        }
        if (pits) pits.setAttribute('opacity', arcing ? '1' : '0');
        if (lamp) {
          lamp.setAttribute('fill', t > 0.2 && !arcing ? '#fbbf24' : arcing ? '#f97316' : '#e2e8f0');
          lamp.setAttribute('stroke', t > 0.2 ? '#d97706' : '#94a3b8');
        }
        if (state) {
          if (t < 0.35) state.textContent = 'малый ток · дуги нет (датчик)';
          else if (!arcing) state.textContent = 'ток растёт · искра при размыкании';
          else state.textContent = 'нагрев дугой · эрозия контакта';
        }
      }
    }

    function showRkInfo(key) {
      rkKey = key;
      const data = rkInfo[key] || rkInfo.formula;
      if (rkPanel) rkPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (rkFig) rkFig.innerHTML = data.fig || '';
      if (rkLabel) rkLabel.textContent = data.label || 'качество контакта';
      rkSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', rkKeys.includes(key) && btn.dataset.info === key);
      });
      updateRkAnim();
    }

    rkSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showRkInfo(tab.dataset.info);
    });
    rkRange?.addEventListener('input', updateRkAnim);
    showRkInfo('formula');
  }

  /* ===== Lecture 2: contact materials ===== */
  const matSlide = document.querySelector('.slide-mat-interactive');
  if (matSlide) {
    const matPanel = document.getElementById('matPanel');
    const matFig = document.getElementById('matFig');
    const matInfo = {
      ag: {
        title: 'Серебро, сплавы Ag',
        html: '<p>Слаботочные пары <strong>датчиков и реле</strong>: малое <var>R</var><sub>k</sub>, оксид серебра проводит лучше оксида меди.</p><p>Плёнка всё равно вредна (сульфид, грязь) — ток датчика её не пробивает.</p>',
        fig: `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="190" fill="#fafafa"/><rect x="70" y="36" width="140" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="140" y="62" text-anchor="middle" font-size="13" fill="#334155">контакт Ag</text><rect x="250" y="36" width="140" height="44" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="320" y="62" text-anchor="middle" font-size="13" fill="#334155">контакт Ag</text><path d="M210 58 H250" stroke="#1e40af" stroke-width="2.2"/><circle cx="140" cy="80" r="6" fill="#e2e8f0" stroke="#1e293b"/><circle cx="320" cy="80" r="6" fill="#e2e8f0" stroke="#1e293b"/><text x="230" y="120" text-anchor="middle" font-size="13" fill="#475569">слаботочный датчик / реле</text><text x="230" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">малое Rk · ток миллиамперы</text></svg>`
      },
      cu: {
        title: 'Медь, латунь',
        html: '<p>Выводы, шины, корпус клеммы. Саму контактную поверхность ими делают реже: медь на воздухе сильно окисляется → растёт <var>R</var><sub>пер</sub>.</p><p>Не путать вывод (медь) и пятно касания (часто Ag).</p>',
        fig: `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="190" fill="#fafafa"/><rect x="40" y="70" width="220" height="36" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="150" y="92" text-anchor="middle" font-size="13" fill="#334155">шина / вывод Cu</text><rect x="300" y="50" width="100" height="76" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><text x="350" y="78" text-anchor="middle" font-size="12" fill="#334155">клемма</text><text x="350" y="96" text-anchor="middle" font-size="12" fill="#64748b">латунь</text><path d="M260 88 H300" stroke="#1e293b" stroke-width="1.8"/><rect x="48" y="78" width="204" height="8" fill="#fde68a" stroke="#d97706" stroke-width="0.8" opacity="0.85"/><text x="230" y="150" text-anchor="middle" font-size="12" fill="#92400e">на воздухе — оксидная плёнка</text><text x="230" y="174" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">для тока, не для пятна касания</text></svg>`
      },
      graph: {
        title: 'Графит, металлографит',
        html: '<p>Щётки и скользящий контакт: кольцо, коллектор, потенциометр.</p><p>Самосмазка, не сваривается дугой. Изнашивается щётка, а не дорожка.</p>',
        fig: `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="190" fill="#fafafa"/><circle cx="230" cy="88" r="52" fill="#fff" stroke="#1e293b" stroke-width="1.8"/><circle cx="230" cy="88" r="32" fill="#fafafa" stroke="#94a3b8" stroke-width="1.2"/><circle cx="230" cy="88" r="6" fill="#fff" stroke="#1e293b"/><rect x="270" y="76" width="28" height="24" rx="2" fill="#cbd5e1" stroke="#1e293b" stroke-width="1.4"/><text x="318" y="92" font-size="12" fill="#334155">щётка</text><text x="230" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">скольжение · графит / металлографит</text></svg>`
      },
      pt: {
        title: 'Платина, вольфрам',
        html: '<p><strong>Платина</strong> — химически стойкая, термоконтакты.</p><p><strong>Вольфрам</strong> — тугоплавкий, держит нагрев дугой и высокую температуру.</p>',
        fig: `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="190" fill="#fafafa"/><rect x="48" y="40" width="150" height="88" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><circle cx="90" cy="84" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><circle cx="156" cy="84" r="8" fill="#fff" stroke="#1e293b" stroke-width="1.6"/><path d="M98 84 H148" stroke="#1e40af" stroke-width="2"/><text x="123" y="58" text-anchor="middle" font-size="13" fill="#334155">Pt</text><text x="123" y="148" text-anchor="middle" font-size="12" fill="#64748b">термоконтакт</text><rect x="262" y="40" width="150" height="88" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><path d="M292 84 H382" stroke="#1e293b" stroke-width="1.6"/><path d="M328 84 Q337 52 346 84" fill="none" stroke="#f59e0b" stroke-width="2.2"/><text x="337" y="58" text-anchor="middle" font-size="13" fill="#334155">W</text><text x="337" y="148" text-anchor="middle" font-size="12" fill="#64748b">дуга, высокая T</text></svg>`
      },
      wiper: {
        title: 'Движок потенциометра',
        html: '<p>Движок <strong>мягче обмотки</strong> (резистивной дорожки).</p><p>Истирается щётка, а не резистор — иначе характеристика «плывёт». Дальше — на слайде характеристик.</p>',
        fig: `<svg viewBox="0 0 460 190" xmlns="http://www.w3.org/2000/svg"><rect width="460" height="190" fill="#fafafa"/><rect x="70" y="78" width="300" height="18" fill="#fff" stroke="#1e293b" stroke-width="1.5"/><text x="220" y="64" text-anchor="middle" font-size="12" fill="#64748b">обмотка / дорожка — твёрже</text><rect x="198" y="64" width="28" height="46" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.5"/><line x1="212" y1="110" x2="212" y2="136" stroke="#1e293b" stroke-width="1.5"/><text x="248" y="132" font-size="12" fill="#1e40af">движок — мягче</text><text x="220" y="168" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">износ щётки, не резистора</text></svg>`
      }
    };
    const matKeys = ['ag', 'cu', 'graph', 'pt', 'wiper'];

    function showMatInfo(key) {
      const data = matInfo[key] || matInfo.ag;
      if (matPanel) matPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (matFig) matFig.innerHTML = data.fig || '';
      matSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', matKeys.includes(key) && btn.dataset.info === key);
      });
    }

    matSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showMatInfo(tab.dataset.info);
    });
    showMatInfo('ag');
  }

  /* ===== Lecture 2: contact sensor click (B / M) ===== */
  const contactAnimSlide = document.querySelector('.slide-contact-anim');
  if (contactAnimSlide) {
    const mover = contactAnimSlide.querySelector('.contact-mover');
    const workRect = contactAnimSlide.querySelector('.contact-work-rect');
    const lampB = contactAnimSlide.querySelector('.lamp-b');
    const lampM = contactAnimSlide.querySelector('.lamp-m');
    const labelB = contactAnimSlide.querySelector('.work-label-b');
    const labelM = contactAnimSlide.querySelector('.work-label-m');
    const statusB = contactAnimSlide.querySelector('.status-b');
    const statusM = contactAnimSlide.querySelector('.status-m');
    const panel = document.getElementById('contactAnimPanel');
    let contactAnimMode = 'm';
    const contactAnimInfo = {
      m: {
        title: 'Меньше · М',
        html: '<p>Изделие <strong>низкое</strong>. Штифт внизу, замкнут контакт <strong>М</strong>, горит лампа «меньше».</p><p>Выход дискретный: только вкл/выкл. Нажмите изделие или «Высокое · Б».</p>'
      },
      b: {
        title: 'Больше · Б',
        html: '<p>Изделие <strong>высокое</strong>. Штифт поднимается, замыкается контакт <strong>Б</strong>, горит лампа «больше».</p><p>Сравнение с эталоном: выше нормы → Б, ниже → М. Непрерывной величины нет.</p>'
      }
    };

    function setContactAnim(mode) {
      contactAnimMode = mode === 'b' ? 'b' : 'm';
      const high = contactAnimMode === 'b';
      if (mover) mover.setAttribute('transform', high ? 'translate(0 -55)' : 'translate(0 0)');
      if (workRect) {
        workRect.setAttribute('y', high ? '185' : '240');
        workRect.setAttribute('height', high ? '83' : '28');
      }
      if (labelB) {
        labelB.setAttribute('y', high ? '228' : '230');
        labelB.classList.toggle('is-on', high);
      }
      if (labelM) labelM.classList.toggle('is-on', !high);
      if (lampB) lampB.classList.toggle('is-on', high);
      if (lampM) lampM.classList.toggle('is-on', !high);
      if (statusB) statusB.classList.toggle('is-on', high);
      if (statusM) statusM.classList.toggle('is-on', !high);
      const data = contactAnimInfo[contactAnimMode];
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      contactAnimSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === contactAnimMode);
      });
    }

    contactAnimSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      const info = target.dataset.info;
      if (info === 'toggle') {
        setContactAnim(contactAnimMode === 'b' ? 'm' : 'b');
        return;
      }
      if (info === 'b' || info === 'm') setContactAnim(info);
    });
    setContactAnim('m');
  }

  /* ===== Lecture 2: rheostat / potentiometer slider ===== */
  const rheoSlide = document.querySelector('.slide-rheostat-interactive');
  if (rheoSlide) {
    const range = rheoSlide.querySelector('.rheo-range');
    const rheoWiper = rheoSlide.querySelector('.rheo-wiper');
    const potWiper = rheoSlide.querySelector('.pot-wiper');
    const rheoActive = rheoSlide.querySelector('.rheo-track-active');
    const potActive = rheoSlide.querySelector('.pot-track-active');
    const potOutTop = rheoSlide.querySelector('.pot-out-top');
    const RHEO_X0 = 24;
    const RHEO_LEN = 152;
    const POT_Y0 = 6;
    const POT_H = 48;
    const POT_WIPER_Y0 = 54;

    function setRheoPosition(pct) {
      const p = Math.max(0, Math.min(100, pct));
      const wiperX = RHEO_X0 + (RHEO_LEN * p) / 100;
      const activeW = Math.max(0, wiperX - RHEO_X0);
      const wiperY = POT_Y0 + POT_H - (POT_H * p) / 100;
      const potActiveH = Math.max(0, (POT_Y0 + POT_H) - wiperY);
      const potShift = POT_WIPER_Y0 - wiperY;

      rheoWiper?.setAttribute('transform', `translate(${wiperX} 0)`);
      if (rheoActive) {
        rheoActive.setAttribute('width', String(activeW));
      }
      potWiper?.setAttribute('transform', `translate(0 ${-potShift})`);
      if (potActive) {
        potActive.setAttribute('y', String(wiperY));
        potActive.setAttribute('height', String(potActiveH));
      }
      if (potOutTop) {
        potOutTop.setAttribute('cy', String(wiperY));
      }
      const potLead = rheoSlide.querySelector('.pot-wiper-lead');
      if (potLead) {
        potLead.setAttribute('d', `M108 ${wiperY} H162 M100 52 H162`);
      }

      rheoSlide.querySelectorAll('.rheo-r-pct, .pot-u-pct, .rheo-panel-pct').forEach((el) => {
        el.textContent = String(Math.round(p));
      });
      const pctEl = rheoSlide.querySelector('.rheo-slider-pct');
      if (pctEl) pctEl.textContent = `${Math.round(p)}%`;
      if (range && Number(range.value) !== Math.round(p)) {
        range.value = String(Math.round(p));
      }
    }

    range?.addEventListener('input', () => setRheoPosition(Number(range.value)));

    function bindSvgDrag(svg, wiper, axis) {
      if (!svg || !wiper) return;
      let dragging = false;

      function pctFromEvent(e) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return null;
        const loc = pt.matrixTransform(ctm.inverse());
        if (axis === 'x') {
          return ((loc.x - RHEO_X0) / RHEO_LEN) * 100;
        }
        return ((POT_Y0 + POT_H - loc.y) / POT_H) * 100;
      }

      function onMove(e) {
        if (!dragging) return;
        e.preventDefault();
        const pct = pctFromEvent(e);
        if (pct != null) setRheoPosition(pct);
      }

      function onEnd() {
        dragging = false;
        wiper.style.cursor = 'grab';
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onEnd);
      }

      wiper.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragging = true;
        wiper.style.cursor = 'grabbing';
        wiper.setPointerCapture?.(e.pointerId);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onEnd);
      });

      svg.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.rheo-wiper, .pot-wiper')) return;
        const pct = pctFromEvent(e);
        if (pct != null) setRheoPosition(pct);
      });
    }

    bindSvgDrag(rheoSlide.querySelector('.rheo-demo-svg'), rheoWiper, 'x');
    bindSvgDrag(rheoSlide.querySelector('.pot-demo-svg'), potWiper, 'y');
    setRheoPosition(Number(range?.value) || 50);
  }

  /* ===== Lecture 2: static characteristic graphs ===== */
  const charSlide = document.querySelector('.slide-char-static');
  if (charSlide) {
    const range = charSlide.querySelector('.char-x-range');
    const NR = { ox: 38, oy: 108, ex: 158, ey: 38 };
    const REV = { ox: 100, oy: 72, dx: 68, dy: -40 };

    function fmtChar(n) {
      const r = Math.round(n);
      return r > 0 ? `+${r}` : String(r);
    }

    function setCharX(xVal) {
      const x = Math.max(-100, Math.min(100, Math.round(xVal)));
      const xNorm = x / 100;
      const nrPoint = charSlide.querySelector('.char-nr-point');
      const revPoint = charSlide.querySelector('.char-rev-point');
      const nrDashV = charSlide.querySelector('.char-nr-dash-v');
      const nrDashH = charSlide.querySelector('.char-nr-dash-h');
      const revDashV = charSlide.querySelector('.char-rev-dash-v');
      const revDashH = charSlide.querySelector('.char-rev-dash-h');

      let nrPx = NR.ox;
      let nrPy = NR.oy;
      const nrR = x > 0 ? x : 0;

      if (xNorm > 0) {
        nrPx = NR.ox + (NR.ex - NR.ox) * xNorm;
        nrPy = NR.oy + (NR.ey - NR.oy) * xNorm;
      }

      const revPx = REV.ox + REV.dx * xNorm;
      const revPy = REV.oy + REV.dy * xNorm;
      const revR = x;

      nrPoint?.setAttribute('cx', String(nrPx));
      nrPoint?.setAttribute('cy', String(nrPy));
      nrPoint?.setAttribute('fill', xNorm > 0 ? '#2563eb' : '#94a3b8');
      revPoint?.setAttribute('cx', String(revPx));
      revPoint?.setAttribute('cy', String(revPy));

      if (nrDashV) {
        nrDashV.setAttribute('x1', String(nrPx));
        nrDashV.setAttribute('x2', String(nrPx));
        nrDashV.setAttribute('y1', String(nrPy));
        nrDashV.setAttribute('y2', String(NR.oy));
      }
      if (nrDashH) {
        nrDashH.setAttribute('x1', String(NR.ox));
        nrDashH.setAttribute('x2', String(nrPx));
        nrDashH.setAttribute('y1', String(nrPy));
        nrDashH.setAttribute('y2', String(nrPy));
      }
      if (revDashV) {
        revDashV.setAttribute('x1', String(revPx));
        revDashV.setAttribute('x2', String(revPx));
        revDashV.setAttribute('y1', String(revPy));
        revDashV.setAttribute('y2', String(REV.oy));
      }
      if (revDashH) {
        revDashH.setAttribute('x1', String(REV.ox));
        revDashH.setAttribute('x2', String(revPx));
        revDashH.setAttribute('y1', String(revPy));
        revDashH.setAttribute('y2', String(revPy));
      }

      const xReadout = charSlide.querySelector('.char-x-readout');
      const valX = charSlide.querySelector('.char-val-x');
      const valNr = charSlide.querySelector('.char-val-nr');
      const valR = charSlide.querySelector('.char-val-r');
      if (xReadout) xReadout.textContent = fmtChar(x);
      if (valX) valX.textContent = fmtChar(x);
      if (valNr) valNr.textContent = fmtChar(nrR);
      if (valR) valR.textContent = fmtChar(revR);

      const note = charSlide.querySelector('.char-panel-note');
      const nrDesc = charSlide.querySelector('.char-nr-desc');
      const revDesc = charSlide.querySelector('.char-rev-desc');

      if (x < 0) {
        if (note) {
          note.textContent = 'Нереверсивный: при X < 0 точка остаётся в начале (r = 0). Реверсивный: r меняет знак вместе с X.';
        }
        if (nrDesc) nrDesc.innerHTML = 'X < 0 → <strong>r = 0</strong>, линия не продолжается влево.';
        if (revDesc) revDesc.innerHTML = 'X < 0 → <strong>r < 0</strong>, точка уходит в III квадрант.';
      } else if (x === 0) {
        if (note) note.textContent = 'X = 0 → обе характеристики проходят через начало координат (r = 0).';
        if (nrDesc) nrDesc.innerHTML = 'Линия только при X ≥ 0. <strong>Не реагирует</strong> на знак X (направление).';
        if (revDesc) revDesc.innerHTML = 'Линия через начало координат. <strong>Чувствителен</strong> к знаку X.';
      } else {
        if (note) {
          note.textContent = `Нереверсивный: r = ${fmtChar(nrR)}. Реверсивный: r = ${fmtChar(revR)} — пропорционально X.`;
        }
        if (nrDesc) nrDesc.innerHTML = 'X > 0 → точка движется по линии в I квадранте.';
        if (revDesc) revDesc.innerHTML = 'X > 0 → точка в I квадранте, r растёт с X.';
      }

      if (range && Number(range.value) !== x) range.value = String(x);
    }

    range?.addEventListener('input', () => setCharX(Number(range.value)));

    function bindCharSvgClick(svg, ox, halfSpan) {
      if (!svg) return;
      svg.addEventListener('click', (e) => {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;
        const loc = pt.matrixTransform(ctm.inverse());
        const xNorm = (loc.x - ox) / halfSpan;
        setCharX(Math.round(Math.max(-1, Math.min(1, xNorm)) * 100));
      });
    }

    bindCharSvgClick(charSlide.querySelector('.char-nr-svg'), NR.ox, NR.ex - NR.ox);
    bindCharSvgClick(charSlide.querySelector('.char-rev-svg'), REV.ox, REV.dx);

    setCharX(Number(range?.value) || 60);
  }

  /* ===== Lecture 2: piezoelectric sensors ===== */
  const piezoSlide = document.querySelector('.slide-piezo-interactive');
  if (piezoSlide) {
    const piezoPanel = document.getElementById('piezoPanel');
    const piezoInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Пьезодатчик — <strong>генераторный</strong>: сигнал без внешнего питания. Как конденсатор: <var>q</var> заряжает электроды до <var>U</var> = <var>q</var>/<var>C</var>, где <var>C</var> — <strong>ёмкость между проводниками</strong> (между электродами, кристалл — диэлектрик).</p><p>Заряд возникает <strong>там, где приложена сила</strong> → избирательность. Знак заряда зависит от сжатия или растяжения.</p><p>Элементы: <strong>монокристалл</strong> или <strong>многослойная</strong> структура.</p>'
      },
      direct: {
        title: 'Прямой пьезоэффект',
        html: '<p><strong>Прямой эффект:</strong> механическая сила → электрический заряд.</p><p>Чувствительность: <var>S</var> = Δ<var>U</var>/Δ<var>F</var>. При <var>n</var> пластинах, соединённых параллельно, ёмкости складываются:</p><p class="piezo-panel-formula"><var>S</var> = <var>n</var>·<var>K</var><sub>0</sub> / (<var>C</var><sub>вх</sub> + <var>n</var>·<var>C</var><sub>0</sub>)</p><p><var>K</var><sub>0</sub> — пьезомодуль; <var>C</var><sub>вх</sub> — ёмкость цепи; <var>C</var><sub>0</sub> — ёмкость одной пластины.</p><p class="piezo-s-calc">S ≈ <strong class="piezo-s-val">1.00</strong> (отн. ед.)</p>'
      },
      inverse: {
        title: 'Обратный эффект и резонансные',
        html: '<p><strong>Обратный пьезоэффект:</strong> напряжение → деформация (пьезоизлучатели, преобразователи).</p><p><strong>Класс 2</strong> — <strong>резонансные</strong> пьезодатчики на обратном эффекте.</p><p>Также используют <strong>тензочувствительность</strong>, <strong>термочувствительность</strong> и <strong>акустическую</strong> чувствительность пьезоэлементов.</p>'
      },
      apps: {
        title: 'Применение',
        html: '<p>Измерение <strong>давления</strong>, <strong>ускорения</strong>, <strong>массы</strong>, <strong>угловой скорости</strong>, <strong>концентрации газа</strong>, <strong>влажности</strong>.</p><p>Часто точность выше, чем у датчиков на других физических принципах.</p><p><strong>Класс 1</strong> (прямой эффект): линейная и угловая скорость, динамическое и квазистатическое давление, силы.</p>'
      },
      materials: {
        title: 'Материалы',
        html: '<p><strong>Монокристаллы:</strong> кварц, турмалин, сегнетова соль.</p><p><strong>Пьезокерамика</strong> (BaTiO<sub>3</sub> и др.) — наиболее перспективна: простая технология, низкая стоимость, высокая радиационная стойкость, устойчивость к агрессивным средам.</p>'
      },
      force: {
        title: 'Сила F',
        html: '<p>Прикладываемая <strong>сила F</strong> деформирует кристалл. Чем больше F, тем больше заряд <var>q</var> и напряжение <var>U</var>.</p><p>При <strong>растяжении</strong> знак зарядов на электродах меняется на противоположный.</p>'
      },
      crystal: {
        title: 'Пьезоэлемент',
        html: '<p><strong>Кристалл или пьезокерамика</strong> — диэлектрик между электродами. Деформация перестраивает решётку → появляется поляризация и свободный заряд на гранях.</p>'
      },
      electrode: {
        title: 'Электроды',
        html: '<p><strong>Электроды</strong> — проводники, между которыми образуется ёмкость <var>C</var>. Они снимают заряд <var>q</var> с граней пьезоэлемента.</p><p>В цепь также входит ёмкость входа прибора <var>C</var><sub>вх</sub> (параллельно <var>n</var>·<var>C</var><sub>0</sub> пластин).</p>'
      }
    };

    let piezoMode = 'compress';
    const tabKeys = ['intro', 'direct', 'inverse', 'apps', 'materials'];
    let activePiezoTab = 'intro';

    function showPiezoInfo(key) {
      const data = piezoInfo[key] || piezoInfo.intro;
      if (!piezoPanel) return;
      if (tabKeys.includes(key)) activePiezoTab = key;
      piezoPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      piezoSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
      });
      piezoSlide.querySelectorAll('.piezo-block').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
      updatePiezoCalc();
    }

    function updatePiezoCalc() {
      const n = Number(piezoSlide.querySelector('.piezo-n-range')?.value) || 1;
      const f = Number(piezoSlide.querySelector('.piezo-f-range')?.value) || 0;
      const t = f / 100;
      const sign = piezoMode === 'compress' ? 1 : -1;
      const c0 = 1;
      const cIn = 2;
      const k0 = 1;
      const s = (n * k0) / (cIn + n * c0);
      const q = sign * t * n * 2.4;
      const u = sign * t * s * 100;

      const REST_TOP = 44;
      const REST_CRY_Y = 54;
      const REST_CRY_H = 70;
      const BOT_Y = 124;
      const CRY_X = 145;
      const CRY_W = 170;
      const CX = 230;
      const FORCE_X = 108;

      let topY;
      let cryY;
      let cryH;
      if (piezoMode === 'compress') {
        topY = REST_TOP + t * 18;
        cryY = topY + 10;
        cryH = BOT_Y - cryY;
      } else {
        cryH = REST_CRY_H + t * 14;
        cryY = BOT_Y - cryH;
        topY = cryY - 10;
      }

      const topEl = piezoSlide.querySelector('.piezo-electrode-top');
      const crystal = piezoSlide.querySelector('.piezo-crystal');
      const labelTop = piezoSlide.querySelector('.piezo-label-top');
      const cBracket = piezoSlide.querySelector('.piezo-c-bracket');
      const restOutline = piezoSlide.querySelector('.piezo-rest-outline');
      const forceArrow = piezoSlide.querySelector('.piezo-force-arrow');
      const forceHead = piezoSlide.querySelector('.piezo-force-head');
      const forceGroup = piezoSlide.querySelector('.piezo-force-group');
      const cryT1 = piezoSlide.querySelector('.piezo-crystal-t1');
      const cryT2 = piezoSlide.querySelector('.piezo-crystal-t2');

      if (topEl) topEl.setAttribute('y', String(topY));
      if (labelTop) labelTop.setAttribute('y', String(topY - 4));
      if (crystal) {
        crystal.setAttribute('y', String(cryY));
        crystal.setAttribute('height', String(Math.max(8, cryH)));
        crystal.removeAttribute('transform');
      }
      if (cryT1) cryT1.setAttribute('y', String(cryY + cryH * 0.38));
      if (cryT2) cryT2.setAttribute('y', String(cryY + cryH * 0.58));
      if (cBracket) {
        cBracket.setAttribute('d', `M348 ${topY} V${BOT_Y}`);
        const bracketEnds = piezoSlide.querySelector('.piezo-c-bracket-ends');
        if (bracketEnds) {
          bracketEnds.setAttribute('d', `M342 ${topY} H348 M342 ${BOT_Y} H348`);
        }
      }
      if (restOutline) {
        restOutline.setAttribute('opacity', f > 4 ? '0.75' : '0');
      }

      const arrowTip = topY - 4;
      const arrowStart = Math.max(14, arrowTip - 28);
      if (forceArrow) {
        if (piezoMode === 'compress') {
          forceArrow.setAttribute('d', `M${FORCE_X} ${arrowStart} V${arrowTip}`);
        } else {
          const tail = topY - 4;
          forceArrow.setAttribute('d', `M${FORCE_X} ${tail + 28} V${tail}`);
        }
      }
      if (forceHead) {
        if (piezoMode === 'compress') {
          forceHead.setAttribute('d', `M${FORCE_X} ${arrowTip} L${FORCE_X - 8} ${arrowTip - 10} L${FORCE_X + 8} ${arrowTip - 10} Z`);
        } else {
          const tail = topY - 4;
          forceHead.setAttribute('d', `M${FORCE_X} ${tail} L${FORCE_X - 8} ${tail + 10} L${FORCE_X + 8} ${tail + 10} Z`);
        }
      }

      const deformPct = piezoMode === 'compress' ? -t * 100 * (18 / REST_CRY_H) : t * 100 * (14 / REST_CRY_H);
      const deformEl = piezoSlide.querySelector('.piezo-deform-readout');
      if (deformEl) {
        const signD = deformPct > 0 ? '+' : '';
        deformEl.textContent = `Δh = ${signD}${deformPct.toFixed(0)}%`;
      }

      const qReadout = piezoSlide.querySelector('.piezo-q-readout');
      if (qReadout) {
        const qAbs = Math.abs(q);
        qReadout.textContent = qAbs < 0.05 ? 'q ≈ 0 нКл' : `q ≈ ${q > 0 ? '+' : '−'}${qAbs.toFixed(1)} нКл`;
      }

      const uReadout = piezoSlide.querySelector('.piezo-u-readout');
      if (uReadout) {
        const uAbs = Math.abs(u);
        uReadout.textContent = uAbs < 0.5 ? 'U ≈ 0 мВ' : `U ≈ ${u > 0 ? '+' : '−'}${uAbs.toFixed(0)} мВ`;
      }

      const chPlus = piezoSlide.querySelector('.piezo-ch-plus');
      const chMinus = piezoSlide.querySelector('.piezo-ch-minus');
      const leadPlus = piezoSlide.querySelector('.piezo-lead-plus');
      const leadMinus = piezoSlide.querySelector('.piezo-lead-minus');
      const chargeTopY = topY + 5;
      const chargeBotY = BOT_Y + 5;
      const chargeScale = 0.85 + t * 0.35;
      if (chPlus) {
        chPlus.setAttribute('y', String(chargeTopY));
        chPlus.setAttribute('font-size', String(16 * chargeScale));
        if (f < 5) chPlus.setAttribute('fill', '#94a3b8');
        else chPlus.setAttribute('fill', sign > 0 ? '#dc2626' : '#2563eb');
      }
      if (chMinus) {
        chMinus.setAttribute('y', String(chargeBotY));
        chMinus.setAttribute('font-size', String(16 * chargeScale));
        if (f < 5) chMinus.setAttribute('fill', '#94a3b8');
        else chMinus.setAttribute('fill', sign > 0 ? '#2563eb' : '#dc2626');
      }
      if (leadPlus) {
        leadPlus.setAttribute('d', `M66 ${chargeTopY - 3} H130`);
        leadPlus.setAttribute('opacity', String(0.25 + t * 0.75));
      }
      if (leadMinus) {
        leadMinus.setAttribute('d', `M66 ${chargeBotY - 3} H130`);
        leadMinus.setAttribute('opacity', String(0.25 + t * 0.75));
      }

      const forceLabel = piezoSlide.querySelector('.piezo-force-label');
      if (forceLabel) {
        if (piezoMode === 'compress') {
          forceLabel.setAttribute('x', String(FORCE_X));
          forceLabel.setAttribute('y', String(Math.max(11, arrowStart - 3)));
          forceLabel.setAttribute('text-anchor', 'middle');
          forceLabel.textContent = 'F ↓';
        } else {
          const tail = topY - 4;
          forceLabel.setAttribute('x', String(FORCE_X));
          forceLabel.setAttribute('y', String(tail + 42));
          forceLabel.setAttribute('text-anchor', 'middle');
          forceLabel.textContent = 'F ↑';
        }
      }

      const fVal = piezoSlide.querySelector('.piezo-f-val');
      const nVal = piezoSlide.querySelector('.piezo-n-val');
      if (fVal) fVal.textContent = `${f}%`;
      if (nVal) nVal.textContent = String(n);

      const sVal = piezoPanel?.querySelector('.piezo-s-val');
      if (sVal) sVal.textContent = s.toFixed(2);

      piezoSlide.querySelectorAll('.piezo-mode-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === piezoMode);
      });

      if (crystal) {
        crystal.setAttribute('fill', f > 10 ? '#fde68a' : '#fef3c7');
      }
    }

    piezoSlide.addEventListener('click', (e) => {
      const legendToggle = e.target.closest('.piezo-legend-toggle');
      if (legendToggle) {
        const panel = piezoSlide.querySelector('#piezoLegend');
        const isOpen = legendToggle.getAttribute('aria-expanded') === 'true';
        legendToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        if (panel) panel.hidden = isOpen;
        return;
      }
      const target = e.target.closest('[data-info]');
      if (target) {
        e.stopPropagation();
        showPiezoInfo(target.dataset.info);
        return;
      }
      const modeBtn = e.target.closest('.piezo-mode-btn');
      if (modeBtn) {
        piezoMode = modeBtn.dataset.mode === 'tension' ? 'tension' : 'compress';
        updatePiezoCalc();
      }
    });

    piezoSlide.querySelector('.piezo-f-range')?.addEventListener('input', updatePiezoCalc);
    piezoSlide.querySelector('.piezo-n-range')?.addEventListener('input', updatePiezoCalc);

    showPiezoInfo('intro');
    updatePiezoCalc();
  }

  /* ===== Lecture 2: strain gauges ===== */
  const strainSlide = document.querySelector('.slide-strain-interactive');
  if (strainSlide) {
    const strainPanel = document.getElementById('strainPanel');
    const strainInfo = {
      intro: {
        title: 'Обзор',
        html: '<p><strong>Тензодатчик</strong> измеряет деформацию объекта и исследует его поведение под механическими воздействиями.</p><p>Резистивный элемент на подложке: растяжение или сжатие меняет <var>R</var>. Класс — <strong>параметрические</strong> датчики (нужно внешнее питание).</p><p>Применяют в динамометрах, испытаниях конструкций, датчиках силы и давления.</p>'
      },
      principle: {
        title: 'Принцип действия',
        html: '<p>Сопротивление проводника: <var>R</var> = <span class="math-sym">ρ</span>·<var>L</var>/<var>S</var>.</p><p>При деформации <var>R</var> меняется по двум причинам:</p><ul><li>изменение <strong>геометрии</strong> (<var>L</var>, диаметр);</li><li>изменение <strong>удельного сопротивления</strong> <span class="math-sym">ρ</span> материала чувствительного элемента.</li></ul>'
      },
      k: {
        title: 'Коэффициент тензочувствительности k',
        html: '<p><var>k</var> = (Δ<var>R</var>/<var>R</var>) / (Δ<var>L</var>/<var>L</var>) — <strong>безразмерная</strong> величина.</p><p><var>k</var> &gt; 0: при растяжении <var>R</var> растёт (большинство металлов, <var>k</var> ≈ 2).</p><p><var>k</var> &lt; 0: при растяжении <var>R</var> падает.</p><p class="strain-panel-calc">Δ<var>R</var>/<var>R</var> = <strong class="strain-dr-val">+0.40%</strong> при ε = <strong class="strain-e-panel">+0.20%</strong></p>'
      },
      specs: {
        title: 'Параметры',
        html: '<p>Типичное сопротивление тензорезистора: <strong>10…1000 Ом</strong>.</p><p>Материалы: <strong>нержавеющая</strong>, <strong>легированная сталь</strong>, <strong>алюминий</strong>.</p><p>Чувствительность: <strong>1…3 мВ/В</strong> на единицу нагрузки (от напряжения питания).</p><p>Нагрузка: от граммов до сотен тонн. Статическая характеристика — <strong>линейная</strong>.</p>'
      },
      types: {
        title: 'Конструкции',
        html: '<p><strong>Наклеиваемые</strong> и <strong>ненаклеиваемые</strong> тензорезисторы.</p><p><strong>Тензорезистивный</strong> — по изменению <var>R</var>; <strong>тензометрический</strong> — общий термин (также пьезо-, оптико-поляризационные, волоконно-оптические, механические методы).</p><p>Конструкции: <strong>мостовые</strong>, <strong>шайбовые</strong>, <strong>сильфонные</strong>, одноточечные, колонные.</p>'
      },
      apps: {
        title: 'Применение',
        html: '<p>Контроль <strong>промышленных конструкций</strong>, систем <strong>безопасности</strong>, <strong>весовых</strong> систем.</p><p>Тензорезистивный эффект: сопротивление твёрдых тел меняется при сжатии/растяжении из‑за перестройки атомной структуры.</p>'
      },
      pros: {
        title: 'Достоинства и недостатки',
        html: '<p><strong>+</strong> малые габариты и масса; линейная характеристика; низкая инерция → статический и динамический режимы.</p><p><strong>−</strong> высокая <strong>температурная</strong> чувствительность (нужна компенсация).</p>'
      }
    };

    const tabKeys = ['intro', 'principle', 'k', 'types', 'apps', 'pros', 'specs'];
    const R0 = 120;
    let strainK = 2;

    function fmtStrainPct(v) {
      const sign = v > 0 ? '+' : '';
      return `${sign}${v.toFixed(2)}%`;
    }

    function showStrainInfo(key) {
      const data = strainInfo[key] || strainInfo.intro;
      if (!strainPanel) return;
      strainPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      strainSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabKeys.includes(key) && btn.dataset.info === key);
      });
      updateStrain();
    }

    function updateStrain() {
      const eRaw = Number(strainSlide.querySelector('.strain-e-range')?.value) || 0;
      const eps = eRaw / 100;
      const drRel = strainK * eps;
      const r = R0 * (1 + drRel);
      const stretch = 1 + eps * 0.35;

      const grid = strainSlide.querySelector('.strain-grid');
      if (grid) {
        grid.setAttribute('transform', `translate(220 100) scale(${stretch} 1) translate(-220 -100)`);
      }

      const base = strainSlide.querySelector('.strain-base');
      if (base) {
        const bw = 320 * stretch;
        base.setAttribute('width', String(bw));
        base.setAttribute('x', String(220 - bw / 2));
      }

      const label = strainSlide.querySelector('.strain-force-label');
      if (label) {
        label.textContent = eRaw >= 0 ? 'растяжение →' : '← сжатие';
      }

      const readout = strainSlide.querySelector('.strain-r-readout');
      if (readout) {
        readout.textContent = `R ≈ ${r.toFixed(0)} Ом (${fmtStrainPct(drRel * 100)})`;
      }

      const eVal = strainSlide.querySelector('.strain-e-val');
      if (eVal) eVal.textContent = fmtStrainPct(eps);

      const drVal = strainPanel?.querySelector('.strain-dr-val');
      const ePanel = strainPanel?.querySelector('.strain-e-panel');
      if (drVal) drVal.textContent = fmtStrainPct(drRel * 100);
      if (ePanel) ePanel.textContent = fmtStrainPct(eps);

      strainSlide.querySelectorAll('.strain-mode-btn').forEach((btn) => {
        btn.classList.toggle('active', Number(btn.dataset.k) === strainK);
      });
    }

    strainSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-info]');
      if (tab && tab.classList.contains('asutp-tab')) {
        e.stopPropagation();
        showStrainInfo(tab.dataset.info);
        return;
      }
      const kBtn = e.target.closest('.strain-mode-btn');
      if (kBtn) {
        strainK = Number(kBtn.dataset.k);
        showStrainInfo('k');
      }
    });

    strainSlide.querySelector('.strain-e-range')?.addEventListener('input', updateStrain);

    showStrainInfo('intro');
    updateStrain();
  }

  /* ===== Lecture 2: inductive sensors ===== */
  const indSlide = document.querySelector('.slide-inductive-interactive');
  if (indSlide) {
    const indPanel = document.getElementById('indPanel');
    const indInfo = {
      intro: {
        title: 'Обзор',
        html: '<p><strong>Индуктивный датчик</strong> — безконтактное измерение перемещения деталей машин, механизмов и роботов.</p><p>Выходной сигнал — ток <var>I</var> (или напряжение на нагрузке), пропорциональный положению якоря.</p><p><strong>Как δ влияет на <var>I</var>:</strong></p><ol><li>Увеличивается воздушный зазор δ между сердечником и якорем.</li><li>Растёт магнитное сопротивление: <var>R</var><sub>м</sub> ~ δ/<var>S</var><sub>ст</sub> (численно см. под формулами).</li><li>Индуктивность падает: <var>L</var> ~ 1/<var>R</var><sub>м</sub>.</li><li>Уменьшается ω<var>L</var> → при том же <var>U</var> ток <var>I</var> <strong>растёт</strong>.</li></ol><p class="ind-effect-live"></p>'
      },
      principle: {
        title: 'Принцип действия',
        html: '<p>На обмотку подают <strong>переменное напряжение</strong> ~<var>U</var>. Перемещение якоря меняет геометрию магнитной цепи:</p><ul><li><strong>вертикально</strong> — меняется зазор δ;</li><li><strong>горизонтально</strong> — меняется площадь сечения <var>S</var><sub>ст</sub> воздушного зазора.</li></ul><p>В обоих случаях меняется <var>R</var><sub>м</sub> → меняется <var>L</var> → по формуле тока меняется <var>I</var>.</p><p class="ind-panel-formula"><var>I</var> = <var>U</var> / √(<var>r</var><sub>д</sub>² + (ω<var>L</var>)²)</p><p>Чем <strong>меньше</strong> <var>L</var>, тем меньше знаменатель и <strong>больше</strong> <var>I</var>.</p><p class="ind-effect-live"></p>'
      },
      formula: {
        title: 'Формулы',
        html: '<p>Ток в обмотке:</p><p class="ind-panel-formula"><var>I</var> = <var>U</var> / √(<var>r</var><sub>д</sub>² + (ω<var>L</var>)²)</p><p>Магнитное сопротивление зазора: <var>R</var><sub>мв</sub> ~ δ/<var>S</var><sub>ст</sub>. При постоянном сечении <var>R</var><sub>м</sub> растёт пропорционально δ.</p><p>Связь с индуктивностью: <var>L</var> ~ 1/<var>R</var><sub>м</sub> — при δ↑ растёт <var>R</var><sub>м</sub>, падает <var>L</var>, растёт <var>I</var>.</p><p class="ind-panel-calc"><var>R</var><sub>м</sub> ≈ <strong class="ind-r-val">4.5</strong> · <var>L</var> ≈ <strong class="ind-l-val">12</strong> мГн · <var>I</var> ≈ <strong class="ind-i-val">48</strong> мА</p><p class="ind-effect-live"></p>'
      },
      parts: {
        title: 'Состав (рис. 2.6)',
        html: '<p><strong>1</strong> — катушка индуктивности на сердечнике.</p><p><strong>2</strong> — магнитопровод (сердечник), неподвижная часть (статор).</p><p><strong>3</strong> — якорь, закреплён на перемещаемом объекте.</p><p>Неподвижный статор + подвижный якорь образуют переменный воздушный зазор δ.</p>'
      },
      core: {
        title: 'Сердечник (2)',
        html: '<p>Магнитопровод из <strong>электротехнической стали</strong> замыкает магнитный поток. Геометрия определяет, как δ влияет на <var>R</var><sub>м</sub>.</p>'
      },
      coil: {
        title: 'Обмотка (1)',
        html: '<p><strong>Катушка индуктивности</strong> — на сердечнике. На неё подают переменное <var>U</var>; по току <var>I</var> судят о положении якоря.</p>'
      }
    };

    const indTabKeys = ['intro', 'principle', 'formula', 'parts'];
    let indMode = 'vertical';
    const GAP_MAX = 4;
    const GAP_MIN = 0.5;
    const L_MAX = 20;
    const U = 24;
    const RD = 10;
    const OMEGA = 314;
    const RM_BASE = 1;

    function calcRm(delta, areaFactor, mode) {
      const gapPart = (delta / GAP_MIN) * RM_BASE;
      return mode === 'vertical' ? gapPart : gapPart / areaFactor;
    }

    function getIndEffectHtml(delta, rm, lMh, iMa, mode, t) {
      if (mode === 'vertical') {
        const gapWord = delta >= 3 ? 'большой' : delta <= 1.2 ? 'малый' : 'средний';
        return `Сейчас <strong>δ = ${delta.toFixed(1)} мм</strong> (${gapWord} зазор) → <var>R</var><sub>м</sub> ≈ <strong>${rm.toFixed(1)}</strong> → <var>L</var> ≈ <strong>${lMh.toFixed(0)}</strong> мГн → <var>I</var> ≈ <strong>${iMa.toFixed(0)}</strong> мА`;
      }
      const sPct = 50 + t * 50;
      return `Сейчас <strong>S ~ ${sPct.toFixed(0)}%</strong> сечения зазора → <var>R</var><sub>м</sub> ≈ <strong>${rm.toFixed(1)}</strong> → <var>L</var> ≈ <strong>${lMh.toFixed(0)}</strong> мГн → <var>I</var> ≈ <strong>${iMa.toFixed(0)}</strong> мА`;
    }

    function showIndInfo(key) {
      const data = indInfo[key] || indInfo.intro;
      if (!indPanel) return;
      indPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (!indPanel.querySelector('.ind-effect-live')) {
        indPanel.insertAdjacentHTML('beforeend', '<p class="ind-effect-live"></p>');
      }
      indSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', indTabKeys.includes(key) && btn.dataset.info === key);
      });
      indSlide.querySelectorAll('.ind-block').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
      updateInductive();
    }

    function updateInductive() {
      const raw = Number(indSlide.querySelector('.ind-d-range')?.value) || 50;
      const t = raw / 100;
      let delta;
      let lMh;
      let areaFactor = 1;
      if (indMode === 'vertical') {
        delta = GAP_MAX - t * (GAP_MAX - GAP_MIN);
        lMh = L_MAX * (GAP_MIN / delta);
      } else {
        delta = 2;
        areaFactor = 0.5 + t * 0.5;
        lMh = L_MAX * areaFactor;
      }
      const rm = calcRm(delta, areaFactor, indMode);
      const lH = lMh / 1000;
      const iMa = (U / Math.sqrt(RD * RD + (OMEGA * lH) * (OMEGA * lH))) * 1000;
      const CORE_BOT = 148;
      const armY = 148 + (delta - GAP_MIN) * (20 / (GAP_MAX - GAP_MIN));
      const gapLine = indSlide.querySelector('.ind-gap-line');
      const gapTickBot = indSlide.querySelector('.ind-gap-tick-bot');
      const gapDim = indSlide.querySelector('.ind-gap-dim');
      const armature = indSlide.querySelector('.ind-armature');
      const gapLabel = indSlide.querySelector('.ind-gap-label');
      const lblArm = indSlide.querySelector('.ind-lbl-arm');
      const numArm = indSlide.querySelector('.ind-num-arm');
      const leadArm = indSlide.querySelector('.ind-lead-arm');
      const fluxBot = indSlide.querySelector('.ind-flux-bot');
      const fluxBotR = indSlide.querySelector('.ind-flux-bot-r');
      const readout = indSlide.querySelector('.ind-readout');
      const dVal = indSlide.querySelector('.ind-d-val');

      if (armature && indMode === 'vertical') {
        armature.setAttribute('y', String(armY));
        armature.setAttribute('x', '145');
      } else if (armature) {
        armature.setAttribute('y', '168');
        const shift = (t - 0.5) * 40;
        armature.setAttribute('x', String(145 + shift));
      }

      if (indMode === 'vertical') {
        if (gapDim) gapDim.setAttribute('opacity', '1');
        if (gapLine) {
          gapLine.setAttribute('y1', String(CORE_BOT));
          gapLine.setAttribute('y2', String(armY));
        }
        if (gapTickBot) {
          gapTickBot.setAttribute('y1', String(armY));
          gapTickBot.setAttribute('y2', String(armY));
        }
        if (gapLabel) {
          gapLabel.setAttribute('y', String(CORE_BOT + (armY - CORE_BOT) / 2 + 4));
        }
        if (fluxBot) {
          fluxBot.setAttribute('d', `M152 ${CORE_BOT} C118 ${CORE_BOT + 18} 118 ${armY + 10} 152 ${armY}`);
        }
        if (fluxBotR) {
          fluxBotR.setAttribute('d', `M248 ${CORE_BOT} C282 ${CORE_BOT + 18} 282 ${armY + 10} 248 ${armY}`);
        }
      } else if (gapDim) {
        gapDim.setAttribute('opacity', '0');
      }

      const armMidY = indMode === 'vertical' ? armY + 13 : 181;
      if (lblArm) lblArm.setAttribute('y', String(armMidY + 4));
      if (numArm) numArm.setAttribute('y', String(armMidY + 4));
      if (leadArm) {
        const armX = Number(armature?.getAttribute('x')) || 145;
        leadArm.setAttribute('y1', String(armMidY));
        leadArm.setAttribute('y2', String(armMidY));
        leadArm.setAttribute('x2', String(armX - 3));
      }

      if (readout) {
        const modeNote = indMode === 'vertical' ? `δ = ${delta.toFixed(1)} мм` : `S ~ ${(50 + t * 50).toFixed(0)}%`;
        readout.textContent = `${modeNote} · Rₘ ≈ ${rm.toFixed(1)} · L ≈ ${lMh.toFixed(0)} мГн · I ≈ ${iMa.toFixed(0)} мА`;
      }
      if (dVal) {
        dVal.textContent = indMode === 'vertical' ? `${delta.toFixed(1)} мм` : `${(50 + t * 50).toFixed(0)}% S`;
      }

      const chainEl = indSlide.querySelector('.ind-formula-chain');
      if (chainEl) {
        chainEl.innerHTML = indMode === 'vertical'
          ? 'δ ↑ → <var>R</var><sub>м</sub> ↑ → <var>L</var> ↓ → <var>I</var> ↑'
          : '<var>S</var><sub>ст</sub> ↓ → <var>R</var><sub>м</sub> ↑ → <var>L</var> ↓ → <var>I</var> ↑';
      }

      const effectHtml = getIndEffectHtml(delta, rm, lMh, iMa, indMode, t);
      indSlide.querySelectorAll('.ind-effect-live').forEach((el) => {
        el.innerHTML = effectHtml;
      });

      const rVal = indPanel?.querySelector('.ind-r-val');
      const lVal = indPanel?.querySelector('.ind-l-val');
      const iVal = indPanel?.querySelector('.ind-i-val');
      if (rVal) rVal.textContent = rm.toFixed(1);
      if (lVal) lVal.textContent = lMh.toFixed(0);
      if (iVal) iVal.textContent = iMa.toFixed(0);

      indSlide.querySelectorAll('.ind-mode-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === indMode);
      });
    }

    indSlide.addEventListener('click', (e) => {
      const info = e.target.closest('[data-info]');
      if (info) {
        e.stopPropagation();
        showIndInfo(info.dataset.info);
        return;
      }
      const modeBtn = e.target.closest('.ind-mode-btn');
      if (modeBtn) {
        indMode = modeBtn.dataset.mode === 'horizontal' ? 'horizontal' : 'vertical';
        updateInductive();
      }
    });

    indSlide.querySelector('.ind-d-range')?.addEventListener('input', updateInductive);

    showIndInfo('intro');
    updateInductive();
  }

  /* ===== Lecture 2: inductive U(δ) characteristic ===== */
  const indCharSlide = document.querySelector('.slide-ind-char-interactive');
  if (indCharSlide) {
    const indCharPanel = document.getElementById('indCharPanel');
    const indCharInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Зависимость <strong>изменения напряжения на нагрузке</strong> Δ<var>U</var><sub>н</sub> от воздушного зазора δ.</p><p>В широком диапазоне δ характеристика <strong>линейна</strong> — удобно для измерения перемещения по напряжению.</p><p>Начальный участок (до левой пунктирной линии) — нелинейный: в модели не учтены все факторы магнитной цепи.</p>'
      },
      linear: {
        title: 'Линейный участок',
        html: '<p>Между пунктирными линиями — <strong>рабочий диапазон</strong> датчика.</p><p>Здесь Δ<var>U</var><sub>н</sub> ≈ <var>k</var>·δ: по напряжению на нагрузке однозначно судят о зазоре.</p><p>Пунктирная касательная показывает идеальную прямую в этой зоне.</p>'
      },
      cons: {
        title: 'Недостатки простого датчика',
        html: '<p><strong>1.</strong> Фаза тока не меняется при смене направления перемещения — нужен начальный зазор и начальный ток.</p><p><strong>2.</strong> Ток в нагрузке зависит от <strong>амплитуды и частоты</strong> питающего напряжения — чувствительность «плывёт».</p><p>Эти недостатки снимает <strong>дифференциальная схема</strong> (следующий слайд).</p>'
      }
    };
    const indCharTabKeys = ['intro', 'linear', 'cons'];
    const CHAR_D_MAX = 5;
    const CHAR_D_LIN0 = 0.8;
    const CHAR_D_LIN1 = 3.6;
    const CHAR_X0 = 56;
    const CHAR_X1 = 392;
    const CHAR_Y0 = 188;
    const CHAR_Y1 = 32;
    const CHAR_U_LIN0 = 14;
    const CHAR_U_LIN1 = 86;

    function calcUn(delta) {
      const d = Math.max(0, delta);
      if (d <= CHAR_D_LIN0) {
        return CHAR_U_LIN0 * Math.pow(d / CHAR_D_LIN0, 1.65);
      }
      if (d <= CHAR_D_LIN1) {
        return CHAR_U_LIN0 + (CHAR_U_LIN1 - CHAR_U_LIN0) * (d - CHAR_D_LIN0) / (CHAR_D_LIN1 - CHAR_D_LIN0);
      }
      const t = (d - CHAR_D_LIN1) / (CHAR_D_MAX - CHAR_D_LIN1);
      return CHAR_U_LIN1 + (100 - CHAR_U_LIN1) * (1 - Math.exp(-2.8 * t));
    }

    function deltaToX(delta) {
      return CHAR_X0 + (delta / CHAR_D_MAX) * (CHAR_X1 - CHAR_X0);
    }

    function uToY(u) {
      return CHAR_Y0 - (u / 100) * (CHAR_Y0 - CHAR_Y1);
    }

    function svgEl(name, attrs) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', name);
      Object.keys(attrs).forEach((k) => el.setAttribute(k, attrs[k]));
      return el;
    }

    function drawIndCharAxes() {
      const ticks = indCharSlide.querySelector('.ind-char-ticks');
      if (ticks) {
        ticks.replaceChildren();
        for (let mm = 0; mm <= CHAR_D_MAX; mm += 1) {
          const x = deltaToX(mm).toFixed(1);
          ticks.appendChild(svgEl('line', {
            x1: x, y1: String(CHAR_Y0), x2: x, y2: String(CHAR_Y0 + 5),
            stroke: '#1e293b', 'stroke-width': '1'
          }));
          const tx = svgEl('text', { x, y: String(CHAR_Y0 + 16), 'text-anchor': 'middle' });
          tx.textContent = String(mm);
          ticks.appendChild(tx);
        }
        [50, 100].forEach((u) => {
          const y = uToY(u).toFixed(1);
          ticks.appendChild(svgEl('line', {
            x1: String(CHAR_X0 - 5), y1: y, x2: String(CHAR_X0), y2: y,
            stroke: '#1e293b', 'stroke-width': '1'
          }));
          const ty = svgEl('text', {
            x: String(CHAR_X0 - 8), y: String(Number(y) + 4), 'text-anchor': 'end'
          });
          ty.textContent = String(u);
          ticks.appendChild(ty);
        });
      }
      const xL = deltaToX(CHAR_D_LIN0);
      const xR = deltaToX(CHAR_D_LIN1);
      const yTop = CHAR_Y1 + 4;
      const zone = indCharSlide.querySelector('.ind-char-lin-zone');
      const zoneLabel = indCharSlide.querySelector('.ind-char-zone-label');
      const left = indCharSlide.querySelector('.ind-char-lin-left');
      const right = indCharSlide.querySelector('.ind-char-lin-right');
      const tan = indCharSlide.querySelector('.ind-char-tangent');
      if (zone) {
        zone.setAttribute('x', String(xL));
        zone.setAttribute('y', String(CHAR_Y1));
        zone.setAttribute('width', String(xR - xL));
        zone.setAttribute('height', String(CHAR_Y0 - CHAR_Y1));
      }
      if (zoneLabel) {
        zoneLabel.setAttribute('x', String((xL + xR) / 2));
        zoneLabel.setAttribute('y', String(yTop + 10));
      }
      [left, right].forEach((line, i) => {
        const x = i === 0 ? xL : xR;
        if (!line) return;
        line.setAttribute('x1', String(x));
        line.setAttribute('x2', String(x));
        line.setAttribute('y1', String(CHAR_Y1));
        line.setAttribute('y2', String(CHAR_Y0));
      });
      if (tan) {
        tan.setAttribute('x1', String(xL));
        tan.setAttribute('y1', String(uToY(CHAR_U_LIN0)));
        tan.setAttribute('x2', String(xR));
        tan.setAttribute('y2', String(uToY(CHAR_U_LIN1)));
      }
    }

    function showIndCharInfo(key) {
      const data = indCharInfo[key] || indCharInfo.intro;
      if (!indCharPanel) return;
      indCharPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      indCharSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', indCharTabKeys.includes(key) && btn.dataset.info === key);
      });
      updateIndChar();
    }

    function updateIndChar() {
      const raw = Number(indCharSlide.querySelector('.ind-char-d-range')?.value) || 45;
      const delta = (raw / 100) * CHAR_D_MAX;
      const u = calcUn(delta);
      const px = deltaToX(delta);
      const py = uToY(u);
      const point = indCharSlide.querySelector('.ind-char-point');
      const readout = indCharSlide.querySelector('.ind-char-readout');
      const dVal = indCharSlide.querySelector('.ind-char-d-val');
      if (point) {
        point.setAttribute('cx', String(px));
        point.setAttribute('cy', String(py));
      }
      const inLinear = delta >= CHAR_D_LIN0 && delta <= CHAR_D_LIN1;
      if (readout) {
        readout.textContent = `δ = ${delta.toFixed(1)} мм · ΔUн ≈ ${u.toFixed(0)}%`;
      }
      if (dVal) dVal.textContent = `${delta.toFixed(1)} мм`;
      const zoneHint = indCharSlide.querySelector('.ind-char-zone-hint');
      if (zoneHint) zoneHint.textContent = inLinear ? 'линейный участок' : 'нелинейный участок';
    }

    drawIndCharAxes();
    const curvePath = indCharSlide.querySelector('.ind-char-curve');
    if (curvePath) {
      let d = '';
      for (let i = 0; i <= 80; i += 1) {
        const delta = (i / 80) * CHAR_D_MAX;
        const x = deltaToX(delta);
        const y = uToY(calcUn(delta));
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      curvePath.setAttribute('d', d.trim());
    }

    function setIndCharFromX(clientX, svg) {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = 0;
      const loc = pt.matrixTransform(ctm.inverse());
      const delta = Math.max(0, Math.min(CHAR_D_MAX, (loc.x - CHAR_X0) / (CHAR_X1 - CHAR_X0) * CHAR_D_MAX));
      const range = indCharSlide.querySelector('.ind-char-d-range');
      if (range) range.value = String(Math.round((delta / CHAR_D_MAX) * 100));
      updateIndChar();
    }

    const indCharSvg = indCharSlide.querySelector('.ind-char-svg');
    indCharSvg?.addEventListener('click', (e) => {
      e.stopPropagation();
      setIndCharFromX(e.clientX, indCharSvg);
    });

    indCharSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showIndCharInfo(tab.dataset.info);
      }
    });
    indCharSlide.querySelector('.ind-char-d-range')?.addEventListener('input', updateIndChar);
    showIndCharInfo('intro');
    updateIndChar();
  }

  /* ===== Lecture 2: differential inductive sensor ===== */
  const indDiffSlide = document.querySelector('.slide-ind-diff-interactive');
  if (indDiffSlide) {
    const indDiffPanel = document.getElementById('indDiffPanel');
    const indDiffInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Два одинаковых индуктивных датчика в <strong>мостовой</strong> схеме с общим якорем (2).</p><p>В среднем положении мост сбалансирован, ток через прибор 4 мал. Смещение якоря меняет зазоры δ и δ′ в противофазе → разность <var>L</var> → сигнал.</p>'
      },
      principle: {
        title: 'Принцип',
        html: '<p>Якорь вверх: δ′ уменьшается, δ растёт — <var>L</var>′ и <var>L</var> меняются в противофазе.</p><p>Мост разбалансируется, через прибор 4 идёт ток. Направление — по <strong>фазе</strong> (блок B).</p>'
      },
      parts: {
        title: 'Состав',
        html: '<p><strong>1, 1′</strong> — магнитопроводы. <strong>2</strong> — якорь. <strong>3, 3′</strong> — обмотки.</p><p><strong>4</strong> — прибор в диагонали моста. <strong>5</strong> — источник ~U. <strong>B</strong> — нагрузка и демодулятор.</p>'
      },
      cons: {
        title: 'Зачем дифференциальная схема',
        html: '<p>Снимает недостатки простого датчика:</p><ul><li>чувствительность к <strong>направлению</strong> перемещения (через фазу);</li><li>меньше влияние амплитуды и частоты <var>U</var> (мостовое сравнение);</li><li>в нулевом положении сигнал близок к нулю — удобная точка отсчёта.</li></ul>'
      },
      core1: { title: 'Магнитопровод 1′', html: '<p>Верхний магнитопровод. Вместе с обмоткой 3′ образует первое плечо моста.</p>' },
      core2: { title: 'Магнитопровод 1', html: '<p>Нижний магнитопровод. Вместе с обмоткой 3 образует второе плечо моста.</p>' },
      coil1: { title: 'Обмотка 3′', html: '<p>Катушка на верхнем сердечнике. Одно из плеч индуктивного моста.</p>' },
      coil2: { title: 'Обмотка 3', html: '<p>Катушка на нижнем сердечнике. Второе плечо моста.</p>' },
      armature: { title: 'Якорь 2', html: '<p>Общий подвижный якорь. Смещение вверх/вниз меняет зазоры δ и δ′ в противоположных направлениях.</p>' },
      meter: { title: 'Прибор 4', html: '<p>Измерительный прибор в диагонали моста — регистрирует ток, пропорциональный разности индуктивностей.</p>' },
      source: { title: 'Источник 5', html: '<p>Трансформатор с питанием от сети переменного тока. Средняя точка обмотки — опорная точка моста.</p>' },
      blockB: { title: 'Блок B', html: '<p>Нагрузка и <strong>демодулятор</strong> — преобразует переменный сигнал моста в постоянное напряжение для АСУ.</p>' }
    };
    const indDiffTabKeys = ['intro', 'principle', 'parts', 'cons'];
    const METER = { x: 48, y: 112, r: 14 };
    const ARM_Y = 96;
    const ARM_H = 22;
    const ARM_TRAVEL = 14;
    const POLE_TOP = 76;
    const POLE_BOT = 138;

    function setLine(el, y1, y2) {
      if (!el) return;
      el.setAttribute('y1', y1.toFixed(1));
      el.setAttribute('y2', y2.toFixed(1));
    }

    function showIndDiffInfo(key) {
      const data = indDiffInfo[key] || indDiffInfo.intro;
      if (!indDiffPanel) return;
      indDiffPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      indDiffSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', indDiffTabKeys.includes(key) && btn.dataset.info === key);
      });
      indDiffSlide.querySelectorAll('.ind-diff-block, .ind-diff-arm-g').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
      updateIndDiff();
    }

    function updateIndDiff() {
      const s = Number(indDiffSlide.querySelector('.ind-diff-s-range')?.value) || 0;
      const t = s / 100;
      const dy = -t * ARM_TRAVEL;
      const armG = indDiffSlide.querySelector('.ind-diff-arm-g');
      const needle = indDiffSlide.querySelector('.ind-diff-meter-needle');
      const readout = indDiffSlide.querySelector('.ind-diff-readout');
      const sVal = indDiffSlide.querySelector('.ind-diff-s-val');
      if (armG) armG.setAttribute('transform', `translate(0 ${dy.toFixed(1)})`);

      const armTop = ARM_Y + dy;
      const armBot = ARM_Y + ARM_H + dy;
      const yP = (POLE_TOP + armTop) / 2;
      const yD = (armBot + POLE_BOT) / 2;
      setLine(indDiffSlide.querySelector('.ind-diff-gap-p-line'), POLE_TOP, armTop);
      setLine(indDiffSlide.querySelector('.ind-diff-gap-p-a'), POLE_TOP, POLE_TOP);
      setLine(indDiffSlide.querySelector('.ind-diff-gap-p-b'), armTop, armTop);
      setLine(indDiffSlide.querySelector('.ind-diff-gap-d-line'), armBot, POLE_BOT);
      setLine(indDiffSlide.querySelector('.ind-diff-gap-d-a'), armBot, armBot);
      setLine(indDiffSlide.querySelector('.ind-diff-gap-d-b'), POLE_BOT, POLE_BOT);
      const dPrime = indDiffSlide.querySelector('.ind-diff-dprime');
      const dLabel = indDiffSlide.querySelector('.ind-diff-d');
      if (dPrime) dPrime.setAttribute('y', (yP + 4).toFixed(1));
      if (dLabel) dLabel.setAttribute('y', (yD + 4).toFixed(1));

      const i4 = Math.abs(t) * 100;
      const angle = t * 38;
      if (needle) {
        const rad = (angle - 90) * (Math.PI / 180);
        const nx = METER.x + Math.cos(rad) * METER.r;
        const ny = METER.y + Math.sin(rad) * METER.r;
        needle.setAttribute('d', `M${METER.x} ${METER.y} L${nx.toFixed(1)} ${ny.toFixed(1)}`);
      }
      if (readout) {
        const dir = s > 5 ? 'вверх' : s < -5 ? 'вниз' : 'центр';
        readout.textContent = dir === 'центр'
          ? 'смещение 0% · I₄ ≈ 0 · мост сбалансирован'
          : `смещение ${s > 0 ? '+' : ''}${s}% (${dir}) · I₄ ≈ ${i4.toFixed(0)}% · мост разбалансирован`;
      }
      if (sVal) sVal.textContent = `${s > 0 ? '+' : ''}${s}%`;
    }

    indDiffSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showIndDiffInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.ind-diff-block, .ind-diff-arm-g');
      if (block?.dataset.info) {
        e.stopPropagation();
        showIndDiffInfo(block.dataset.info);
      }
    });
    indDiffSlide.querySelector('.ind-diff-s-range')?.addEventListener('input', updateIndDiff);
    showIndDiffInfo('intro');
    updateIndDiff();
  }

  /* ===== Lecture 2: differential characteristic + errors ===== */
  const indDiffCharSlide = document.querySelector('.slide-ind-diff-char-interactive');
  if (indDiffCharSlide) {
    const panel = document.getElementById('indDiffCharPanel');
    const svgWrap = indDiffCharSlide.querySelector('.asutp-diagram-wrap');
    const errGrid = indDiffCharSlide.querySelector('.ind-diff-err-grid');
    const ctrl = indDiffCharSlide.querySelector('.ind-diff-char-controls');
    const range = indDiffCharSlide.querySelector('.ind-diff-char-range');
    const valEl = indDiffCharSlide.querySelector('.ind-diff-char-val');
    const ptAmp = indDiffCharSlide.querySelector('.ind-diff-char-pt-amp');
    const ptFchv = indDiffCharSlide.querySelector('.ind-diff-char-pt-fchv');
    const readout = indDiffCharSlide.querySelector('.ind-diff-char-readout');
    const tabKeys = ['amp', 'fchv', 'err'];
    const errKeys = ['field', 'nl', 'const', 'temp', 'age'];
    const info = {
      amp: {
        title: 'Статическая',
        html: '<p>В среднем положении якоря (2) зазоры равны, сопротивления обмоток 3 и 3′ равны, ток в диагонали <var>I</var> = 0.</p><p>При отклонении <var>I</var> ≠ 0. По амплитуде видно только <strong>|x|</strong>: влево и вправо ток одного знака (V-кривая).</p>'
      },
      fchv: {
        title: 'ФЧВ — направление',
        html: '<p>Чтобы знать <strong>направление</strong> смещения, ставят демодулятор или <strong>фазочувствительный выпрямитель (ФЧВ)</strong>.</p><p>Характеристика становится реверсивной: знак <var>I</var> совпадает со знаком <var>x</var>.</p>'
      },
      err: {
        title: 'Погрешности',
        html: '<p>Погрешность преобразования измеряемого параметра складывается из пяти составляющих. Нажмите вид — пояснение справа.</p><p><strong>Определяющая</strong> — нелинейность характеристики.</p>'
      },
      field: {
        title: 'Внешние поля',
        html: '<p>Погрешность от влияния <strong>внешних электромагнитных полей</strong>.</p><p>Наводка в обмотках меняет <var>I</var> так, будто изменился зазор. Экран и круговая укладка уменьшают эффект.</p>'
      },
      nl: {
        title: 'Нелинейность',
        html: '<p>Погрешность <strong>от нелинейности характеристик</strong> — определяющая.</p><p>V-кривая и насыщение на краях: одно и то же Δx в центре и у края даёт разный ΔI. Работать на среднем участке.</p>'
      },
      const: {
        title: 'Конструктивная',
        html: '<p><strong>Конструктивная</strong> погрешность — от геометрии магнитопровода, люфта якоря, несимметрии плеч моста.</p><p>В нуле остаётся малый ток, если 1 и 1′ не строго одинаковы.</p>'
      },
      temp: {
        title: 'Технологическая и температурная',
        html: '<p><strong>Технологическая</strong> — разброс при изготовлении обмоток и зазоров.</p><p><strong>Температурная</strong> — меняются ρ провода и зазор из‑за расширения. Дифференциальная схема частично компенсирует общий нагрев.</p>'
      },
      age: {
        title: 'Старение',
        html: '<p>Погрешность <strong>от старения датчика</strong>: усадка изоляции, изменение свойств магнитопровода, ослабление крепления якоря.</p><p>Нулевая точка «плывёт» со временем — нужна периодическая проверка.</p>'
      }
    };

    const AMP = { ox: 116, oy: 168, dx: 72, dy: 116 };
    const FCHV = { ox: 340, oy: 100, dx: 76, dy: 48 };
    const CHAR_K = 1.35;
    const CHAR_K_MAX = Math.tanh(CHAR_K);

    function iChar(t) {
      const tc = Math.max(-1, Math.min(1, t));
      return Math.tanh(tc * CHAR_K) / CHAR_K_MAX;
    }

    function ampXY(t) {
      return { x: AMP.ox + t * AMP.dx, y: AMP.oy - Math.abs(iChar(t)) * AMP.dy };
    }

    function fchvXY(t) {
      return { x: FCHV.ox + t * FCHV.dx, y: FCHV.oy - iChar(t) * FCHV.dy };
    }

    function buildCharPath(xy) {
      let d = '';
      for (let i = 0; i <= 48; i += 1) {
        const t = -1 + (i / 48) * 2;
        const p = xy(t);
        d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
      }
      return d.trim();
    }

    const curveAmp = indDiffCharSlide.querySelector('.ind-diff-char-curve-amp');
    const curveFchv = indDiffCharSlide.querySelector('.ind-diff-char-curve-fchv');
    if (curveAmp) curveAmp.setAttribute('d', buildCharPath(ampXY));
    if (curveFchv) curveFchv.setAttribute('d', buildCharPath(fchvXY));

    function updateIndDiffChar() {
      const s = Number(range?.value) || 0;
      const t = s / 100;
      const i = iChar(t);
      const pct = Math.round(Math.abs(i) * 100);
      const signed = `${i > 0 ? '+' : ''}${Math.round(i * 100)}`;
      if (valEl) valEl.textContent = `${s > 0 ? '+' : ''}${s}`;
      const pAmp = ampXY(t);
      const pFchv = fchvXY(t);
      if (ptAmp) {
        ptAmp.setAttribute('cx', pAmp.x.toFixed(1));
        ptAmp.setAttribute('cy', pAmp.y.toFixed(1));
      }
      if (ptFchv) {
        ptFchv.setAttribute('cx', pFchv.x.toFixed(1));
        ptFchv.setAttribute('cy', pFchv.y.toFixed(1));
      }
      if (readout) {
        readout.textContent = s === 0
          ? 'x = 0,  I = 0,  мост сбалансирован'
          : `x = ${s > 0 ? '+' : ''}${s},  |I| ≈ ${pct}%,  после ФЧВ I ≈ ${signed}%`;
      }
    }

    function showIndDiffChar(key) {
      const errMode = key === 'err' || errKeys.includes(key);
      const data = info[key] || info.amp;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (svgWrap) svgWrap.hidden = errMode;
      if (errGrid) errGrid.hidden = !errMode;
      if (ctrl) ctrl.hidden = errMode;
      indDiffCharSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        const on = btn.dataset.info === key || (errMode && btn.dataset.info === 'err');
        btn.classList.toggle('active', on);
      });
      indDiffCharSlide.querySelectorAll('.ind-diff-char-plot').forEach((g) => {
        g.classList.toggle('is-active', g.dataset.info === key);
      });
      indDiffCharSlide.querySelectorAll('.ind-diff-err-grid .app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      if (!errMode) updateIndDiffChar();
    }

    indDiffCharSlide.addEventListener('click', (e) => {
      const target = e.target.closest('[data-info]');
      if (!target) return;
      e.stopPropagation();
      showIndDiffChar(target.dataset.info);
    });
    range?.addEventListener('input', updateIndDiffChar);
    showIndDiffChar('amp');
    updateIndDiffChar();
  }

  /* ===== Lecture 2: transformer angle sensor ===== */
  const xfmrSlide = document.querySelector('.slide-xfmr-interactive');
  if (xfmrSlide) {
    const xfmrPanel = document.getElementById('xfmrPanel');
    const xfmrInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Трансформаторный датчик — разновидность индуктивного: меняется не <var>L</var> одной катушки, а <strong>взаимная индуктивность</strong> между обмотками.</p><p>По сути это трансформатор, у которого коэффициент трансформации зависит от положения якоря.</p>'
      },
      principle: {
        title: 'Принцип',
        html: '<p>В среднем положении якоря потоки Φ<sub>2a</sub> и Φ<sub>2b</sub> равны, ЭДС вторичных обмоток <var>E</var><sub>2a</sub> = <var>E</var><sub>2b</sub>. Фазы встречные — <var>U</var><sub>вых</sub> = 0.</p><p>Поворот якоря меняет потоки: <var>U</var><sub>вых</sub> = <var>E</var><sub>2a</sub> − <var>E</var><sub>2b</sub>. Знак — направление, модуль — угол.</p>'
      },
      wind: {
        title: 'Обмотки',
        html: '<p><strong>W₁</strong> — первичная, на среднем стержне, питается от ~<var>U</var>.</p><p><strong>W₂</strong> и <strong>W₂′</strong> — вторичные на крайних стержнях, включены <strong>встречно-последовательно</strong>: при α = 0 ЭДС вычитаются, <var>U</var><sub>вых</sub> ≈ 0.</p>'
      },
      vs: {
        title: 'Индуктивные: плюсы и минусы',
        html: '<p><strong>Плюсы:</strong> простая и прочная конструкция, нет скользящих контактов, работа на промышленных частотах, высокая чувствительность и мощность сигнала.</p><p><strong>Минусы:</strong> погрешность от нестабильности частоты питания; магнитная сила тянет якорь и может влиять на измерение.</p>'
      },
      source: { title: 'Питание U', html: '<p>Источник переменного напряжения. Частота обычно промышленная (50 Гц). От стабильности частоты зависит погрешность.</p>' },
      core: { title: 'Магнитопровод', html: '<p>Ш-образный (три стержня). Средний — первичная цепь, крайние — два плеча дифференциальной схемы.</p>' },
      w1: { title: 'Первичная W₁', html: '<p>Создаёт поток Φ₁. Поток делится на два пути через якорь и крайние стержни.</p>' },
      w2: { title: 'Вторичная W₂', html: '<p>ЭДС пропорциональна потоку в левом стержне. При повороте якоря влево зазор слева меньше → ЭДС W₂ растёт.</p>' },
      w2p: { title: 'Вторичная W₂′', html: '<p>Правое плечо. Включена встречно с W₂: на выходе разность ЭДС.</p>' },
      armature: { title: 'Якорь 2', html: '<p>Сектор, вращается вокруг нижней оси на угол α. Меняет воздушные зазоры под крайними стержнями в противофазе.</p>' },
      out: { title: 'Выход Uвых', html: '<p>Встречное включение: <var>U</var><sub>вых</sub> = <var>E</var><sub>2a</sub> − <var>E</var><sub>2b</sub>.</p><p>При симметрии якоря относительно статора ЭДС равны, выход ноль. Поворот, связанный с объектом, даёт напряжение.</p>' }
    };
    const xfmrTabKeys = ['intro', 'principle', 'wind', 'vs'];
    const XFMR_PIVOT = { x: 270, y: 210 };

    function showXfmrInfo(key) {
      const data = xfmrInfo[key] || xfmrInfo.intro;
      if (!xfmrPanel) return;
      xfmrPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      xfmrSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', xfmrTabKeys.includes(key) && btn.dataset.info === key);
      });
      xfmrSlide.querySelectorAll('.xfmr-block, .xfmr-arm-g').forEach((block) => {
        block.classList.toggle('is-active', block.dataset.info === key);
      });
      updateXfmr();
    }

    function updateXfmr() {
      const a = Number(xfmrSlide.querySelector('.xfmr-a-range')?.value) || 0;
      const t = a / 30;
      const armG = xfmrSlide.querySelector('.xfmr-arm-g');
      const readout = xfmrSlide.querySelector('.xfmr-readout');
      const aVal = xfmrSlide.querySelector('.xfmr-a-val');
      const fluxL = xfmrSlide.querySelector('.xfmr-flux-l');
      const fluxR = xfmrSlide.querySelector('.xfmr-flux-r');
      if (armG) armG.setAttribute('transform', `rotate(${a} ${XFMR_PIVOT.x} ${XFMR_PIVOT.y})`);
      const u = Math.round(Math.tanh(t * 1.25) * 100);
      if (fluxL) fluxL.setAttribute('opacity', String(0.28 + 0.55 * Math.max(0, t)));
      if (fluxR) fluxR.setAttribute('opacity', String(0.28 + 0.55 * Math.max(0, -t)));
      if (readout) {
        readout.textContent = a === 0
          ? 'α = 0° · E₂a = E₂b · Uвых = 0'
          : `α = ${a > 0 ? '+' : ''}${a}° · Uвых = E₂a − E₂b ≈ ${u > 0 ? '+' : ''}${u}%`;
      }
      if (aVal) aVal.textContent = `${a > 0 ? '+' : ''}${a}°`;
    }

    xfmrSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showXfmrInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.xfmr-block, .xfmr-arm-g');
      if (block?.dataset.info) {
        e.stopPropagation();
        showXfmrInfo(block.dataset.info);
      }
    });
    xfmrSlide.querySelector('.xfmr-a-range')?.addEventListener('input', updateXfmr);
    showXfmrInfo('intro');
    updateXfmr();
  }

  /* ===== Lecture 2: transformer properties ===== */
  const xfmrPropsSlide = document.querySelector('.slide-xfmr-props-interactive');
  if (xfmrPropsSlide) {
    const xfmrPropsPanel = document.getElementById('xfmrPropsPanel');
    const xfmrPropsInfo = {
      power: {
        title: 'Мощность',
        html: '<p><strong>Достоинство.</strong> Выходная мощность сравнительно высокая — часто можно работать <strong>без дополнительного усилителя</strong>.</p>'
      },
      simple: {
        title: 'Простота',
        html: '<p><strong>Достоинство.</strong> Простая конструкция: магнитопровод, обмотки, якорь. Нет скользящих контактов.</p>'
      },
      rel: {
        title: 'Надёжность',
        html: '<p><strong>Достоинство.</strong> Высокая надёжность: механически мало изнашивающихся узлов, работа на переменном токе сети.</p>'
      },
      cost: {
        title: 'Цена',
        html: '<p><strong>Достоинство.</strong> Относительно невысокая стоимость по сравнению с более сложными преобразователями перемещения.</p>'
      },
      zero: {
        title: 'Начальное Uвых',
        html: '<p><strong>Недостаток.</strong> Трудно подстроить и скомпенсировать <strong>начальное</strong> выходное напряжение: при α = 0 остаётся малый остаток из‑за несимметрии плеч.</p>'
      },
      ac: {
        title: 'Только ~U',
        html: '<p><strong>Недостаток.</strong> Работает только на <strong>переменном</strong> токе. Постоянное напряжение на первичную обмотку подавать нельзя.</p>'
      },
      lin: {
        title: 'Линейность',
        html: '<p><strong>Недостаток.</strong> Ограниченный участок линейности статической характеристики. За рабочим диапазоном угла <var>U</var><sub>вых</sub> уже не пропорционален α.</p>'
      }
    };
    const showXfmrProps = (key) => {
      const data = xfmrPropsInfo[key] || xfmrPropsInfo.power;
      if (xfmrPropsPanel) xfmrPropsPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      xfmrPropsSlide.querySelectorAll('.xfmr-prop-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    xfmrPropsSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.xfmr-prop-item');
      if (card?.dataset.info) {
        e.stopPropagation();
        showXfmrProps(card.dataset.info);
      }
    });
    showXfmrProps('power');
  }

  /* ===== Lecture 2: capacitive sensor ===== */
  const capSlide = document.querySelector('.slide-cap-interactive');
  if (capSlide) {
    const capPanel = document.getElementById('capPanel');
    const capInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Ёмкость зависит от размеров обкладок, их взаимного положения и диэлектрической проницаемости среды между ними.</p><p>Для измерений используют зависимости <var>C</var>(<var>S</var>) и <var>C</var>(<var>l</var>).</p>'
      },
      formula: {
        title: 'Формула',
        html: '<p>Плоский конденсатор из двух пластин:</p><p class="cap-eq" aria-label="C равно L нулевое n S на l"><span class="char-eq"><var>C</var> = <var>L</var><sub>0</sub> <var>n</var></span><span class="char-frac"><span class="char-frac-part"><var>S</var></span><span class="char-frac-bar"></span><span class="char-frac-part"><var>l</var></span></span></p><ul class="cap-eq-legend"><li><var>L</var><sub>0</sub> — диэлектрическая постоянная (<var>L</var><sub>0</sub> = 8,85 · 10<sup>−12</sup> Ф/м)</li><li><var>n</var> — относительная диэлектрическая проницаемость среды между обкладками</li><li><var>S</var> — активная площадь обкладок</li><li><var>l</var> — расстояние между обкладками конденсатора</li></ul>'
      },
      cl: {
        title: 'C(l)',
        html: '<p>Чем больше зазор <var>l</var>, тем меньше ёмкость. Так измеряют <strong>перемещение</strong> и зазор.</p><p>Зависимость гиперболическая: малый зазор даёт высокую чувствительность.</p>'
      },
      cs: {
        title: 'C(S)',
        html: '<p>Ёмкость пропорциональна активной площади перекрытия пластин. Так измеряют <strong>смещение вдоль</strong> обкладок.</p><p>Двигайте S — меняется высота перекрытия на схеме.</p>'
      },
      supply: {
        title: 'Питание',
        html: '<p>Ёмкостные датчики питают <strong>переменным</strong> напряжением, обычно повышенной частоты.</p><p>На постоянном токе конденсатор в установившемся режиме ток не проводит — измерить C так нельзя.</p>'
      },
      plate: {
        title: 'Обкладки',
        html: '<p>Две проводящие пластины. Активная площадь <var>S</var> — та часть, где они стоят друг против друга.</p>'
      },
      gap: {
        title: 'Зазор l',
        html: '<p>Расстояние между пластинами. В воздухе <var>n</var> ≈ 1; если между ними диэлектрик, <var>n</var> > 1 и ёмкость растёт.</p>'
      }
    };
    const capTabKeys = ['intro', 'formula', 'cl', 'cs', 'supply'];
    const showCapInfo = (key) => {
      const data = capInfo[key] || capInfo.intro;
      if (!capPanel) return;
      capPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', capTabKeys.includes(key) && btn.dataset.info === key);
      });
      capSlide.querySelectorAll('.cap-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
      updateCap();
    };
    function updateCap() {
      const rawL = Number(capSlide.querySelector('.cap-l-range')?.value) || 40;
      const rawS = Number(capSlide.querySelector('.cap-s-range')?.value) || 100;
      const lMm = 0.3 + (rawL / 100) * 2.2;
      const sFrac = rawS / 100;
      const cPf = (1.77 * sFrac) / lMm;
      const gapPx = 28 + (rawL / 100) * 72;
      const h = 56 + sFrac * 64;
      const y = 48 + (120 - h) / 2;
      const xL = 150;
      const xR = 166 + gapPx;
      const plateL = capSlide.querySelector('.cap-plate-l');
      const plateR = capSlide.querySelector('.cap-plate-r');
      const diel = capSlide.querySelector('.cap-diel');
      const lLine = capSlide.querySelector('.cap-l-line');
      const lLab = capSlide.querySelector('.cap-l-label');
      const readout = capSlide.querySelector('.cap-readout');
      const lVal = capSlide.querySelector('.cap-l-val');
      const sVal = capSlide.querySelector('.cap-s-val');
      if (plateL) {
        plateL.setAttribute('y', String(y));
        plateL.setAttribute('height', String(h));
      }
      if (plateR) {
        plateR.setAttribute('x', String(xR));
        plateR.setAttribute('y', String(y));
        plateR.setAttribute('height', String(h));
      }
      if (diel) {
        diel.setAttribute('x', '166');
        diel.setAttribute('y', String(y));
        diel.setAttribute('width', String(Math.max(4, xR - 166)));
        diel.setAttribute('height', String(h));
      }
      if (lLine) {
        lLine.setAttribute('x1', '166');
        lLine.setAttribute('x2', String(xR));
        lLine.setAttribute('y1', String(y + h + 16));
        lLine.setAttribute('y2', String(y + h + 16));
      }
      if (lLab) {
        lLab.setAttribute('x', String((166 + xR) / 2));
        lLab.setAttribute('y', String(y + h + 34));
      }
      const sLab = capSlide.querySelector('.cap-s-label');
      if (sLab) sLab.setAttribute('y', String(y + h / 2 + 4));
      if (readout) readout.textContent = `l = ${lMm.toFixed(1)} мм · S = ${rawS}% · C ≈ ${cPf.toFixed(1)} пФ`;
      if (lVal) lVal.textContent = `${lMm.toFixed(1)} мм`;
      if (sVal) sVal.textContent = `${rawS}%`;
    }
    capSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCapInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cap-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCapInfo(block.dataset.info);
      }
    });
    capSlide.querySelector('.cap-l-range')?.addEventListener('input', updateCap);
    capSlide.querySelector('.cap-s-range')?.addEventListener('input', updateCap);
    showCapInfo('intro');
    updateCap();
  }

  /* ===== Lecture 2: capacitive linear displacement ===== */
  const capLinSlide = document.querySelector('.slide-cap-lin-interactive');
  if (capLinSlide) {
    const capLinPanel = document.getElementById('capLinPanel');
    const capLinInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Механическое <strong>линейное перемещение</strong> преобразуется в изменение ёмкости: двигается одна пластина, меняется зазор <var>l</var>.</p><p class="cap-eq" aria-label="C равно L нулевое n S на l"><span class="char-eq"><var>C</var> = <var>L</var><sub>0</sub> <var>n</var></span><span class="char-frac"><span class="char-frac-part"><var>S</var></span><span class="char-frac-bar"></span><span class="char-frac-part"><var>l</var></span></span></p><ul class="cap-eq-legend"><li><var>L</var><sub>0</sub> — диэлектрическая постоянная (<var>L</var><sub>0</sub> = 8,85 · 10<sup>−12</sup> Ф/м)</li><li><var>n</var> — относительная диэлектрическая проницаемость среды между обкладками</li><li><var>S</var> — активная площадь обкладок</li><li><var>l</var> — расстояние между обкладками конденсатора</li></ul><p>Справа — статическая характеристика <var>C</var>(<var>l</var>): гипербола, потому что <var>C</var> ∝ 1/<var>l</var>.</p>'
      },
      cl: {
        title: 'C(l)',
        html: '<p>Чем меньше зазор, тем круче характеристика — чувствительность выше, но легче замкнуть пластины и сильнее нелинейность на широком диапазоне.</p><p>Для измерений обычно берут небольшой участок гиперболы.</p>'
      },
      scheme: {
        title: 'Схема',
        html: '<p>Две параллельные пластины. Нижняя неподвижна, верхняя связана с объектом и смещается по нормали к обкладкам.</p><p>Питание — переменное, как у любого ёмкостного датчика.</p>'
      },
      move: {
        title: 'Подвижная пластина',
        html: '<p>Связана с объектом. Перемещение меняет <var>l</var> и тем самым <var>C</var>.</p>'
      },
      fix: {
        title: 'Неподвижная пластина',
        html: '<p>Закреплена на корпусе. Вместе с подвижной образует измерительный конденсатор.</p>'
      },
      gap: {
        title: 'Зазор l',
        html: '<p>Расстояние между пластинами. В формуле плоского конденсатора стоит в знаменателе: <var>C</var> = <var>L</var><sub>0</sub> <var>n</var> <var>S</var> / <var>l</var>.</p>'
      }
    };
    const capLinTabKeys = ['intro', 'cl', 'scheme'];
    const LIN_L_MIN = 0.5;
    const LIN_L_MAX = 4;
    const LIN_X0 = 268;
    const LIN_X1 = 500;
    const LIN_Y0 = 188;
    const LIN_Y1 = 36;
    const LIN_C_MAX = 10;
    const linFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const linC = (l) => 4.4 / l;
    const linToX = (l) => LIN_X0 + ((l - LIN_L_MIN) / (LIN_L_MAX - LIN_L_MIN)) * (LIN_X1 - LIN_X0);
    const linToY = (c) => LIN_Y0 - (c / LIN_C_MAX) * (LIN_Y0 - LIN_Y1);
    const showCapLinInfo = (key) => {
      const data = capLinInfo[key] || capLinInfo.intro;
      if (!capLinPanel) return;
      capLinPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capLinSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', capLinTabKeys.includes(key) && btn.dataset.info === key);
      });
      capLinSlide.querySelectorAll('.cap-lin-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateCapLin = () => {
      const raw = Number(capLinSlide.querySelector('.cap-lin-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.3;
      const lMm = LIN_L_MIN + t * (LIN_L_MAX - LIN_L_MIN);
      const cPf = linC(lMm);
      const gapPx = 22 + t * 56;
      const topY = 148 - 14 - gapPx;
      const top = capLinSlide.querySelector('.cap-lin-top');
      const gapLine = capLinSlide.querySelector('.cap-lin-gap-line');
      const lLab = capLinSlide.querySelector('.cap-lin-l-lab');
      const arrow = capLinSlide.querySelector('.cap-lin-arrow');
      const point = capLinSlide.querySelector('.cap-lin-point');
      const readout = capLinSlide.querySelector('.cap-lin-readout');
      const lVal = capLinSlide.querySelector('.cap-lin-val');
      const moveLab = capLinSlide.querySelector('.cap-lin-move-lab');
      const gapA = capLinSlide.querySelector('.cap-lin-gap-a');
      if (top) top.setAttribute('y', String(topY));
      if (gapLine) {
        gapLine.setAttribute('y1', String(topY + 14));
        gapLine.setAttribute('y2', '148');
      }
      if (gapA) {
        gapA.setAttribute('y1', String(topY + 14));
        gapA.setAttribute('y2', String(topY + 14));
      }
      if (lLab) lLab.setAttribute('y', String(topY + 14 + gapPx / 2 + 4));
      if (moveLab) moveLab.setAttribute('y', String(topY - 6));
      if (arrow) {
        arrow.setAttribute('d', `M24 ${topY - 4} V${topY + 40}`);
      }
      if (point) {
        point.setAttribute('cx', String(linToX(lMm)));
        point.setAttribute('cy', String(linToY(cPf)));
      }
      if (readout) readout.textContent = `l = ${linFmt(lMm, 1)} мм · C ≈ ${linFmt(cPf, 1)} пФ`;
      if (lVal) lVal.textContent = `${linFmt(lMm, 1)} мм`;
    };
    const curveLin = capLinSlide.querySelector('.cap-lin-curve');
    if (curveLin) {
      let d = '';
      for (let i = 0; i <= 60; i += 1) {
        const l = LIN_L_MIN + (i / 60) * (LIN_L_MAX - LIN_L_MIN);
        d += `${i === 0 ? 'M' : 'L'}${linToX(l).toFixed(1)} ${linToY(linC(l)).toFixed(1)} `;
      }
      curveLin.setAttribute('d', d.trim());
    }
    const setCapLinFromX = (clientX, svg) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = 0;
      const loc = pt.matrixTransform(ctm.inverse());
      if (loc.x < LIN_X0 - 8) return;
      const l = Math.max(LIN_L_MIN, Math.min(LIN_L_MAX, LIN_L_MIN + (loc.x - LIN_X0) / (LIN_X1 - LIN_X0) * (LIN_L_MAX - LIN_L_MIN)));
      const range = capLinSlide.querySelector('.cap-lin-range');
      if (range) range.value = String(Math.round(((l - LIN_L_MIN) / (LIN_L_MAX - LIN_L_MIN)) * 100));
      updateCapLin();
    };
    const capLinSvg = capLinSlide.querySelector('.cap-lin-svg');
    capLinSvg?.addEventListener('click', (e) => {
      if (!e.target.closest('.cap-lin-plot')) return;
      e.stopPropagation();
      setCapLinFromX(e.clientX, capLinSvg);
    });
    capLinSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCapLinInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cap-lin-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCapLinInfo(block.dataset.info);
      }
    });
    capLinSlide.querySelector('.cap-lin-range')?.addEventListener('input', updateCapLin);
    showCapLinInfo('intro');
    updateCapLin();
  }

  /* ===== Lecture 2: capacitive angular displacement ===== */
  const capAngSlide = document.querySelector('.slide-cap-ang-interactive');
  if (capAngSlide) {
    const capAngPanel = document.getElementById('capAngPanel');
    const capAngInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Ёмкость меняется из‑за изменения <strong>площади взаимного перекрытия</strong> пластин.</p><p>Пластина <strong>1</strong> поворачивается на угол α, пластина <strong>2</strong> неподвижна. Штриховка — зона перекрытия. Справа — характеристика <var>C</var>(α).</p>'
      },
      area: {
        title: 'Площадь',
        html: '<p>Активная площадь <var>S</var> — общая зона, где пластины стоят друг против друга (штриховка).</p><p class="cap-eq" aria-label="C равно L нулевое n S на l"><span class="char-eq"><var>C</var> = <var>L</var><sub>0</sub> <var>n</var></span><span class="char-frac"><span class="char-frac-part"><var>S</var></span><span class="char-frac-bar"></span><span class="char-frac-part"><var>l</var></span></span></p><p>Зазор <var>l</var> здесь постоянный — меняется только <var>S</var>.</p>'
      },
      ca: {
        title: 'C(α)',
        html: '<p>Чем больше α, тем меньше перекрытие и меньше <var>C</var>.</p><p>Для полукруглых обкладок с общей осью площадь перекрытия пропорциональна углу, поэтому характеристика близка к прямой.</p>'
      },
      fix: {
        title: 'Пластина 2',
        html: '<p>Неподвижный полудиск, закреплён на корпусе. Задаёт одну из двух обкладок конденсатора.</p>'
      },
      move: {
        title: 'Пластина 1',
        html: '<p>Подвижный полудиск на оси, связан с валом объекта. Поворот меняет перекрытие и ёмкость.</p>'
      }
    };
    const capAngTabKeys = ['intro', 'area', 'ca'];
    const ANG_CX = 128;
    const ANG_CY = 120;
    const ANG_R = 80;
    const ANG_X0 = 286;
    const ANG_X1 = 518;
    const ANG_Y0 = 196;
    const ANG_Y1 = 40;
    const ANG_C_MAX = 10;
    const angFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const angC = (a) => 0.4 + 7.6 * ((180 - a) / 180);
    const angToX = (a) => ANG_X0 + (a / 180) * (ANG_X1 - ANG_X0);
    const angToY = (c) => ANG_Y0 - (c / ANG_C_MAX) * (ANG_Y0 - ANG_Y1);
    const showCapAngInfo = (key) => {
      const data = capAngInfo[key] || capAngInfo.intro;
      if (!capAngPanel) return;
      capAngPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capAngSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', capAngTabKeys.includes(key) && btn.dataset.info === key);
      });
      capAngSlide.querySelectorAll('.cap-ang-block, .cap-ang-rot').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateCapAng = () => {
      const raw = Number(capAngSlide.querySelector('.cap-ang-range')?.value);
      const a = Number.isFinite(raw) ? Math.max(0, Math.min(180, raw)) : 55;
      const sPct = ((180 - a) / 180) * 100;
      const cPf = angC(a);
      const rot = capAngSlide.querySelector('.cap-ang-rot');
      const overlap = capAngSlide.querySelector('.cap-ang-overlap');
      const overlapFill = capAngSlide.querySelector('.cap-ang-overlap-fill');
      const arc = capAngSlide.querySelector('.cap-ang-arc');
      const alphaLab = capAngSlide.querySelector('.cap-ang-alpha');
      const point = capAngSlide.querySelector('.cap-ang-point');
      const readout = capAngSlide.querySelector('.cap-ang-readout');
      const aVal = capAngSlide.querySelector('.cap-ang-val');
      if (rot) rot.setAttribute('transform', `rotate(${a} ${ANG_CX} ${ANG_CY})`);
      const overlapD = (() => {
        if (a >= 179) return '';
        const rad1 = (a * Math.PI) / 180;
        const x1 = ANG_CX + ANG_R * Math.cos(rad1);
        const y1 = ANG_CY + ANG_R * Math.sin(rad1);
        const x2 = ANG_CX - ANG_R;
        const y2 = ANG_CY;
        return `M${ANG_CX} ${ANG_CY} L${x1.toFixed(1)} ${y1.toFixed(1)} A${ANG_R} ${ANG_R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
      })();
      if (overlap) overlap.setAttribute('d', overlapD);
      if (overlapFill) overlapFill.setAttribute('d', overlapD);
      if (arc && alphaLab) {
        const arcR = ANG_R + 18;
        if (a < 10) {
          arc.setAttribute('d', '');
        } else {
          const rad = (a * Math.PI) / 180;
          const x1 = ANG_CX + arcR;
          const y1 = ANG_CY;
          const x2 = ANG_CX + arcR * Math.cos(rad);
          const y2 = ANG_CY + arcR * Math.sin(rad);
          arc.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)} A${arcR} ${arcR} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);
        }
        const mid = (a * Math.PI) / 360;
        const tr = ANG_R + 36;
        alphaLab.setAttribute('x', String(ANG_CX + tr * Math.cos(mid)));
        alphaLab.setAttribute('y', String(ANG_CY + tr * Math.sin(mid) + 6));
      }
      if (point) {
        point.setAttribute('cx', String(angToX(a)));
        point.setAttribute('cy', String(angToY(cPf)));
      }
      if (readout) readout.textContent = `α = ${Math.round(a)}° · S ≈ ${Math.round(sPct)}% · C ≈ ${angFmt(cPf, 1)} пФ`;
      if (aVal) aVal.textContent = `${Math.round(a)}°`;
    };
    const curveAng = capAngSlide.querySelector('.cap-ang-curve');
    if (curveAng) {
      const c0 = angC(0);
      const c1 = angC(180);
      curveAng.setAttribute('d', `M${angToX(0).toFixed(1)} ${angToY(c0).toFixed(1)} L${angToX(180).toFixed(1)} ${angToY(c1).toFixed(1)}`);
    }
    const setCapAngFromX = (clientX, svg) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = 0;
      const loc = pt.matrixTransform(ctm.inverse());
      if (loc.x < ANG_X0 - 8) return;
      const a = Math.max(0, Math.min(180, (loc.x - ANG_X0) / (ANG_X1 - ANG_X0) * 180));
      const range = capAngSlide.querySelector('.cap-ang-range');
      if (range) range.value = String(Math.round(a));
      updateCapAng();
    };
    const capAngSvg = capAngSlide.querySelector('.cap-ang-svg');
    capAngSvg?.addEventListener('click', (e) => {
      if (!e.target.closest('.cap-ang-plot')) return;
      e.stopPropagation();
      setCapAngFromX(e.clientX, capAngSvg);
    });
    capAngSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCapAngInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cap-ang-block, .cap-ang-rot');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCapAngInfo(block.dataset.info);
      }
    });
    capAngSlide.querySelector('.cap-ang-range')?.addEventListener('input', updateCapAng);
    showCapAngInfo('intro');
    updateCapAng();
  }

  /* ===== Lecture 2: differential capacitive bridge ===== */
  const capDiffSlide = document.querySelector('.slide-cap-diff-interactive');
  if (capDiffSlide) {
    const capDiffPanel = document.getElementById('capDiffPanel');
    const capDiffInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>В измерительных схемах чаще ставят <strong>дифференциальный</strong> датчик в мост. Сила <var>F</var> смещает пластину 1: одна ёмкость растёт, другая падает.</p><p>На выходе моста — <var>U</var><sub>вых</sub>. Слева схема датчика, справа мост с ГВЧ.</p>'
      },
      parts: {
        title: 'Состав',
        html: '<p><strong>1</strong> — подвижная металлическая пластина на пружинной подвеске <strong>6</strong>.</p><p><strong>2</strong> и <strong>3</strong> — неподвижные пластины, изолированы от корпуса прокладками <strong>4</strong> и <strong>5</strong>.</p>'
      },
      bridge: {
        title: 'Мост',
        html: '<p>Плечи <var>C</var><sub>12</sub> и <var>C</var><sub>13</sub> — две ёмкости датчика. Справа — два постоянных элемента.</p><p>В одной диагонали — <strong>ГВЧ</strong> (генератор высокой частоты), в другой — <var>U</var><sub>вых</sub>.</p>'
      },
      sym: {
        title: 'Симметрия',
        html: '<p>Без силы <var>F</var> пластина 1 стоит посередине: <var>C</var><sub>12</sub> = <var>C</var><sub>13</sub>, мост сбалансирован, <var>U</var><sub>вых</sub> = 0.</p><p>При <var>F</var> зазоры меняются в противофазе — дифференциальный сигнал.</p>'
      },
      p1: {
        title: 'Пластина 1',
        html: '<p>Подвижная обкладка. Сила <var>F</var> смещает её между пластинами 2 и 3. Общая точка двух конденсаторов.</p>'
      },
      p2: {
        title: 'Пластина 2',
        html: '<p>Верхняя неподвижная обкладка. Вместе с пластиной 1 даёт <var>C</var><sub>12</sub>. При движении 1 вниз зазор растёт, <var>C</var><sub>12</sub> падает.</p>'
      },
      p3: {
        title: 'Пластина 3',
        html: '<p>Нижняя неподвижная обкладка. <var>C</var><sub>13</sub> растёт, когда пластина 1 подходит ближе.</p>'
      },
      spring: {
        title: 'Подвеска 6',
        html: '<p>Пружинная подвеска держит пластину 1. Без <var>F</var> возвращает её в симметричное положение.</p>'
      },
      insul: {
        title: 'Прокладки 4 и 5',
        html: '<p>Изолируют неподвижные пластины 2 и 3 от корпуса прибора.</p>'
      },
      gvh: {
        title: 'ГВЧ',
        html: '<p><strong>Генератор высокой частоты</strong> питает мост. Ёмкостный датчик на постоянном токе не работает — нужен переменный сигнал повышенной частоты.</p>'
      },
      out: {
        title: 'Uвых',
        html: '<p>Напряжение разбаланса моста. Знак — направление смещения, модуль — величина <var>F</var> (или перемещения).</p>'
      }
    };
    const capDiffTabKeys = ['intro', 'parts', 'bridge', 'sym'];
    const DIFF_Y0 = 103;
    const DIFF_DY = 22;
    const DIFF_P1_H = 16;
    const DIFF_P2_BOT = 62;
    const DIFF_P3_TOP = 164;
    const DIFF_FX = 210;
    const DIFF_D0 = 1.2;
    const DIFF_K = 2.2;
    const diffFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showCapDiffInfo = (key) => {
      const data = capDiffInfo[key] || capDiffInfo.intro;
      if (!capDiffPanel) return;
      capDiffPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capDiffSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', capDiffTabKeys.includes(key) && btn.dataset.info === key);
      });
      capDiffSlide.querySelectorAll('.cap-diff-block, .cap-diff-arm, .cap-diff-f').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateCapDiff = () => {
      const raw = Number(capDiffSlide.querySelector('.cap-diff-range')?.value);
      const s = Number.isFinite(raw) ? Math.max(-100, Math.min(100, raw)) : 0;
      const y = DIFF_Y0 + (s / 100) * DIFF_DY;
      const xMm = (s / 100) * 0.8;
      const c12 = DIFF_K / (DIFF_D0 + xMm);
      const c13 = DIFF_K / (DIFF_D0 - xMm);
      const u = ((c13 - c12) / (c13 + c12)) * 100;
      const p1 = capDiffSlide.querySelector('.cap-diff-p1');
      const p1lab = capDiffSlide.querySelector('.cap-diff-p1-lab');
      const spring = capDiffSlide.querySelector('.cap-diff-spring');
      const fLine = capDiffSlide.querySelector('.cap-diff-f-line');
      const fHead = capDiffSlide.querySelector('.cap-diff-f-head');
      const fLab = capDiffSlide.querySelector('.cap-diff-f-lab');
      const c12lab = capDiffSlide.querySelector('.cap-diff-c12-lab');
      const c13lab = capDiffSlide.querySelector('.cap-diff-c13-lab');
      const readout = capDiffSlide.querySelector('.cap-diff-readout');
      const sVal = capDiffSlide.querySelector('.cap-diff-val');
      const s6 = capDiffSlide.querySelector('.cap-diff-s6');
      if (p1) p1.setAttribute('y', String(y));
      if (p1lab) p1lab.setAttribute('y', String(y + 13));
      const mid = y + DIFF_P1_H / 2;
      if (spring) spring.setAttribute('d', `M8 ${mid} L16 ${mid - 10} L24 ${mid + 10} L32 ${mid - 10} L42 ${mid}`);
      if (s6) s6.setAttribute('y', String(mid - 16));
      const yBot = y + DIFF_P1_H;
      if (fLine && fHead && fLab) {
        const down = s >= 0;
        const len = 14;
        fLine.setAttribute('x1', String(DIFF_FX));
        fLine.setAttribute('x2', String(DIFF_FX));
        if (down) {
          fLine.setAttribute('y1', String(mid - 2));
          fLine.setAttribute('y2', String(mid + len));
          const hy = mid + len;
          fHead.setAttribute('points', `${DIFF_FX - 6},${hy} ${DIFF_FX},${hy + 11} ${DIFF_FX + 6},${hy}`);
          fLab.setAttribute('x', String(DIFF_FX));
          fLab.setAttribute('y', String(mid - 14));
        } else {
          fLine.setAttribute('y1', String(mid + 2));
          fLine.setAttribute('y2', String(mid - len));
          const hy = mid - len;
          fHead.setAttribute('points', `${DIFF_FX - 6},${hy} ${DIFF_FX},${hy - 11} ${DIFF_FX + 6},${hy}`);
          fLab.setAttribute('x', String(DIFF_FX));
          fLab.setAttribute('y', String(mid + 18));
        }
      }
      if (c12lab) c12lab.setAttribute('y', String(DIFF_P2_BOT + (y - DIFF_P2_BOT) / 2 + 4));
      if (c13lab) c13lab.setAttribute('y', String(yBot + (DIFF_P3_TOP - yBot) / 2 + 4));
      const sign = s > 0 ? '+' : '';
      if (readout) {
        readout.textContent = s === 0
          ? 'F = 0 · C₁₂ = C₁₃ · Uвых = 0'
          : `x = ${sign}${diffFmt(xMm, 2)} мм · C₁₂ ${diffFmt(c12, 1)} · C₁₃ ${diffFmt(c13, 1)} · Uвых ${sign}${diffFmt(u, 0)}%`;
      }
      if (sVal) sVal.textContent = s === 0 ? '0' : `${sign}${s}%`;
    };
    capDiffSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCapDiffInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cap-diff-block, .cap-diff-arm, .cap-diff-f');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCapDiffInfo(block.dataset.info);
      }
    });
    capDiffSlide.querySelector('.cap-diff-range')?.addEventListener('input', updateCapDiff);
    showCapDiffInfo('intro');
    updateCapDiff();
  }

  /* ===== Lecture 2: capacitive resonance circuit ===== */
  const capResSlide = document.querySelector('.slide-cap-res-interactive');
  if (capResSlide) {
    const capResPanel = document.getElementById('capResPanel');
    const capResInfo = {
      intro: {
        title: 'Обзор',
        html: '<p>Мост ловит изменение ёмкости на 0,1 %. Резонансная схема — до <strong>0,001 %</strong>.</p><p>Генератор <strong>1</strong> на фиксированной <var>f</var><sub>г</sub>. Напряжение <var>U</var><sub>к</sub> с контура усиливает <strong>2</strong>, измеряет прибор <strong>3</strong>.</p>'
      },
      tank: {
        title: 'Контур',
        html: '<p>Колебательный контур: <var>L</var><sub>к</sub>, подстроечный <var>C</var><sub>0</sub> и датчик <var>C</var><sub>д</sub>. Настройка при средней ёмкости <var>C</var><sub>д0</sub> = (<var>C</var><sub>max</sub> + <var>C</var><sub>min</sub>) / 2.</p><p>Резонанс: 2π <var>f</var> <var>L</var><sub>к</sub> = 1 / (2π <var>f</var> <var>C</var>), откуда <var>f</var><sub>р</sub> = 1 / (2π √(<var>L</var><sub>к</sub> · <var>C</var>)), <var>C</var> ≈ <var>C</var><sub>д</sub> + <var>C</var><sub>0</sub>.</p>'
      },
      slope: {
        title: 'Склон',
        html: '<p>Точка <strong>О</strong> — резонанс, напряжение <var>U</var><sub>р</sub>. Точка <strong>Б</strong> — рабочая: <var>U</var><sub>к</sub> примерно вдвое меньше, середина склона.</p><p>На левом склоне уменьшение <var>C</var><sub>д</sub> уменьшает напряжение, увеличение — повышает. На правом — наоборот.</p>'
      },
      r: {
        title: 'R контура',
        html: '<p>Чем меньше активное сопротивление контура, тем круче резонансная кривая и выше <var>U</var><sub>р</sub>.</p><p>Острый пик — выше чувствительность, но уже рабочая полоса.</p>'
      },
      gvh: {
        title: 'ГВЧ · 1',
        html: '<p>Генератор высокой частоты задаёт <var>f</var><sub>г</sub>. Связь с контуром — индуктивная, чтобы не шунтировать резонанс.</p>'
      },
      xfmr: {
        title: 'Связь',
        html: '<p>Индуктивная связь генератора с контуром. Развязка по постоянному току, слабая нагрузка на ГВЧ.</p>'
      },
      lk: {
        title: 'Lк',
        html: '<p>Катушка контура. Вместе с <var>C</var><sub>д</sub> и <var>C</var><sub>0</sub> задаёт <var>f</var><sub>р</sub>.</p>'
      },
      cd: {
        title: 'Cд',
        html: '<p>Ёмкость датчика. Перемещение пластины меняет <var>C</var><sub>д</sub> — сдвигает пик <strong>О</strong>, точка <strong>Б</strong> едет по склону.</p>'
      },
      c0: {
        title: 'C₀',
        html: '<p>Подстроечный конденсатор. Им ставят рабочую точку <strong>Б</strong> на склон при номинальном <var>C</var><sub>д0</sub>.</p>'
      },
      amp: {
        title: 'Усилитель · 2',
        html: '<p>Напряжение <var>U</var><sub>к</sub> с контура мало. Усилитель поднимает его до уровня милливольтметра.</p>'
      },
      meter: {
        title: 'Прибор · 3',
        html: '<p>Шкалу градуируют в единицах измеряемой величины. При точке <strong>Б</strong> на середине склона шкала почти линейна.</p>'
      }
    };
    const capResTabKeys = ['intro', 'tank', 'slope', 'r'];
    const RES_X0 = 328;
    const RES_X1 = 528;
    const RES_Y0 = 188;
    const RES_Y1 = 36;
    const RES_FMIN = 0.72;
    const RES_FMAX = 1.28;
    const RES_FG = 0.915;
    const RES_CD_A = 156;
    const resFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const resFtoX = (f) => RES_X0 + ((f - RES_FMIN) / (RES_FMAX - RES_FMIN)) * (RES_X1 - RES_X0);
    const resUtoY = (u) => RES_Y0 - u * (RES_Y0 - RES_Y1);
    const resUof = (f, fr, q, uPeak) => {
      const x = q * (f / fr - fr / f);
      return uPeak / Math.sqrt(1 + x * x);
    };
    const showCapResInfo = (key) => {
      const data = capResInfo[key] || capResInfo.intro;
      if (!capResPanel) return;
      capResPanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capResSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', capResTabKeys.includes(key) && btn.dataset.info === key);
      });
      capResSlide.querySelectorAll('.cap-res-block, .cap-res-plot').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateCapRes = () => {
      const rawC = Number(capResSlide.querySelector('.cap-res-c-range')?.value);
      const rawR = Number(capResSlide.querySelector('.cap-res-r-range')?.value);
      const tC = Number.isFinite(rawC) ? rawC / 100 : 0.5;
      const tR = Number.isFinite(rawR) ? rawR / 100 : 0.25;
      const cRel = 0.74 + tC * 0.52;
      const fr = 1 / Math.sqrt(cRel);
      const q = 12 - 9 * tR;
      const uPeak = 0.38 + 0.62 * (1 - tR);
      const uNow = resUof(RES_FG, fr, q, uPeak);
      const curve = capResSlide.querySelector('.cap-res-curve');
      if (curve) {
        let d = '';
        for (let i = 0; i <= 64; i += 1) {
          const f = RES_FMIN + (i / 64) * (RES_FMAX - RES_FMIN);
          const x = resFtoX(f);
          const y = resUtoY(resUof(f, fr, q, uPeak));
          d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
        }
        curve.setAttribute('d', d.trim());
      }
      const fgX = resFtoX(RES_FG);
      const frX = Math.max(RES_X0 + 16, Math.min(RES_X1 - 16, resFtoX(fr)));
      const peakY = resUtoY(uPeak);
      const bY = resUtoY(uNow);
      const fgLine = capResSlide.querySelector('.cap-res-fg');
      const fgLab = capResSlide.querySelector('.cap-res-fg-lab');
      if (fgLine) {
        fgLine.setAttribute('x1', String(fgX));
        fgLine.setAttribute('x2', String(fgX));
      }
      if (fgLab) fgLab.setAttribute('x', String(fgX));
      const point = capResSlide.querySelector('.cap-res-point');
      if (point) {
        point.setAttribute('cx', String(fgX));
        point.setAttribute('cy', String(bY));
      }
      const peak = capResSlide.querySelector('.cap-res-peak');
      if (peak) {
        peak.setAttribute('cx', String(frX));
        peak.setAttribute('cy', String(peakY));
      }
      const oLab = capResSlide.querySelector('.cap-res-o-lab');
      if (oLab) {
        oLab.setAttribute('x', String(Math.min(RES_X1 - 8, frX + 12)));
        oLab.setAttribute('y', String(peakY + 4));
      }
      const upLab = capResSlide.querySelector('.cap-res-up-lab');
      if (upLab) {
        upLab.setAttribute('x', String(Math.max(RES_X0 + 28, frX - 14)));
        upLab.setAttribute('y', String(peakY - 8));
      }
      const bLab = capResSlide.querySelector('.cap-res-b-lab');
      if (bLab) {
        bLab.setAttribute('x', String(fgX - 12));
        bLab.setAttribute('y', String(bY + 5));
      }
      const frLab = capResSlide.querySelector('.cap-res-fr-lab');
      if (frLab) {
        let ax = frX;
        if (Math.abs(ax - fgX) < 28) ax = fgX + 28;
        ax = Math.max(RES_X0 + 16, Math.min(RES_X1 - 10, ax));
        frLab.setAttribute('x', String(ax));
      }
      const cdA = capResSlide.querySelector('.cap-res-cd-a');
      const cdB = capResSlide.querySelector('.cap-res-cd-b');
      const cdRight = capResSlide.querySelector('.cap-res-cd-right');
      const gap = 4 + (1 - tC) * 8;
      const bx = RES_CD_A + gap;
      if (cdA) {
        cdA.setAttribute('x1', String(RES_CD_A));
        cdA.setAttribute('x2', String(RES_CD_A));
      }
      if (cdB) {
        cdB.setAttribute('x1', String(bx));
        cdB.setAttribute('x2', String(bx));
      }
      if (cdRight) {
        cdRight.setAttribute('x1', String(bx));
      }
      const needle = capResSlide.querySelector('.cap-res-needle');
      if (needle) {
        const ang = -70 + uNow * 100;
        const rad = (ang * Math.PI) / 180;
        const nx = 290 + 12 * Math.sin(rad);
        const ny = 106 - 12 * Math.cos(rad);
        needle.setAttribute('d', `M290 106 L${nx.toFixed(1)} ${ny.toFixed(1)}`);
      }
      const ratio = uPeak > 0.02 ? uNow / uPeak : 0;
      const readout = capResSlide.querySelector('.cap-res-readout');
      const cVal = capResSlide.querySelector('.cap-res-c-val');
      const rVal = capResSlide.querySelector('.cap-res-r-val');
      if (readout) {
        readout.textContent = `Uк ≈ ${resFmt(ratio, 2)} Uр · точка Б`;
      }
      if (cVal) cVal.textContent = `${Math.round(70 + tC * 60)}%`;
      if (rVal) rVal.textContent = tR < 0.33 ? 'низкое' : (tR < 0.66 ? 'среднее' : 'высокое');
    };
    capResSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCapResInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cap-res-block, .cap-res-plot');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCapResInfo(block.dataset.info);
      }
    });
    capResSlide.querySelector('.cap-res-c-range')?.addEventListener('input', updateCapRes);
    capResSlide.querySelector('.cap-res-r-range')?.addEventListener('input', updateCapRes);
    showCapResInfo('intro');
    updateCapRes();
  }

  /* ===== Lecture 2: capacitive applications ===== */
  const capUseSlide = document.querySelector('.slide-cap-use-interactive');
  if (capUseSlide) {
    const capUsePanel = document.getElementById('capUsePanel');
    const capUseInfo = {
      asu: {
        title: 'АСУ и уровень',
        html: '<p>В системах автоматического управления технологическими процессами — в том числе <strong>контроль уровня</strong> материалов.</p>'
      },
      limit: {
        title: 'Концевики',
        html: '<p>Концевые выключатели роботов и автоматических линий: срабатывание по <strong>приближению</strong>, без удара о рычаг.</p>'
      },
      home: {
        title: 'Умный дом',
        html: '<p>Датчики приближения и присутствия: касание панели, открытие створки, наличие человека у зоны.</p>'
      },
      disp: {
        title: 'Перемещения',
        html: '<p>Линейные и угловые перемещения в машиностроении и строительстве — зазор, ход, поворот.</p>'
      },
      incl: {
        title: 'Инклинометры',
        html: '<p>Ёмкостный инклинометр измеряет <strong>зенитный угол</strong> θ. По серии точек вдоль ствола восстанавливают пространственную кривую: север, восток, глубина <var>H</var>.</p><p>Оранжевый участок — набор кривизны (build). Выход современных приборов линеен по углу наклона.</p>'
      },
      scale: {
        title: 'Шкала прибора',
        html: '<p>Милливольтметр после усилителя градуируют в единицах измеряемой величины: миллиметры, градусы, уровень.</p>'
      }
    };
    const WELL_N = 64;
    const wellFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const wellBuildPts = (curv) => {
      const maxInc = (14 + curv * 56) * Math.PI / 180;
      const turn = (25 + curv * 95) * Math.PI / 180;
      const pts = [];
      let n = 0;
      let e = 0;
      let v = 0;
      const dmd = 1 / WELL_N;
      let prevInc = 0;
      let prevAzi = 18 * Math.PI / 180;
      for (let i = 0; i <= WELL_N; i += 1) {
        const t = i / WELL_N;
        let inc = 0;
        if (t > 0.14 && t < 0.42) inc = maxInc * (t - 0.14) / 0.28;
        else if (t >= 0.42) inc = maxInc;
        let azi = 18 * Math.PI / 180;
        if (t > 0.45) azi = 18 * Math.PI / 180 + turn * (t - 0.45) / 0.55;
        if (i > 0) {
          n += Math.sin(inc) * Math.cos(azi) * dmd;
          e += Math.sin(inc) * Math.sin(azi) * dmd;
          v += Math.cos(inc) * dmd;
        }
        const dInc = inc - prevInc;
        const dAzi = azi - prevAzi;
        const dog = Math.sqrt(dInc * dInc + Math.sin(inc) * Math.sin(inc) * dAzi * dAzi);
        pts.push({ n, e, v, inc, azi, dog });
        prevInc = inc;
        prevAzi = azi;
      }
      return pts;
    };
    const wellProject = (n, e, v, yaw, ox, oy, sc) => {
      const c = Math.cos(yaw);
      const s = Math.sin(yaw);
      const nr = n * c - e * s;
      const er = n * s + e * c;
      return {
        x: ox + (er - nr) * 0.86 * sc,
        y: oy + (er + nr) * 0.36 * sc + v * 1.05 * sc
      };
    };
    const updateCapUseWell = () => {
      const rawY = Number(capUseSlide.querySelector('.well-yaw-range')?.value);
      const rawC = Number(capUseSlide.querySelector('.well-curv-range')?.value);
      const tY = Number.isFinite(rawY) ? rawY / 100 : 0.28;
      const tC = Number.isFinite(rawC) ? rawC / 100 : 0.62;
      const yaw = tY * Math.PI * 2;
      const pts = wellBuildPts(tC);
      const raw = pts.map((p) => wellProject(p.n, p.e, p.v, yaw, 0, 0, 1));
      const extras = [
        wellProject(0, 0, 0, yaw, 0, 0, 1),
        wellProject(0.42, 0, 0, yaw, 0, 0, 1),
        wellProject(0, 0.42, 0, yaw, 0, 0, 1),
        wellProject(0, 0, 0.95, yaw, 0, 0, 1),
        wellProject(0.35, 0.35, 0, yaw, 0, 0, 1),
        wellProject(-0.08, -0.08, 0, yaw, 0, 0, 1)
      ];
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      raw.concat(extras).forEach((q) => {
        if (q.x < minX) minX = q.x;
        if (q.x > maxX) maxX = q.x;
        if (q.y < minY) minY = q.y;
        if (q.y > maxY) maxY = q.y;
      });
      const sc = 0.86 * Math.min(470 / Math.max(0.2, maxX - minX), 168 / Math.max(0.2, maxY - minY));
      const ox = 260 - sc * (minX + maxX) / 2;
      const oy = 108 - sc * (minY + maxY) / 2;
      const P = (n, e, v) => wellProject(n, e, v, yaw, ox, oy, sc);
      const Q = (p) => P(p.n, p.e, p.v);
      let dMain = '';
      let dHot = '';
      let dPn = '';
      let dPe = '';
      for (let i = 0; i < pts.length; i += 1) {
        const a = Q(pts[i]);
        dMain += `${i === 0 ? 'M' : 'L'}${a.x.toFixed(1)} ${a.y.toFixed(1)} `;
        const pn = P(pts[i].n, 0, pts[i].v);
        const pe = P(0, pts[i].e, pts[i].v);
        dPn += `${i === 0 ? 'M' : 'L'}${pn.x.toFixed(1)} ${pn.y.toFixed(1)} `;
        dPe += `${i === 0 ? 'M' : 'L'}${pe.x.toFixed(1)} ${pe.y.toFixed(1)} `;
        if (i > 0 && pts[i].dog > 0.018) {
          const b = Q(pts[i - 1]);
          dHot += `M${b.x.toFixed(1)} ${b.y.toFixed(1)}L${a.x.toFixed(1)} ${a.y.toFixed(1)} `;
        }
      }
      const setD = (sel, d) => {
        const el = capUseSlide.querySelector(sel);
        if (el) el.setAttribute('d', d.trim());
      };
      setD('.well-3d-path', dMain);
      setD('.well-3d-hot', dHot);
      setD('.well-3d-proj-n', dPn);
      setD('.well-3d-proj-e', dPe);
      const o = P(0, 0, 0);
      const nT = P(0.42, 0, 0);
      const eT = P(0, 0.42, 0);
      const hT = P(0, 0, 0.95);
      const g0 = P(-0.06, -0.06, 0);
      const g1 = P(0.38, -0.06, 0);
      const g2 = P(0.38, 0.38, 0);
      const g3 = P(-0.06, 0.38, 0);
      const ground = capUseSlide.querySelector('.well-3d-ground');
      if (ground) {
        ground.setAttribute('points', `${g0.x.toFixed(1)},${g0.y.toFixed(1)} ${g1.x.toFixed(1)},${g1.y.toFixed(1)} ${g2.x.toFixed(1)},${g2.y.toFixed(1)} ${g3.x.toFixed(1)},${g3.y.toFixed(1)}`);
      }
      const setLine = (sel, a, b) => {
        const el = capUseSlide.querySelector(sel);
        if (!el) return;
        el.setAttribute('x1', a.x.toFixed(1));
        el.setAttribute('y1', a.y.toFixed(1));
        el.setAttribute('x2', b.x.toFixed(1));
        el.setAttribute('y2', b.y.toFixed(1));
      };
      setLine('.well-3d-axis-n', o, nT);
      setLine('.well-3d-axis-e', o, eT);
      setLine('.well-3d-axis-h', o, hT);
      const setXY = (sel, p, dy) => {
        const el = capUseSlide.querySelector(sel);
        if (!el) return;
        el.setAttribute('x', p.x.toFixed(1));
        el.setAttribute('y', (p.y + (dy || 0)).toFixed(1));
      };
      setXY('.well-3d-lab-n', nT, -8);
      setXY('.well-3d-lab-e', eT, -8);
      setXY('.well-3d-lab-h', hT, 16);
      const head = Q(pts[0]);
      const toe = Q(pts[pts.length - 1]);
      const toolI = Math.round(0.38 * WELL_N);
      const tool = Q(pts[toolI]);
      const setCirc = (sel, p) => {
        const el = capUseSlide.querySelector(sel);
        if (!el) return;
        el.setAttribute('cx', p.x.toFixed(1));
        el.setAttribute('cy', p.y.toFixed(1));
      };
      setCirc('.well-3d-head', head);
      setCirc('.well-3d-toe', toe);
      setCirc('.well-3d-tool', tool);
      setXY('.well-3d-lab-head', head, -14);
      setXY('.well-3d-lab-toe', toe, 18);
      setXY('.well-3d-lab-tool', { x: tool.x + 10, y: tool.y }, 4);
      const theta = pts[toolI].inc * 180 / Math.PI;
      const azi = ((pts[toolI].azi * 180 / Math.PI) % 360 + 360) % 360;
      const readout = capUseSlide.querySelector('.well-3d-readout');
      if (readout) readout.textContent = `θ ≈ ${wellFmt(theta, 0)}° · азимут ${wellFmt(azi, 0)}°`;
      const cVal = capUseSlide.querySelector('.well-curv-val');
      if (cVal) cVal.textContent = tC < 0.33 ? 'малая' : (tC < 0.66 ? 'средняя' : 'большая');
    };
    const showCapUseInfo = (key) => {
      const data = capUseInfo[key] || capUseInfo.asu;
      if (!capUsePanel) return;
      capUsePanel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capUseSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    capUseSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCapUseInfo(card.dataset.info);
    });
    capUseSlide.querySelector('.well-yaw-range')?.addEventListener('input', updateCapUseWell);
    capUseSlide.querySelector('.well-curv-range')?.addEventListener('input', updateCapUseWell);
    showCapUseInfo('incl');
    updateCapUseWell();
  }

  /* ===== Lecture 3: why quench ===== */
  const arcWhySlide = document.querySelector('.slide-arc-why-interactive');
  if (arcWhySlide) {
    const panel = document.getElementById('arcWhyPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Пока дуга горит, цепь <strong>ещё замкнута</strong>: нагрузка получает ток через плазму.</p><p>У концевика на вход ПЛК тока мало — дуги нет. У контактора дугу надо <strong>погасить</strong>, иначе контакты выгорят, а двигатель не отключится.</p>'
      },
      sensor: {
        title: 'Датчик · вход ПЛК',
        html: '<p>Миллиамперы. Размыкание сухое: важны плёнка и <var>R</var><sub>k</sub> (лекция 2), а не камера.</p><p>Гашение дуги этому аппарату не проектируют.</p>'
      },
      power: {
        title: 'Силовой контакт',
        html: '<p>Амперы и килоамперы. При размыкании вспыхивает дуга: эрозия, сваривание, нагрузка ещё включена.</p><p>Нужны камера, дутьё, решётка или полупроводник.</p>'
      }
    };
    const tabs = ['intro', 'sensor', 'power'];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcWhySlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
      arcWhySlide.querySelectorAll('.arc-why-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    }
    arcWhySlide.addEventListener('click', (e) => {
      const t = e.target.closest('[data-info]');
      if (!t) return;
      e.stopPropagation();
      showPanel(t.dataset.info);
    });
    showPanel('intro');
  }

  /* ===== Lecture 3: gap / arc birth ===== */
  const arcGapSlide = document.querySelector('.slide-arc-gap-interactive');
  if (arcGapSlide) {
    const panel = document.getElementById('arcGapPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Контакты расходятся — между ними остаётся <strong>канал плазмы</strong>. Это и есть электрическая дуга.</p><p>Металл испаряется, температура тысячи градусов: эрозия, рост <var>R</var><sub>k</sub>, риск сваривания.</p>'
      },
      plasma: {
        title: 'Плазма',
        html: '<p>Столб — смесь электронов и ионов. Проводит ток почти как металл, пока горячий и короткий.</p><p>Охладить, растянуть или разрезать — проводимость падает, дуга гаснет.</p>'
      },
      load: {
        title: 'Нагрузка',
        html: '<p>Жёлтый кружок справа горит, пока есть ток: либо через замкнутые контакты, либо через дугу.</p><p>Отключить двигатель = не только развести контакты, но и <strong>погасить</strong> дугу.</p>'
      }
    };
    const tabs = ['intro', 'plasma', 'load'];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcGapSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    }
    const updatePanel = () => {
      const raw = Number(arcGapSlide.querySelector('.arc-gap-range')?.value) || 0;
      const t = raw / 100;
      const xR = 158 + t * 92;
      const right = arcGapSlide.querySelector('.arc-gap-right');
      const bolt = arcGapSlide.querySelector('.arc-gap-bolt');
      const lamp = arcGapSlide.querySelector('.arc-gap-lamp');
      const readout = arcGapSlide.querySelector('.arc-gap-readout');
      const val = arcGapSlide.querySelector('.arc-gap-val');
      if (right) right.setAttribute('x', String(xR));
      const burning = t > 0.04 && t < 0.82;
      const off = t >= 0.82;
      if (bolt) {
        if (burning) {
          const mid = (158 + xR) / 2;
          const lift = 28 + t * 36;
          bolt.setAttribute('d', `M158 92 Q${mid.toFixed(1)} ${(92 - lift).toFixed(1)} ${xR.toFixed(1)} 92`);
          bolt.setAttribute('opacity', '1');
        } else {
          bolt.setAttribute('d', '');
          bolt.setAttribute('opacity', '0');
        }
      }
      if (lamp) {
        lamp.setAttribute('fill', off ? '#e2e8f0' : '#fde68a');
        lamp.setAttribute('stroke', off ? '#94a3b8' : '#d97706');
      }
      if (readout) {
        readout.textContent = t < 0.04
          ? 'зазор 0 · цепь замкнута · дуги нет'
          : burning
            ? `зазор ${(t * 8).toFixed(1)} мм · дуга горит · нагрузка ещё включена`
            : 'дуга погасла · нагрузка отключена';
      }
      if (val) val.textContent = `${raw}%`;
    }
    arcGapSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    arcGapSlide.querySelector('.arc-gap-range')?.addEventListener('input', updatePanel);
    showPanel('intro');
    updatePanel();
  }

  /* ===== Lecture 3: how to quench ===== */
  const arcHowSlide = document.querySelector('.slide-arc-how-interactive');
  if (arcHowSlide) {
    const panel = document.getElementById('arcHowPanel');
    const info = {
      stretch: {
        title: 'Растянуть',
        html: '<p>Длинная дуга требует большего напряжения. Контакты быстро расходятся, магнитное дутьё выдувает столб в камеру.</p><p>На постоянном токе это основной приём: нуля тока нет, дугу надо <strong>сорвать</strong>.</p>'
      },
      cool: {
        title: 'Охладить',
        html: '<p>Стенки камеры, газ, масло забирают тепло. Сечение столба падает, сопротивление растёт, <var>U</var><sub>д</sub> растёт.</p><p>Щелевая камера работает именно так.</p>'
      },
      cut: {
        title: 'Разрезать',
        html: '<p>Решётка делит одну дугу на n коротких. Каждая даёт катодное падение — сумма может превысить напряжение сети.</p>'
      },
      shunt: {
        title: 'Зашунтировать',
        html: '<p>Полупроводник берёт ток на себя. Контакт расходится в бестоковую паузу — дуги нет.</p><p>Гибридные пускатели и твердотельные реле.</p>'
      }
    };
    const showPanel = (key) => {
      const data = info[key] || info.stretch;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcHowSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }
    arcHowSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (card?.dataset.info) {
        e.stopPropagation();
        showPanel(card.dataset.info);
      }
    });
    showPanel('stretch');
  }

  /* ===== Lecture 3: AC / DC ===== */
  const arcAcdcSlide = document.querySelector('.slide-arc-acdc-interactive');
  if (arcAcdcSlide) {
    const panel = document.getElementById('arcAcdcPanel');
    const info = {
      ac: {
        title: 'Переменный',
        html: '<p>Ток 100 раз в секунду (50 Гц) проходит через <strong>ноль</strong>. В этот момент дуга гаснет, если промежуток уже не пробивается.</p><p>Камера и решётка не дают дуге зажечься снова на следующем полупериоде.</p>'
      },
      dc: {
        title: 'Постоянный',
        html: '<p>Нуля нет. Дуга горит, пока <var>U</var><sub>д</sub> меньше напряжения источника.</p><p>Нужны дутьё, длинный зазор, камера. Постоянный ток гасить труднее — это лекция 2 про эрозию контакта.</p>'
      },
      why: {
        title: 'Почему так',
        html: '<p>Ионизация держится, пока есть ток. В нуле энергия столба падает — если успели охладить и растянуть, повторный пробой не случится.</p><p>На постоянном токе этой паузы нет.</p>'
      }
    };
    const showPanel = (key) => {
      const k = key === 'why' ? 'why' : key === 'dc' ? 'dc' : 'ac';
      const data = info[k] || info.ac;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcAcdcSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === k);
      });
      const isAc = k !== 'dc';
      arcAcdcSlide.classList.toggle('is-ac', isAc && k === 'ac');
      const kind = arcAcdcSlide.querySelector('.arc-acdc-kind');
      const wave = arcAcdcSlide.querySelector('.arc-acdc-wave');
      const zero = arcAcdcSlide.querySelector('.arc-acdc-zero');
      const readout = arcAcdcSlide.querySelector('.arc-acdc-readout');
      const bolt = arcAcdcSlide.querySelector('.arc-acdc-bolt');
      if (kind) kind.textContent = k === 'dc' ? 'постоянный ток' : 'переменный ток';
      if (wave) {
        wave.setAttribute('d', k === 'dc'
          ? 'M300 62 H408'
          : 'M300 70 C318 70 318 50 336 50 C354 50 354 90 372 90 C390 90 390 70 408 70');
        wave.setAttribute('stroke', k === 'dc' ? '#b45309' : '#1e40af');
      }
      if (zero) zero.setAttribute('r', k === 'ac' ? '4' : '0');
      if (bolt) bolt.setAttribute('opacity', k === 'dc' ? '1' : '1');
      if (readout) {
        readout.textContent = k === 'dc'
          ? 'нуля нет · дугу надо растянуть и выдуть'
          : 'нуль тока · дуга может погаснуть сама';
      }
      if (k === 'ac') arcAcdcSlide.classList.add('is-ac');
      else arcAcdcSlide.classList.remove('is-ac');
    }
    arcAcdcSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    showPanel('ac');
  }

  /* ===== Lecture 3: methods map ===== */
  const arcMapSlide = document.querySelector('.slide-arc-map-interactive');
  if (arcMapSlide) {
    const panel = document.getElementById('arcMapPanel');
    const info = {
      chamber: {
        title: 'Камера',
        html: '<p>Дугу загоняют в узкую щель между стенками. Стенки забирают тепло, сечение столба падает, сопротивление растёт.</p><p>Стоит почти на каждом контакторе и автомате до 1 кВ.</p>'
      },
      blow: {
        title: 'Магнитное дутьё',
        html: '<p>Поле катушки или магнита выдувает дугу в камеру (сила Ампера).</p><p>Особенно нужно на <strong>постоянном токе</strong>, где нет нуля.</p>'
      },
      grid: {
        title: 'Решётка',
        html: '<p>Пластины режут дугу на короткие. Сумма катодных падений гасит ток.</p><p>Классика автоматов и контакторов переменного тока.</p>'
      },
      semi: {
        title: 'Полупроводники',
        html: '<p>Тиристор, симистор, IGBT или гибрид «контакт + полупроводник»: размыкание без дуги.</p><p>Твердотельные реле и гибридные пускатели (плк).</p>'
      },
      media: {
        title: 'Другие среды',
        html: '<p>Вакуум, элегаз, масло, сжатый воздух — высоковольтные выключатели.</p><p>В шкафу САУ 0,4 кВ почти не встречаются.</p>'
      }
    };
    const showPanel = (key) => {
      const data = info[key] || info.chamber;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcMapSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }
    arcMapSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (card?.dataset.info) {
        e.stopPropagation();
        showPanel(card.dataset.info);
      }
    });
    showPanel('chamber');
  }

  /* ===== Lecture 3: chamber ===== */
  const arcChSlide = document.querySelector('.slide-arc-chamber-interactive');
  if (arcChSlide) {
    const panel = document.getElementById('arcChPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Камера — кожух из дугостойкой керамики или пластика над контактами.</p><p>Дуга выдувается или сама поднимается в щель: площадь контакта со стенками растёт, плазма <strong>остывает</strong>.</p>'
      },
      slot: {
        title: 'Щелевая',
        html: '<p>Одна или несколько узких щелей. Дуга плющится, тепло уходит в стенки.</p><p>Простая камера контактора 230/400 В.</p>'
      },
      lab: {
        title: 'Лабиринт',
        html: '<p>Извилистый канал удлиняет дугу без большого хода контактов.</p><p>Дуга «петляет» — <var>U</var><sub>д</sub> растёт быстрее.</p>'
      }
    };
    const tabs = ['intro', 'slot', 'lab'];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcChSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    }
    const updatePanel = () => {
      const raw = Number(arcChSlide.querySelector('.arc-ch-range')?.value) || 0;
      const t = raw / 100;
      const bolt = arcChSlide.querySelector('.arc-ch-bolt');
      const readout = arcChSlide.querySelector('.arc-ch-readout');
      const val = arcChSlide.querySelector('.arc-ch-val');
      const y = 150 - t * 118;
      if (bolt) bolt.setAttribute('d', `M222 159 Q240 ${y.toFixed(1)} 258 159`);
      if (readout) {
        readout.textContent = t < 0.25 ? 'дуга у контактов' : t < 0.7 ? 'дуга в щели · стенки охлаждают' : 'дуга растянута · Uд растёт';
      }
      if (val) val.textContent = `${raw}%`;
    }
    arcChSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    arcChSlide.querySelector('.arc-ch-range')?.addEventListener('input', updatePanel);
    showPanel('intro');
    updatePanel();
  }

  /* ===== Lecture 3: magnetic blowout ===== */
  const arcBlowSlide = document.querySelector('.slide-arc-blow-interactive');
  if (arcBlowSlide) {
    const panel = document.getElementById('arcBlowPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Катушка (или магнит) создаёт поле <strong>поперёк</strong> дуги. На столб действует сила Ампера — дугу сносит в камеру.</p><p>Чем больше ток, тем сильнее дутьё: тяжёлые режимы гасятся охотнее.</p>'
      },
      force: {
        title: 'Сила',
        html: '<p><var>F</var> = <var>I</var> × <var>B</var>: направление по правилу левой руки. Дугу всегда гонят <strong>от контактов в камеру</strong>, не на соседние аппараты.</p><p>Катушка часто включена последовательно с контактами — дутьё растёт вместе с током.</p>'
      },
      dc: {
        title: 'Постоянный ток',
        html: '<p>На DC это главный инструмент: нуля нет, дугу надо выдуть и растянуть, пока <var>U</var><sub>д</sub> не станет выше напряжения сети.</p><p>На AC дутьё тоже помогает, но решётка обычно важнее.</p>'
      }
    };
    const tabs = ['intro', 'force', 'dc'];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcBlowSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    }
    const updatePanel = () => {
      const raw = Number(arcBlowSlide.querySelector('.arc-blow-range')?.value) || 0;
      const t = raw / 100;
      const bolt = arcBlowSlide.querySelector('.arc-blow-bolt');
      const readout = arcBlowSlide.querySelector('.arc-blow-readout');
      const val = arcBlowSlide.querySelector('.arc-blow-val');
      const cx = 228 + t * 110;
      const cy = 70 - t * 36;
      if (bolt) bolt.setAttribute('d', `M206 104 Q${cx.toFixed(1)} ${cy.toFixed(1)} 250 104`);
      if (readout) {
        readout.textContent = t < 0.3
          ? 'ток мал · дуга у контактов'
          : t < 0.7
            ? 'дутьё сносит дугу вправо'
            : 'дуга в камере · растянута';
      }
      if (val) val.textContent = `${raw}%`;
    }
    arcBlowSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    arcBlowSlide.querySelector('.arc-blow-range')?.addEventListener('input', updatePanel);
    showPanel('intro');
    updatePanel();
  }

  /* ===== Lecture 3: deion grid ===== */
  const arcGridSlide = document.querySelector('.slide-arc-grid-interactive');
  if (arcGridSlide) {
    const panel = document.getElementById('arcGridPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Пакет стальных пластин (деионная решётка) стоит над контактами. Дуга втягивается и <strong>разрезается</strong> на n коротких дуг.</p><p>У каждой дуги своё катодное падение ~15…25 В. Сумма растёт — ток не может течь.</p>'
      },
      drop: {
        title: 'Катодное падение',
        html: '<p><var>U</var><sub>д</sub> ≈ n · Δ<var>U</var><sub>к</sub>. При Δ<var>U</var><sub>к</sub> ≈ 20 В и n = 10 уже 200 В — для сети 230 В этого достаточно.</p><p>Поэтому решётка так эффективна на переменном токе низкого напряжения.</p>'
      },
      ac: {
        title: 'Переменный ток',
        html: '<p>В нуле дуги между пластинами гаснут. Пластины охлаждают промежуток — повторный пробой на следующем полупериоде не проходит.</p><p>На постоянном токе решётки мало: нет нуля, нужны дутьё и камера.</p>'
      }
    };
    const tabs = ['intro', 'drop', 'ac'];
    const plateX = [172, 196, 220, 244, 268, 292, 316, 340];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcGridSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    }
    const updatePanel = () => {
      const raw = Number(arcGridSlide.querySelector('.arc-grid-range')?.value) || 0;
      const t = raw / 100;
      const n = Math.round(t * 8);
      const bolt = arcGridSlide.querySelector('.arc-grid-bolt');
      const uEl = arcGridSlide.querySelector('.arc-grid-u');
      const readout = arcGridSlide.querySelector('.arc-grid-readout');
      const val = arcGridSlide.querySelector('.arc-grid-val');
      let d = 'M204 151';
      if (n === 0) {
        d = 'M204 151 Q256 100 296 151';
      } else {
        const yTop = 128 - t * 90;
        d = `M204 151 L${plateX[0]} ${yTop.toFixed(1)}`;
        for (let i = 0; i < n; i += 1) {
          const x = plateX[Math.min(i, plateX.length - 1)];
          const y = i % 2 === 0 ? yTop : yTop + 18;
          d += ` L${x} ${y.toFixed(1)}`;
        }
        d += ' L296 151';
      }
      if (bolt) bolt.setAttribute('d', d);
      if (uEl) uEl.textContent = n === 0 ? 'Uд одна дуга' : `Uд ≈ ${n}·20 В = ${n * 20} В`;
      if (readout) {
        readout.textContent = n === 0 ? 'n = 0 · дуга целая' : `n = ${n} · дуга разрезана`;
      }
      if (val) val.textContent = `${raw}%`;
    }
    arcGridSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    arcGridSlide.querySelector('.arc-grid-range')?.addEventListener('input', updatePanel);
    showPanel('intro');
    updatePanel();
  }

  /* ===== Lecture 3: semiconductor ===== */
  const arcSemiSlide = document.querySelector('.slide-arc-semi-interactive');
  if (arcSemiSlide) {
    const panel = document.getElementById('arcSemiPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Полупроводник параллельно контакту: в момент размыкания ток уходит в тиристор (симистор, IGBT), контакт расходится <strong>без дуги</strong>.</p><p>Потом полупроводник запирается в нуле тока. Ресурс контакта почти как у слаботочного.</p>'
      },
      hybrid: {
        title: 'Гибрид',
        html: '<p>Контакт несёт ток в установившемся режиме (малые потери), полупроводник работает только при коммутации.</p><p>Так делают гибридные пускатели: и КПД металлического контакта, и отсутствие дуги.</p>'
      },
      ssr: {
        title: 'Твердотельный',
        html: '<p>Контакта нет совсем: симистор или транзистор. Нет дуги, нет механики, но есть нагрев и ток утечки.</p><p>Выходы ПЛК «SSR», твердотельные реле на нагреватели.</p>'
      }
    };
    const tabs = ['intro', 'hybrid', 'ssr'];
    const showPanel = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcSemiSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    }
    const updatePanel = () => {
      const raw = Number(arcSemiSlide.querySelector('.arc-semi-range')?.value) || 0;
      const t = raw / 100;
      const move = arcSemiSlide.querySelector('.arc-semi-move');
      const thy = arcSemiSlide.querySelector('.arc-semi-thy');
      const lamp = arcSemiSlide.querySelector('.arc-semi-lamp');
      const branch = arcSemiSlide.querySelector('.arc-semi-branch');
      const readout = arcSemiSlide.querySelector('.arc-semi-readout');
      const val = arcSemiSlide.querySelector('.arc-semi-val');
      const open = t > 0.45 ? 52 : 0;
      if (move) move.setAttribute('x', String(200 + open));
      const vsOn = t > 0.2 && t < 0.82;
      const loadOn = t < 0.82;
      if (thy) thy.setAttribute('stroke', vsOn ? '#2563eb' : '#1e293b');
      if (thy) thy.setAttribute('stroke-width', vsOn ? '2.2' : '1.5');
      if (branch) branch.setAttribute('stroke', vsOn ? '#2563eb' : '#94a3b8');
      if (lamp) {
        lamp.setAttribute('fill', loadOn ? '#fde68a' : '#e2e8f0');
        lamp.setAttribute('stroke', loadOn ? '#d97706' : '#94a3b8');
      }
      let label = 'покой';
      let text = 'контакт замкнут · VS выключен';
      if (t > 0.2 && t <= 0.45) {
        label = 'шунт';
        text = 'VS включён · ток уходит с контакта';
      } else if (t > 0.45 && t < 0.82) {
        label = 'разрыв';
        text = 'контакт разомкнут · дуги нет · ток через VS';
      } else if (t >= 0.82) {
        label = 'выкл';
        text = 'VS запирается · нагрузка отключена';
      }
      if (readout) readout.textContent = text;
      if (val) val.textContent = label;
    }
    arcSemiSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPanel(tab.dataset.info);
      }
    });
    arcSemiSlide.querySelector('.arc-semi-range')?.addEventListener('input', updatePanel);
    showPanel('intro');
    updatePanel();
  }

  /* ===== Lecture 3: other media ===== */
  const arcOtherSlide = document.querySelector('.slide-arc-other-interactive');
  if (arcOtherSlide) {
    const panel = document.getElementById('arcOtherPanel');
    const info = {
      vac: {
        title: 'Вакуум',
        html: '<p>В вакуумной камере нечему ионизироваться: дуга из паров металла гаснет в первом нуле тока.</p><p>Компактные вакуумные выключатели 6…35 кВ на подстанциях и в ячейках КРУ.</p>'
      },
      sf6: {
        title: 'Элегаз SF₆',
        html: '<p>Газ с высокой электрической прочностью. Дугу сжимают и охлаждают в сопле.</p><p>Выключатели 35 кВ и выше. В шкафу 0,4 кВ не применяют.</p>'
      },
      oil: {
        title: 'Масло',
        html: '<p>Дуга разлагает масло — газ и давление гасят столб. Старые баковые и маломасляные выключатели.</p><p>Пожароопасно, в новых САУ почти не ставят.</p>'
      },
      air: {
        title: 'Сжатый воздух',
        html: '<p>Струя воздуха срывает и охлаждает дугу (воздушные выключатели).</p><p>Нужен компрессор — на производстве вытеснены вакуумом и элегазом.</p>'
      }
    };
    const showPanel = (key) => {
      const data = info[key] || info.vac;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcOtherSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }
    arcOtherSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (card?.dataset.info) {
        e.stopPropagation();
        showPanel(card.dataset.info);
      }
    });
    showPanel('vac');
  }

  /* ===== Lecture 3: where in SAU ===== */
  const arcWhereSlide = document.querySelector('.slide-arc-where-interactive');
  if (arcWhereSlide) {
    const panel = document.getElementById('arcWherePanel');
    const info = {
      plc: {
        title: 'Концевик (плк)',
        html: '<p>Ток входа ПЛК — миллиамперы. Камеры и дутья нет: важны <var>R</var><sub>k</sub> и плёнка, как в лекции 2.</p><p>Если ПЛК коммутирует нагрузку сам — ставят твердотельный выход или внешний пускатель.</p>'
      },
      relay: {
        title: 'Реле',
        html: '<p>Малая камера или просто быстрый разрыв. Токи единицы ампер: дуга короткая, но на DC уже нужна искрагасительная цепь.</p>'
      },
      cont: {
        title: 'Контактор',
        html: '<p>Камера + решётка, на DC ещё магнитное дутьё. Это рабочий аппарат пуска двигателя в САУ.</p>'
      },
      brk: {
        title: 'Автомат',
        html: '<p>Мощная решётка: должен гасить ток короткого замыкания. Не пускатель — защита.</p>'
      }
    };
    const showPanel = (key) => {
      const data = info[key] || info.plc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      arcWhereSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    }
    arcWhereSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (card?.dataset.info) {
        e.stopPropagation();
        showPanel(card.dataset.info);
      }
    });
    showPanel('plc');
  }

  /* ===== Lecture 4: electromagnet purpose ===== */
  const emPurposeSlide = document.querySelector('.slide-em-purpose-interactive');
  if (emPurposeSlide) {
    const panel = document.getElementById('emPurposePanel');
    const info = {
      relay: {
        title: 'Реле',
        html: '<p>Катушка втягивает якорь — контакты переключают цепи управления. Ток катушки мал, коммутация — сигнальная.</p><p>Выход ПЛК часто именно так управляет силовой частью: DO → реле → пускатель.</p>'
      },
      cont: {
        title: 'Контактор',
        html: '<p>Тот же принцип, но ход и сила больше: якорь замыкает силовые контакты двигателя, нагревателя, линии.</p><p>Катушка 24 В DC или 230 В AC — типичная нагрузка дискретного выхода или промежуточного реле.</p>'
      },
      valve: {
        title: 'Клапан',
        html: '<p>Якорь-плунжер открывает пневмо- или гидроклапан. Ход миллиметры, сила должна преодолеть пружину и давление среды.</p><p>В САУ это исполнительный механизм: ПЛК дал «1» — поток пошёл.</p>'
      },
      brake: {
        title: 'Тормоз и муфта',
        html: '<p>Электромагнит отпускает пружинный тормоз или сжимает диски муфты. На подъёмниках и приводах: нет тока — тормоз <strong>зажат</strong> (безопасный отказ).</p>'
      }
    };
    const showEmPurpose = (key) => {
      const data = info[key] || info.relay;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emPurposeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    emPurposeSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showEmPurpose(card.dataset.info);
    });
    showEmPurpose('relay');
  }

  /* ===== Lecture 4: construction ===== */
  const emCoreSlide = document.querySelector('.slide-em-core-interactive');
  if (emCoreSlide) {
    const panel = document.getElementById('emCorePanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Магнитопровод (ярмо), катушка, подвижный <strong>якорь</strong>, рабочий зазор δ и возвратная пружина.</p><p>Ток в катушке создаёт поток. Якорь тянется к полюсу — это и есть срабатывание.</p>'
      },
      dc: {
        title: 'Постоянный ток',
        html: '<p>Ярмо часто сплошное: вихревые токи в установившемся режиме не текут. Катушка греется от <var>I</var>²<var>R</var>, поток не зависит от частоты.</p>'
      },
      ac: {
        title: 'Переменный ток',
        html: '<p>Магнитопровод <strong>шихтованный</strong> — чтобы вихревые токи не грели железо. На полюсе — короткозамкнутый виток, иначе якорь дребезжит с удвоенной частотой.</p>'
      },
      yoke: {
        title: 'Ярмо',
        html: '<p>Неподвижная часть магнитопровода. Замыкает поток от катушки через зазор и якорь. От сечения и стали зависит <var>R</var><sub>м</sub> железа.</p>'
      },
      coil: {
        title: 'Катушка',
        html: '<p>Обмотка на каркасе. МДС = <var>I</var>·<var>w</var>. Выводы — к выходу ПЛК, реле или сети ~230 В.</p>'
      },
      arm: {
        title: 'Якорь',
        html: '<p>Подвижная часть. Ход — единицы миллиметров. Связан с контактами, плунжером клапана или рычагом тормоза.</p>'
      },
      gap: {
        title: 'Зазор δ',
        html: '<p>Рабочий воздушный зазор. Почти всё магнитное сопротивление цепи — здесь. Чем больше δ, тем слабее сила при том же токе.</p>'
      },
      spring: {
        title: 'Пружина',
        html: '<p>Возвращает якорь, когда ток снят. Задаёт <var>F</var><sub>п</sub> и ток отпускания. Слишком жёсткая — не втянется, слишком мягкая — залипнет.</p>'
      }
    };
    const tabs = ['intro', 'dc', 'ac'];
    const showEmCoreInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emCoreSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
      emCoreSlide.querySelectorAll('.em-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    emCoreSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showEmCoreInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.em-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showEmCoreInfo(block.dataset.info);
      }
    });
    showEmCoreInfo('intro');
  }

  /* ===== Lecture 4: operating principle ===== */
  const emActSlide = document.querySelector('.slide-em-act-interactive');
  if (emActSlide) {
    const panel = document.getElementById('emActPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Ток катушки → МДС <var>I</var>·<var>w</var> → поток Φ через зазор → сила тянет якорь.</p><p>Пока <var>F</var><sub>т</sub> меньше противодействующей <var>F</var><sub>п</sub> (пружина, вес, уплотнение), якорь стоит. При равенстве — срыв и ход.</p>'
      },
      force: {
        title: 'Сила',
        html: '<p><var>F</var><sub>т</sub> ∝ (<var>I</var>·<var>w</var>)<sup>2</sup> / δ<sup>2</sup>. Квадрат тока: чуть не дотянули по напряжению — якорь не срывается.</p><p>Поэтому катушку 24 В нельзя долго кормить 18 В: нагрев меньше, а силы может не хватить.</p>'
      },
      hold: {
        title: 'Удержание',
        html: '<p>После притяжения δ минимален, сила велика. Ток удержания заметно меньше тока срабатывания — отсюда экономический резистор и две обмотки.</p>'
      }
    };
    const tabs = ['intro', 'force', 'hold'];
    const showEmActInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emActSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateEmAct = () => {
      const raw = Number(emActSlide.querySelector('.em-act-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.15;
      const picked = t >= 0.42;
      const close = picked ? Math.min(1, (t - 0.42) / 0.25) : 0;
      const y = 40 + close * 38;
      const arm = emActSlide.querySelector('.em-act-arm');
      const gap = emActSlide.querySelector('.em-act-gap-line');
      const dLab = emActSlide.querySelector('.em-act-d');
      const flux = emActSlide.querySelector('.em-act-flux');
      const readout = emActSlide.querySelector('.em-act-readout');
      const val = emActSlide.querySelector('.em-act-val');
      if (arm) arm.setAttribute('transform', `translate(0 ${y - 40})`);
      if (gap) {
        gap.setAttribute('y1', String(y + 18));
        gap.setAttribute('y2', '96');
      }
      if (dLab) dLab.setAttribute('y', String(y + 18 + (96 - y - 18) / 2 + 4));
      if (flux) flux.setAttribute('opacity', String(0.12 + t * 0.75));
      if (readout) {
        readout.textContent = !picked
          ? `I = ${Math.round(t * 100)}% · Fт < Fп · якорь отпущен`
          : close < 1
            ? `I = ${Math.round(t * 100)}% · ход якоря`
            : `I = ${Math.round(t * 100)}% · Fт > Fп · якорь притянут`;
      }
      if (val) val.textContent = `${Math.round(t * 100)}%`;
    };
    emActSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmActInfo(tab.dataset.info);
    });
    emActSlide.querySelector('.em-act-range')?.addEventListener('input', updateEmAct);
    showEmActInfo('intro');
    updateEmAct();
  }

  /* ===== Lecture 4: math ===== */
  const emMathSlide = document.querySelector('.slide-em-math-interactive');
  if (emMathSlide) {
    const panel = document.getElementById('emMathPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Сила по методу Максвелла: поток в зазоре «стягивает» якорь. Чем меньше δ, тем сильнее тяга — поэтому в конце хода якорь бьёт в ярмо.</p>'
      },
      energy: {
        title: 'Энергия',
        html: '<p>Энергия поля <var>W</var> = <var>L</var><var>I</var>² / 2. Сила — производная по ходу: <var>F</var><sub>т</sub> = ∂<var>W</var>/∂δ при токе (или потоке) в зависимости от схемы питания.</p><p>На DC после установления ток задан сопротивлением, <var>L</var> растёт при сближении — энергия тоже.</p>'
      },
      dcac: {
        title: 'I при DC и AC',
        html: '<p>Постоянный ток: <var>I</var> = <var>U</var>/<var>R</var>, от зазора почти не зависит.</p><p>Переменный: ток ограничивает <var>X</var><sub>L</sub> = ω<var>L</var>. При большом δ индуктивность мала — пусковой ток катушки <strong>выше</strong>, чем в притянутом состоянии.</p>'
      }
    };
    const tabs = ['intro', 'energy', 'dcac'];
    const emFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showEmMathInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emMathSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateEmMath = () => {
      const rawI = Number(emMathSlide.querySelector('.em-math-i')?.value);
      const rawD = Number(emMathSlide.querySelector('.em-math-d')?.value);
      const iAmp = 0.04 + ((Number.isFinite(rawI) ? rawI : 50) / 100) * 0.16;
      const dMm = 0.4 + ((Number.isFinite(rawD) ? rawD : 40) / 100) * 2.4;
      const mu0 = 1.256e-6;
      const s = 2e-4;
      const w = 1000;
      const dM = dMm / 1000;
      const fN = (mu0 * s * (iAmp * w) ** 2) / (2 * dM * dM);
      const bar = emMathSlide.querySelector('.em-math-bar');
      const fVal = emMathSlide.querySelector('.em-math-fval');
      const readout = emMathSlide.querySelector('.em-math-readout');
      const iVal = emMathSlide.querySelector('.em-math-i-val');
      const dVal = emMathSlide.querySelector('.em-math-d-val');
      const wBar = Math.max(8, Math.min(432, (fN / 12) * 432));
      if (bar) bar.setAttribute('width', String(wBar));
      if (fVal) fVal.textContent = `Fт ≈ ${emFmt(fN, 1)} Н`;
      if (readout) readout.textContent = `I = ${emFmt(iAmp, 2)} А · δ = ${emFmt(dMm, 1)} мм · w = 1000`;
      if (iVal) iVal.textContent = `${emFmt(iAmp, 2)} А`;
      if (dVal) dVal.textContent = `${emFmt(dMm, 1)} мм`;
    };
    emMathSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmMathInfo(tab.dataset.info);
    });
    emMathSlide.querySelector('.em-math-i')?.addEventListener('input', updateEmMath);
    emMathSlide.querySelector('.em-math-d')?.addEventListener('input', updateEmMath);
    showEmMathInfo('intro');
    updateEmMath();
  }

  /* ===== Lecture 4: AC vs DC ===== */
  const emAcdcSlide = document.querySelector('.slide-em-acdc-interactive');
  if (emAcdcSlide) {
    const panel = document.getElementById('emAcdcPanel');
    const info = {
      dc: {
        title: 'Постоянный',
        html: '<p>Ток катушки в установившемся режиме <var>I</var> = <var>U</var>/<var>R</var>. Поток и сила почти постоянны. Ярмо можно делать сплошным.</p>'
      },
      ac: {
        title: 'Переменный',
        html: '<p>Поток следует за синусом, сила ∝ Φ² — пульсирует с частотой 100 Гц и дважды за период падает к нулю. Якорь дребезжит, гудит, контакты искрят.</p>'
      },
      shade: {
        title: 'Виток',
        html: '<p>Короткозамкнутый (экранный) виток на части полюса сдвигает фазу потока в «заэкранированной» зоне.</p><p>Суммарная сила не доходит до нуля — якорь прижат постоянно. Без витка катушка ~50 Гц почти неработоспособна.</p>'
      }
    };
    const X0 = 220;
    const X1 = 500;
    const Y0 = 168;
    const Y1 = 40;
    const drawEmAcdc = (mode) => {
      const curve = emAcdcSlide.querySelector('.em-acdc-curve');
      if (!curve) return;
      let d = '';
      for (let i = 0; i <= 80; i += 1) {
        const t = i / 80;
        const x = X0 + t * (X1 - X0);
        let u = 0.72;
        if (mode === 'ac') {
          const s = Math.sin(t * Math.PI * 4);
          u = s * s;
        } else if (mode === 'shade') {
          const s = Math.sin(t * Math.PI * 4);
          u = 0.42 + 0.5 * s * s;
        }
        const y = Y0 - u * (Y0 - Y1);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      curve.setAttribute('d', d.trim());
    };
    const showEmAcdcInfo = (key) => {
      const data = info[key] || info.dc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emAcdcSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      const shade = emAcdcSlide.querySelector('.em-acdc-shade');
      const shadeLab = emAcdcSlide.querySelector('.em-acdc-shade-lab');
      const kind = emAcdcSlide.querySelector('.em-acdc-kind');
      const readout = emAcdcSlide.querySelector('.em-acdc-readout');
      const on = key === 'ac' || key === 'shade';
      if (shade) shade.setAttribute('opacity', on ? '1' : '0');
      if (shadeLab) shadeLab.setAttribute('opacity', key === 'shade' || key === 'ac' ? '1' : '0');
      if (kind) kind.textContent = key === 'dc' ? 'постоянный ток' : 'переменный ток';
      if (readout) {
        readout.textContent = key === 'dc'
          ? 'F почти постоянна'
          : key === 'shade'
            ? 'виток · F не падает до нуля'
            : 'F пульсирует · два нуля за период';
      }
      drawEmAcdc(key === 'dc' ? 'dc' : (key === 'shade' ? 'shade' : 'ac'));
    };
    emAcdcSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmAcdcInfo(tab.dataset.info);
    });
    showEmAcdcInfo('dc');
  }

  /* ===== Lecture 4: traction ===== */
  const emTracSlide = document.querySelector('.slide-em-trac-interactive');
  if (emTracSlide) {
    const panel = document.getElementById('emTracPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Тяговая <var>F</var><sub>т</sub>(δ) — гипербола: у большого зазора сила мала, у нуля — велика.</p><p>Противодействующая <var>F</var><sub>п</sub> — пружина, контакты, уплотнение. Чтобы якорь прошёл весь ход, <var>F</var><sub>т</sub> должна быть выше <var>F</var><sub>п</sub> на всём участке.</p>'
      },
      pick: {
        title: 'Срыв',
        html: '<p>Самое тяжёлое место — <strong>начало хода</strong> (большой δ): <var>F</var><sub>т</sub> ещё мала. Если здесь характеристика тяги ниже пружины, якорь не сдвинется, сколько ни держать катушку под током.</p>'
      },
      match: {
        title: 'Согласование',
        html: '<p>Катушку, сечение полюса и пружину подбирают так, чтобы запас <var>F</var><sub>т</sub> − <var>F</var><sub>п</sub> был на всём ходе, но удар в конце не разрушал ярмо.</p><p>Слишком крутая тяга у δ → 0 даёт удар и дребезг контактов.</p>'
      }
    };
    const tabs = ['intro', 'pick', 'match'];
    const TX0 = 56;
    const TX1 = 444;
    const TY0 = 188;
    const TY1 = 36;
    const DMIN = 0.4;
    const DMAX = 4;
    const emFmtT = (n, d) => n.toFixed(d).replace('.', ',');
    const emFmag = (delta) => Math.min(100, 110 / ((delta + 0.5) ** 2));
    const emFspr = (delta) => 14 - 2.2 * delta;
    const emDx = (delta) => TX0 + ((delta - DMIN) / (DMAX - DMIN)) * (TX1 - TX0);
    const emFy = (f) => TY0 - (f / 100) * (TY0 - TY1);
    const showEmTracInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emTracSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const magPath = emTracSlide.querySelector('.em-trac-mag');
    const sprPath = emTracSlide.querySelector('.em-trac-spr');
    if (magPath && sprPath) {
      let dm = '';
      let ds = '';
      for (let i = 0; i <= 50; i += 1) {
        const delta = DMIN + (i / 50) * (DMAX - DMIN);
        const x = emDx(delta);
        dm += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${emFy(emFmag(delta)).toFixed(1)} `;
        ds += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${emFy(Math.max(0, emFspr(delta))).toFixed(1)} `;
      }
      magPath.setAttribute('d', dm.trim());
      sprPath.setAttribute('d', ds.trim());
    }
    const updateEmTrac = () => {
      const raw = Number(emTracSlide.querySelector('.em-trac-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.55;
      const delta = DMIN + t * (DMAX - DMIN);
      const fm = emFmag(delta);
      const fs = emFspr(delta);
      const pt = emTracSlide.querySelector('.em-trac-point');
      const readout = emTracSlide.querySelector('.em-trac-readout');
      const val = emTracSlide.querySelector('.em-trac-val');
      if (pt) {
        pt.setAttribute('cx', String(emDx(delta)));
        pt.setAttribute('cy', String(emFy(fm)));
      }
      if (readout) {
        readout.textContent = fm > fs
          ? `δ = ${emFmtT(delta, 1)} мм · Fт > Fп · ход возможен`
          : `δ = ${emFmtT(delta, 1)} мм · Fт < Fп · якорь не сдвинется`;
      }
      if (val) val.textContent = `${emFmtT(delta, 1)} мм`;
    };
    const setEmTracFromX = (clientX, svgEl) => {
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return;
      const p = svgEl.createSVGPoint();
      p.x = clientX;
      p.y = 0;
      const loc = p.matrixTransform(ctm.inverse());
      const delta = Math.max(DMIN, Math.min(DMAX, DMIN + (loc.x - TX0) / (TX1 - TX0) * (DMAX - DMIN)));
      const range = emTracSlide.querySelector('.em-trac-range');
      if (range) range.value = String(Math.round(((delta - DMIN) / (DMAX - DMIN)) * 100));
      updateEmTrac();
    };
    const tracSvg = emTracSlide.querySelector('.em-svg');
    tracSvg?.addEventListener('click', (e) => {
      e.stopPropagation();
      setEmTracFromX(e.clientX, tracSvg);
    });
    emTracSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmTracInfo(tab.dataset.info);
    });
    emTracSlide.querySelector('.em-trac-range')?.addEventListener('input', updateEmTrac);
    showEmTracInfo('intro');
    updateEmTrac();
  }

  /* ===== Lecture 4: pickup / dropout ===== */
  const emPickSlide = document.querySelector('.slide-em-pick-interactive');
  if (emPickSlide) {
    const panel = document.getElementById('emPickPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p><strong>I<sub>ср</sub></strong> — ток, при котором якорь срывается с отпущенного положения.</p><p><strong>I<sub>отп</sub></strong> меньше: при малом зазоре сила ещё велика, плюс остаточная намагниченность. Якорь держится, пока ток не упадёт до I<sub>отп</sub>.</p>'
      },
      kv: {
        title: 'Возврат',
        html: '<p>Коэффициент возврата <var>k</var><sub>в</sub> = <var>I</var><sub>отп</sub> / <var>I</var><sub>ср</sub>. У ЭМ постоянного тока обычно 0,4…0,8.</p><p>Малый <var>k</var><sub>в</sub> — якорь «липнет»: напряжение просело, а контакты ещё замкнуты. Для реле управления это риск.</p>'
      },
      resid: {
        title: 'Остаточная',
        html: '<p>После снятия тока в ярме остаётся намагниченность. Если зазор в притянутом положении почти нулевой, остаточный поток может удержать якорь.</p><p>Против этого — немагнитная прокладка или штифт в полюсе: искусственный минимальный зазор.</p>'
      }
    };
    const tabs = ['intro', 'kv', 'resid'];
    let emPicked = false;
    const showEmPickInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emPickSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateEmPick = () => {
      const raw = Number(emPickSlide.querySelector('.em-pick-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.25;
      if (!emPicked && t >= 0.58) emPicked = true;
      if (emPicked && t <= 0.34) emPicked = false;
      const x = 50 + t * 410;
      const y = emPicked ? 70 : 150;
      const pt = emPickSlide.querySelector('.em-pick-pt');
      const readout = emPickSlide.querySelector('.em-pick-readout');
      const val = emPickSlide.querySelector('.em-pick-val');
      if (pt) {
        pt.setAttribute('cx', String(x));
        pt.setAttribute('cy', String(y));
      }
      if (readout) {
        readout.textContent = emPicked
          ? (t > 0.34 ? 'якорь притянут · держится до Iотп' : 'якорь отпущен')
          : (t < 0.58 ? 'I < Iср · якорь отпущен' : 'срабатывание');
      }
      if (val) val.textContent = `${t.toFixed(2).replace('.', ',')} Iн`;
    };
    emPickSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmPickInfo(tab.dataset.info);
    });
    emPickSlide.querySelector('.em-pick-range')?.addEventListener('input', updateEmPick);
    showEmPickInfo('intro');
    updateEmPick();
  }

  /* ===== Lecture 4: turn-on dynamics ===== */
  const emOnSlide = document.querySelector('.slide-em-on-interactive');
  if (emOnSlide) {
    const panel = document.getElementById('emOnPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Катушка — индуктивность. После подачи <var>U</var> ток не скачет: <var>i</var> = <var>I</var>(1 − e<sup>−t/τ</sup>), τ = <var>L</var>/<var>R</var>.</p><p>Когда <var>F</var><sub>т</sub> превысит <var>F</var><sub>п</sub>, якорь идёт. Пока он движется, <var>L</var> растёт — ток <strong>проседает</strong>, затем доходит до <var>U</var>/<var>R</var>.</p>'
      },
      tau: {
        title: 'Постоянная τ',
        html: '<p>τ = <var>L</var>/<var>R</var>. Большой зазор → меньше <var>L</var> → ток нарастает быстрее, но сила ещё мала.</p><p>Форсировка увеличивает эффективное <var>U</var>/<var>R</var> на интервале трогания — I<sub>ср</sub> достигается раньше.</p>'
      },
      dip: {
        title: 'Провал тока',
        html: '<p>При ходе якоря потокосцепление ψ ≈ <var>L</var><var>i</var> не успевает измениться мгновенно. <var>L</var> растёт (δ падает) — <var>i</var> падает.</p><p>По осциллограмме тока как раз видно три участка: трогание, движение, удержание.</p>'
      }
    };
    const tabs = ['intro', 'tau', 'dip'];
    const OX0 = 56;
    const OX1 = 444;
    const OY0 = 188;
    const OY1 = 56;
    const emOnI = (t) => {
      if (t < 0.38) return 0.88 * (1 - Math.exp(-t / 0.14));
      if (t < 0.54) {
        const u = (t - 0.38) / 0.16;
        return 0.72 - 0.28 * Math.sin(u * Math.PI);
      }
      const u = (t - 0.54) / 0.46;
      return 0.55 + 0.45 * (1 - Math.exp(-u * 3.2));
    };
    const onCurve = emOnSlide.querySelector('.em-on-curve');
    if (onCurve) {
      let d = '';
      for (let i = 0; i <= 70; i += 1) {
        const t = i / 70;
        const x = OX0 + t * (OX1 - OX0);
        const y = OY0 - emOnI(t) * (OY0 - OY1);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      onCurve.setAttribute('d', d.trim());
    }
    const showEmOnInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emOnSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateEmOn = () => {
      const raw = Number(emOnSlide.querySelector('.em-on-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.2;
      const i = emOnI(t);
      const pt = emOnSlide.querySelector('.em-on-point');
      const readout = emOnSlide.querySelector('.em-on-readout');
      const val = emOnSlide.querySelector('.em-on-val');
      if (pt) {
        pt.setAttribute('cx', String(OX0 + t * (OX1 - OX0)));
        pt.setAttribute('cy', String(OY0 - i * (OY0 - OY1)));
      }
      let phase = 'якорь стоит · i растёт';
      let label = 'трогание';
      if (t >= 0.38 && t < 0.54) {
        phase = 'ход якоря · ток проседает';
        label = 'ход';
      } else if (t >= 0.54) {
        phase = 'якорь притянут · i → U/R';
        label = 'удержание';
      }
      if (readout) readout.textContent = phase;
      if (val) val.textContent = label;
    };
    emOnSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmOnInfo(tab.dataset.info);
    });
    emOnSlide.querySelector('.em-on-range')?.addEventListener('input', updateEmOn);
    showEmOnInfo('intro');
    updateEmOn();
  }

  /* ===== Lecture 4: turn-off dynamics ===== */
  const emOffSlide = document.querySelector('.slide-em-off-interactive');
  if (emOffSlide) {
    const panel = document.getElementById('emOffPanel');
    const info = {
      diode: {
        title: 'С диодом',
        html: '<p>Обратный диод (часто на выходе ПЛК) даёт контуру путь тока. Энергия <var>L</var><var>I</var>²/2 стекает через <var>R</var> катушки — спад медленный, <strong>отпускание запаздывает</strong>.</p>'
      },
      open: {
        title: 'Разрыв',
        html: '<p>Цепь рвут насухо. Ток падает очень быстро, якорь отпадает сразу. Но на катушке всплеск <var>u</var> = <var>L</var> di/dt — сотни вольт: пробой изоляции или выход ПЛК.</p>'
      },
      spike: {
        title: 'Перенапряжение',
        html: '<p>Компромисс: TVS, варистор, RC-снаббер. Выброс ограничен безопасным уровнем, ток спадает быстрее, чем через диод.</p><p>Для быстрого клапана на выходе ПЛК диода мало — смотрят время отпускания в паспорте.</p>'
      }
    };
    const FX0 = 210;
    const FX1 = 500;
    const FY0 = 168;
    const FY1 = 40;
    let emOffMode = 'diode';
    const emOffI = (t, mode) => {
      if (mode === 'open') return Math.exp(-t / 0.09);
      if (mode === 'spike') return Math.exp(-t / 0.18);
      return Math.exp(-t / 0.42);
    };
    const drawEmOff = () => {
      const curve = emOffSlide.querySelector('.em-off-curve');
      if (!curve) return;
      let d = '';
      for (let i = 0; i <= 60; i += 1) {
        const t = i / 60;
        const x = FX0 + t * (FX1 - FX0);
        const y = FY0 - emOffI(t, emOffMode) * (FY0 - FY1);
        d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      curve.setAttribute('d', d.trim());
    };
    const updateEmOff = () => {
      const raw = Number(emOffSlide.querySelector('.em-off-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.2;
      const i = emOffI(t, emOffMode);
      const pt = emOffSlide.querySelector('.em-off-point');
      const readout = emOffSlide.querySelector('.em-off-readout');
      const val = emOffSlide.querySelector('.em-off-val');
      if (pt) {
        pt.setAttribute('cx', String(FX0 + t * (FX1 - FX0)));
        pt.setAttribute('cy', String(FY0 - i * (FY0 - FY1)));
      }
      if (readout) {
        readout.textContent = emOffMode === 'open'
          ? (i < 0.2 ? 'ток почти 0 · якорь уже отпущен' : 'ток падает резко · всплеск напряжения')
          : emOffMode === 'spike'
            ? (i < 0.22 ? 'ток у Iотп · отпускание быстрее диода' : 'TVS · спад быстрее, выброс ограничен')
            : (i < 0.22 ? 'ток у Iотп · якорь отпадает с задержкой' : 'ток спадает медленно · отпускание задержано');
      }
      if (val) val.textContent = `${Math.round(t * 100)}%`;
    };
    const showEmOffInfo = (key) => {
      const data = info[key] || info.diode;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emOffSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      emOffMode = key === 'open' ? 'open' : (key === 'spike' ? 'spike' : 'diode');
      const diode = emOffSlide.querySelector('.em-off-diode');
      if (diode) diode.setAttribute('opacity', emOffMode === 'diode' ? '1' : '0.22');
      drawEmOff();
      updateEmOff();
    };
    emOffSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showEmOffInfo(tab.dataset.info);
    });
    emOffSlide.querySelector('.em-off-range')?.addEventListener('input', updateEmOff);
    showEmOffInfo('diode');
  }

  /* ===== Lecture 4: accelerate pickup ===== */
  const emFastSlide = document.querySelector('.slide-em-fast-interactive');
  if (emFastSlide) {
    const panel = document.getElementById('emFastPanel');
    const info = {
      force: {
        title: 'Форсировка',
        html: '<p>На время втягивания на катушку дают полное напряжение. После притяжения вводят <strong>экономический резистор</strong>: ток падает до тока удержания.</p><p>τ = L/R: больше R и U — ток I<sub>ср</sub> набирается быстрее, в установившемся режиме катушка не перегревается.</p>'
      },
      two: {
        title: 'Две обмотки',
        html: '<p>Втягивающая — малое сопротивление, большой ток. Удерживающая — после притяжения, ток мал.</p><p>Втягивающую отключают блок-контактом самого аппарата. Классика катушек контакторов.</p>'
      },
      u: {
        title: 'Повысить U',
        html: '<p>Кратковременно завышенное напряжение (форсирующий конденсатор в питании, отдельный источник). Нельзя держать долго: изоляция и нагрев.</p>'
      },
      cap: {
        title: 'Ёмкость',
        html: '<p>Конденсатор, заряженный до повышенного напряжения, разряжается на катушку — импульс тока выше установившегося.</p><p>После импульса катушка остаётся на номинале или на токе удержания.</p>'
      }
    };
    const showEmFastInfo = (key) => {
      const data = info[key] || info.force;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emFastSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    emFastSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showEmFastInfo(card.dataset.info);
    });
    showEmFastInfo('force');
  }

  /* ===== Lecture 4: delay pickup ===== */
  const emSlowSlide = document.querySelector('.slide-em-slow-interactive');
  if (emSlowSlide) {
    const panel = document.getElementById('emSlowPanel');
    const info = {
      sleeve: {
        title: 'Гильза',
        html: '<p>Медная (или алюминиевая) гильза на сердечнике: вихревые токи мешают нарастать потоку. Якорь трогается позже.</p><p>Тот же эффект тормозит и отпускание — гильза замедляет <strong>оба</strong> фронта.</p>'
      },
      short: {
        title: 'Замкнутый виток',
        html: '<p>Массивный короткозамкнутый виток или демпферная обмотка. На постоянном токе это аналог гильзы: задерживает изменение потока.</p><p>Не путать с экранным витком переменного тока: тот борется с пульсацией силы, а не с выдержкой времени.</p>'
      },
      rc: {
        title: 'RC-цепь',
        html: '<p>Конденсатор параллельно катушке или в цепи управления: напряжение на обмотке нарастает с постоянной RC.</p><p>Ставят, когда нужна выдержка единицы–десятки миллисекунд без механического реле времени.</p>'
      },
      r: {
        title: 'Последовательный R',
        html: '<p>Лишний резистор при том же U снижает установившийся ток и увеличивает τ относительно силы: I<sub>ср</sub> набирается дольше или вообще не достигается.</p><p>Грубый способ, катушка может не втянуться — чаще комбинируют с форсировкой, а не наоборот.</p>'
      }
    };
    const showEmSlowInfo = (key) => {
      const data = info[key] || info.sleeve;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emSlowSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    emSlowSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showEmSlowInfo(card.dataset.info);
    });
    showEmSlowInfo('sleeve');
  }

  /* ===== Lecture 4: faster dropout ===== */
  const emDropSlide = document.querySelector('.slide-em-drop-interactive');
  if (emDropSlide) {
    const panel = document.getElementById('emDropPanel');
    const info = {
      tvs: {
        title: 'TVS вместо диода',
        html: '<p>Обычный диод на выходе ПЛК защищает транзистор, но держит ток. Варистор или TVS обрезает выброс и даёт току стечь <strong>быстрее</strong> — отпускание короче.</p>'
      },
      res: {
        title: 'Разрядный R',
        html: '<p>Резистор параллельно катушке или последовательно с диодом. Ток спадает с меньшей постоянной, чем через одну обмотку, выброс напряжения ограничен <var>I</var>·<var>R</var>.</p>'
      },
      pin: {
        title: 'Прокладка',
        html: '<p>Немагнитный штифт или прокладка в полюсе: в «притянутом» положении остаётся зазор десятые доли миллиметра.</p><p>Остаточный поток не удерживает якорь — отпускание чёткое, без залипания.</p>'
      },
      hold: {
        title: 'Ток удержания',
        html: '<p>После втягивания ток снижают (экономический резистор, вторая обмотка). Запас до I<sub>отп</sub> мал — при снятии питания якорь отпадает почти сразу.</p><p>И меньше нагрев катушки в длительном режиме.</p>'
      }
    };
    const showEmDropInfo = (key) => {
      const data = info[key] || info.tvs;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emDropSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    emDropSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showEmDropInfo(card.dataset.info);
    });
    showEmDropInfo('tvs');
  }

  /* ===== Lecture 4: where in SAU ===== */
  const emWhereSlide = document.querySelector('.slide-em-where-interactive');
  if (emWhereSlide) {
    const panel = document.getElementById('emWherePanel');
    const info = {
      plc: {
        title: 'Выход ПЛК',
        html: '<p>Дискретный выход (релейный или транзисторный) питает катушку реле, пускателя, гидро- или пневмоклапана.</p><p>На DC обязательна защита от выброса: диод, TVS или снаббер — иначе выход ПЛК выбьет.</p>'
      },
      start: {
        title: 'Пускатель',
        html: '<p>Катушка контактора — электромагнит переменного или постоянного тока. ПЛК включает её через реле или сразу с силового выхода.</p><p>На ~230 В катушка гудит, если виток повреждён; на 24 В DC важны полярность диода и сечение провода.</p>'
      },
      valve: {
        title: 'Клапан',
        html: '<p>Пневмоостров, отсечной клапан, гидрораспределитель: время срабатывания и отпускания входит в цикл машины.</p><p>Если клапан «отпускает» 50 мс из‑за диода, а такт 80 мс — виновата цепь катушки, не механика.</p>'
      },
      time: {
        title: 'Тайминг',
        html: '<p>В программе ПЛК закладывают не только логику, но и реальное t<sub>ср</sub> и t<sub>отп</sub> аппарата.</p><p>Форсировка и TVS — если цикл быстрый; гильза и диод — если нужна пауза без таймера в коде.</p>'
      }
    };
    const showEmWhereInfo = (key) => {
      const data = info[key] || info.plc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      emWhereSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    emWhereSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showEmWhereInfo(card.dataset.info);
    });
    showEmWhereInfo('plc');
  }

  /* ===== Lecture 5: breaker purpose ===== */
  const cbPurposeSlide = document.querySelector('.slide-cb-purpose-interactive');
  if (cbPurposeSlide) {
    const panel = document.getElementById('cbPurposePanel');
    const info = {
      ovl: {
        title: 'Перегрузка',
        html: '<p>Длительный ток выше допустимого греет кабель. Тепловой (или электронный) расцепитель отключает с выдержкой — даёт двигателю пуститься, но не даёт проводам гореть.</p>'
      },
      sc: {
        title: 'КЗ',
        html: '<p>Ток короткого замыкания — сотни и тысячи ампер. Электромагнитный (или электронный I) расцепитель рвёт цепь за миллисекунды, камера гасит дугу.</p>'
      },
      sw: {
        title: 'Коммутация',
        html: '<p>Рукояткой можно включить и отключить цепь вручную. Это не контактор: ресурс меньше, для частых пусков двигателя ставят пускатель, автомат — на защиту.</p>'
      },
      vs: {
        title: 'Не пускатель',
        html: '<p>Автомат защищает. Пускатель/контактор коммутирует. В САУ обычно: автомат → контактор → двигатель. ПЛК управляет катушкой контактора, не силовой рукояткой автомата.</p>'
      }
    };
    const showCbPurpose = (key) => {
      const data = info[key] || info.ovl;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbPurposeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbPurposeSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbPurpose(card.dataset.info);
    });
    showCbPurpose('ovl');
  }

  /* ===== Lecture 5: construction ===== */
  const cbCoreSlide = document.querySelector('.slide-cb-core-interactive');
  if (cbCoreSlide) {
    const panel = document.getElementById('cbCorePanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>В одном корпусе: силовые контакты, дугогасительная камера, механизм с защёлкой и расцепители.</p><p>Расцепитель не размыкает ток сам — он срывает защёлку, пружина механизма рвёт контакты.</p>'
      },
      free: {
        title: 'Свободное',
        html: '<p>Свободное расцепление: даже если держат рукоятку во «вкл», при аварии контакты всё равно разомкнутся.</p><p>Иначе оператор мог бы удержать цепь в КЗ — недопустимо.</p>'
      },
      arc: {
        title: 'Дуга',
        html: '<p>Камера над контактами — как в лекции 3: щель, решётка, дутьё. Без гашения дуги автомат не имеет коммутационной способности Icu.</p>'
      },
      handle: { title: 'Рукоятка', html: '<p>Взводит механизм и показывает состояние: вверх — включён, вниз — отключён, среднее — сработал расцепитель (нужно сбросить).</p>' },
      latch: { title: 'Механизм', html: '<p>Защёлка держит контакты замкнутыми. Удар расцепителя срывает её — энергия пружины размыкает цепь.</p>' },
      contact: { title: 'Контакты', html: '<p>Силовые контакты проводят ток нагрузки. При размыкании под током между ними дуга — дальше камера.</p>' },
      chamber: { title: 'Камера', html: '<p>Дугогасительная камера. На переменном токе решётка, на постоянном ещё магнитное дутьё.</p>' },
      th: { title: 'Биметалл', html: '<p>Тепловой расцепитель: пластина в цепи полюса, изгибается при перегрузке.</p>' },
      em: { title: 'ЭМ катушка', html: '<p>Электромагнитный расцепитель: катушка последовательно, якорь бьёт по защёлке при КЗ.</p>' }
    };
    const tabs = ['intro', 'free', 'arc'];
    const showCbCoreInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbCoreSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
      cbCoreSlide.querySelectorAll('.cb-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    cbCoreSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCbCoreInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cb-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCbCoreInfo(block.dataset.info);
      }
    });
    showCbCoreInfo('intro');
  }

  /* ===== Lecture 5: operating principle ===== */
  const cbActSlide = document.querySelector('.slide-cb-act-interactive');
  if (cbActSlide) {
    const panel = document.getElementById('cbActPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Ток нагрузки течёт через контакты, биметалл и катушку электромагнита.</p><p>При аварии расцепитель срывает защёлку — контакты рвутся <strong>независимо</strong> от положения рукоятки (свободное расцепление).</p>'
      },
      ovl: {
        title: 'Перегрузка',
        html: '<p>Ток 1,2…3 In. Биметалл медленно гнётся. Двигатель успевает разогнаться, кабель не успевает перегреться до отключения.</p>'
      },
      sc: {
        title: 'КЗ',
        html: '<p>Ток выше отсечки (для C — обычно 5…10 In). Якорь электромагнита срывает защёлку сразу. Биметалл не участвует — не успевает.</p>'
      }
    };
    const tabs = ['intro', 'ovl', 'sc'];
    const cbFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showCbActInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbActSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateCbAct = () => {
      const raw = Number(cbActSlide.querySelector('.cb-act-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.2;
      const iIn = 0.3 + t * 11.5;
      const thermal = iIn >= 1.2 && iIn < 7;
      const sc = iIn >= 7;
      const open = sc || iIn >= 2.4;
      const left = cbActSlide.querySelector('.cb-act-left');
      const right = cbActSlide.querySelector('.cb-act-right');
      const bridge = cbActSlide.querySelector('.cb-act-bridge');
      const arc = cbActSlide.querySelector('.cb-act-arc');
      const bi = cbActSlide.querySelector('.cb-act-bi');
      const arm = cbActSlide.querySelector('.cb-act-arm');
      const lamp = cbActSlide.querySelector('.cb-act-load');
      const readout = cbActSlide.querySelector('.cb-act-readout');
      const val = cbActSlide.querySelector('.cb-act-val');
      if (right) right.setAttribute('x', open ? '244' : '210');
      if (bridge) bridge.setAttribute('opacity', open ? '0' : '1');
      if (arc) {
        arc.setAttribute('d', open && sc ? 'M174 47 Q209 22 244 47' : '');
      }
      const bend = thermal || (iIn >= 1.2) ? Math.min(1, (iIn - 1.2) / 1.4) : 0;
      if (bi) bi.setAttribute('d', `M140 110 Q180 ${110 - bend * 22} 220 110`);
      if (arm) arm.setAttribute('transform', sc ? 'translate(0 -14)' : '');
      if (lamp) lamp.setAttribute('fill', open ? '#fff' : '#fde68a');
      if (readout) {
        readout.textContent = sc
          ? `I = ${cbFmt(iIn, 1)} In · ЭМ сработал · контакты разомкнуты`
          : open
            ? `I = ${cbFmt(iIn, 1)} In · тепловой сработал`
            : `I = ${cbFmt(iIn, 1)} In · контакты замкнуты`;
      }
      if (val) val.textContent = `${cbFmt(iIn, 1)} In`;
    };
    cbActSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbActInfo(tab.dataset.info);
    });
    cbActSlide.querySelector('.cb-act-range')?.addEventListener('input', updateCbAct);
    showCbActInfo('intro');
    updateCbAct();
  }

  /* ===== Lecture 5: electromagnetic trip ===== */
  const cbEmSlide = document.querySelector('.slide-cb-em-interactive');
  if (cbEmSlide) {
    const panel = document.getElementById('cbEmPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Катушка включена <strong>последовательно</strong> в цепь. При токе короткого замыкания якорь мгновенно втягивается и срывает механизм.</p><p>Это защита от КЗ: время — миллисекунды, без тепловой инерции.</p>'
      },
      why: {
        title: 'Зачем',
        html: '<p>Тепловой расцепитель при КЗ не успеет: кабель и контакты сгорят. Нужен быстрый удар по защёлке.</p><p>Это тот же электромагнит, что в лекции 4, только якорь бьёт не клапан, а механизм автомата.</p>'
      },
      set: {
        title: 'Уставка',
        html: '<p>У бытовых (МЭК 60898) уставка жёстко задана кривой B/C/D. У промышленных (60947-2) электромагнитную отсечку часто регулируют.</p>'
      }
    };
    const tabs = ['intro', 'why', 'set'];
    const cbFmtE = (n, d) => n.toFixed(d).replace('.', ',');
    const showCbEmInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbEmSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateCbEm = () => {
      const raw = Number(cbEmSlide.querySelector('.cb-em-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.15;
      const iIn = 1 + t * 14;
      const trip = iIn >= 8;
      const plunger = cbEmSlide.querySelector('.cb-em-plunger');
      const hit = cbEmSlide.querySelector('.cb-em-hit');
      const readout = cbEmSlide.querySelector('.cb-em-readout');
      const val = cbEmSlide.querySelector('.cb-em-val');
      if (plunger) plunger.setAttribute('y', trip ? '78' : '96');
      if (hit) hit.setAttribute('stroke', trip ? '#1e40af' : '#94a3b8');
      if (readout) {
        readout.textContent = trip
          ? `I = ${cbFmtE(iIn, 1)} In · удар по защёлке`
          : `I = ${cbFmtE(iIn, 1)} In · якорь на месте`;
      }
      if (val) val.textContent = `${cbFmtE(iIn, 1)} In`;
    };
    cbEmSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbEmInfo(tab.dataset.info);
    });
    cbEmSlide.querySelector('.cb-em-range')?.addEventListener('input', updateCbEm);
    showCbEmInfo('intro');
    updateCbEm();
  }

  /* ===== Lecture 5: thermal trip ===== */
  const cbThSlide = document.querySelector('.slide-cb-th-interactive');
  if (cbThSlide) {
    const panel = document.getElementById('cbThPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Два металла с разным расширением. Ток греет пластину — она изгибается и нажимает на защёлку.</p><p>Чем больше ток, тем быстрее нагрев: <strong>обратнозависимая</strong> характеристика. Пуск двигателя биметалл «переживает», длительная перегрузка — нет.</p>'
      },
      inv: {
        title: 'Время',
        html: '<p>По МЭК 60898: при 1,13 In не должен отключить за час; при 1,45 In — должен. Чем выше ток, тем короче выдержка.</p>'
      },
      amb: {
        title: 'Окружающая T',
        html: '<p>Биметалл чувствует и воздух в щите. Жаркий шкаф — ложные отключения, холод — запаздывание. Калибровка при 30 °C; в плотном щите ставят поправочный коэффициент или электронный расцепитель.</p>'
      }
    };
    const tabs = ['intro', 'inv', 'amb'];
    const cbFmtTh = (n, d) => n.toFixed(d).replace('.', ',');
    const showCbThInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbThSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateCbTh = () => {
      const rawI = Number(cbThSlide.querySelector('.cb-th-i')?.value);
      const rawT = Number(cbThSlide.querySelector('.cb-th-t-range')?.value);
      const iIn = 0.8 + ((Number.isFinite(rawI) ? rawI : 30) / 100) * 2.2;
      const tau = Number.isFinite(rawT) ? rawT / 100 : 0.2;
      const heat = (iIn * iIn) * tau;
      const trip = heat > 1.15;
      const bend = Math.min(1, heat / 1.15);
      const bi = cbThSlide.querySelector('.cb-th-bi');
      const tLab = cbThSlide.querySelector('.cb-th-t');
      const readout = cbThSlide.querySelector('.cb-th-readout');
      const iVal = cbThSlide.querySelector('.cb-th-i-val');
      const tVal = cbThSlide.querySelector('.cb-th-t-val');
      if (bi) bi.setAttribute('d', `M80 140 Q160 ${140 - bend * 48} 240 140`);
      if (tLab) tLab.setAttribute('opacity', String(0.35 + bend * 0.65));
      if (readout) {
        readout.textContent = trip
          ? `${cbFmtTh(iIn, 1)} In · пластина нажала защёлку`
          : `${cbFmtTh(iIn, 1)} In · пластина ${bend < 0.25 ? 'ещё прямая' : 'гнётся'}`;
      }
      if (iVal) iVal.textContent = `${cbFmtTh(iIn, 1)} In`;
      if (tVal) tVal.textContent = tau < 0.33 ? 'мало' : (tau < 0.66 ? 'средне' : 'долго');
    };
    cbThSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbThInfo(tab.dataset.info);
    });
    cbThSlide.querySelector('.cb-th-i')?.addEventListener('input', updateCbTh);
    cbThSlide.querySelector('.cb-th-t-range')?.addEventListener('input', updateCbTh);
    showCbThInfo('intro');
    updateCbTh();
  }

  /* ===== Lecture 5: combined ===== */
  const cbCombSlide = document.querySelector('.slide-cb-comb-interactive');
  if (cbCombSlide) {
    const panel = document.getElementById('cbCombPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>В бытовом и большинстве промышленных автоматов в каждом полюсе стоят <strong>оба</strong> расцепителя: тепловой от перегрузки, электромагнитный от КЗ.</p><p>Одна защёлка, две причины срыва — это комбинированный расцепитель.</p>'
      },
      th: {
        title: 'Тепловой',
        html: '<p>Левая ветвь характеристики: большое время при токе чуть выше In, секунды и доли секунды при 3…5 In.</p>'
      },
      em: {
        title: 'Электромагнит',
        html: '<p>Вертикаль отсечки: выше уставки ток не «ждёт» нагрева — отключение почти мгновенное.</p>'
      }
    };
    const showCbCombInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbCombSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      cbCombSlide.querySelectorAll('.cb-comb-zone').forEach((z) => {
        z.classList.toggle('is-active', z.dataset.info === key);
      });
      const readout = cbCombSlide.querySelector('.cb-comb-readout');
      if (readout) {
        readout.textContent = key === 'th'
          ? 'тепловая ветвь · перегрузка'
          : key === 'em'
            ? 'отсечка · короткое замыкание'
            : 'два расцепителя · одна защёлка';
      }
    };
    cbCombSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCbCombInfo(tab.dataset.info);
        return;
      }
      const zone = e.target.closest('.cb-comb-zone');
      if (zone?.dataset.info) {
        e.stopPropagation();
        showCbCombInfo(zone.dataset.info);
      }
    });
    showCbCombInfo('intro');
  }

  /* ===== Lecture 5: IEC 60898 ===== */
  const cbIecSlide = document.querySelector('.slide-cb-iec-interactive');
  if (cbIecSlide) {
    const panel = document.getElementById('cbIecPanel');
    const info = {
      b: {
        title: 'Тип B',
        html: '<p>Отсечка <strong>3…5 In</strong>. Кабели с малым пусковым броском: освещение, электроника, длинные линии. Ложно не сработает на слабый бросок, но чувствительна к КЗ.</p>'
      },
      c: {
        title: 'Тип C',
        html: '<p>Отсечка <strong>5…10 In</strong>. Универсальная кривая для розеток и смешанной нагрузки в зданиях и щитах САУ.</p>'
      },
      d: {
        title: 'Тип D',
        html: '<p>Отсечка <strong>10…20 In</strong>. Трансформаторы, двигатели с тяжёлым пуском, лампы с большим броском. Иначе автомат выбьет на пуске.</p>'
      },
      th: {
        title: 'Тепловой',
        html: '<p>Для всех кривых B/C/D тепловая часть одна: 1,13 In — не отключает за 1 ч; 1,45 In — отключает за 1 ч (In ≤ 63 А).</p><p>Различаются только электромагнитные зоны.</p>'
      }
    };
    const X0 = 70;
    const X1 = 468;
    const Y0 = 190;
    const Y1 = 58;
    const IMIN = 1;
    const IMAX = 22;
    const iecX = (i) => X0 + Math.log(i / IMIN) / Math.log(IMAX / IMIN) * (X1 - X0);
    const iecYth = (i, iEnd) => {
      const a = 1.13;
      const u = Math.log(Math.max(i, a) / a) / Math.log(Math.max(iEnd, a + 0.4) / a);
      const yTop = Y1 + 14;
      const yJoin = Y0 - 32;
      return yTop + Math.max(0, Math.min(1, u)) * (yJoin - yTop);
    };
    const ticks = cbIecSlide.querySelector('.cb-iec-ticks');
    if (ticks) {
      ticks.replaceChildren();
      [1, 2, 3, 5, 10, 20].forEach((i) => {
        const x = iecX(i);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(x));
        line.setAttribute('x2', String(x));
        line.setAttribute('y1', String(Y0));
        line.setAttribute('y2', String(Y0 + 8));
        line.setAttribute('stroke', '#1e293b');
        line.setAttribute('stroke-width', '1.4');
        ticks.appendChild(line);
        const tx = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tx.setAttribute('x', String(i === 1 ? x + 8 : x));
        tx.setAttribute('y', String(Y0 + 24));
        tx.setAttribute('text-anchor', i === 1 ? 'start' : 'middle');
        tx.setAttribute('data-tick', String(i));
        tx.textContent = String(i);
        ticks.appendChild(tx);
      });
    }
    const showCbIecInfo = (key) => {
      const data = info[key] || info.c;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbIecSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      const ranges = { b: [3, 5], c: [5, 10], d: [10, 20] };
      const pair = ranges[key] || ranges.c;
      const xLo = iecX(pair[0]);
      const xHi = iecX(pair[1]);
      const mid = (xLo + xHi) / 2;
      const cut = cbIecSlide.querySelector('.cb-iec-cut');
      const band = cbIecSlide.querySelector('.cb-iec-band');
      const thermal = cbIecSlide.querySelector('.cb-iec-thermal');
      const thLab = cbIecSlide.querySelector('.cb-iec-th-lab');
      const readout = cbIecSlide.querySelector('.cb-iec-readout');
      if (band) {
        band.setAttribute('x', String(xLo));
        band.setAttribute('width', String(Math.max(14, xHi - xLo)));
        band.setAttribute('opacity', key === 'th' ? '0.16' : '0.5');
      }
      if (cut) {
        cut.setAttribute('x1', String(mid));
        cut.setAttribute('x2', String(mid));
        cut.setAttribute('opacity', key === 'th' ? '0.22' : '1');
      }
      if (thermal) {
        let d = '';
        const iEnd = pair[0];
        for (let k = 0; k <= 28; k += 1) {
          const i = 1.13 + (k / 28) * (iEnd - 1.13);
          d += `${k === 0 ? 'M' : 'L'}${iecX(i).toFixed(1)} ${iecYth(i, iEnd).toFixed(1)} `;
        }
        d += `L${xLo.toFixed(1)} ${Y0}`;
        thermal.setAttribute('d', d.trim());
        thermal.setAttribute('stroke-width', key === 'th' ? '3.4' : '2.8');
      }
      if (thLab) {
        thLab.setAttribute('x', String(iecX(1.55)));
        thLab.setAttribute('y', String(iecYth(1.55, pair[0]) - 14));
        thLab.setAttribute('opacity', key === 'th' ? '1' : '0.95');
      }
      if (readout) {
        if (key === 'th') {
          readout.setAttribute('x', '270');
          readout.setAttribute('y', '28');
          readout.textContent = 'тепловой · 1,13 In не за 1 ч · 1,45 In за 1 ч';
        } else {
          readout.setAttribute('x', String(mid));
          readout.setAttribute('y', '48');
          readout.textContent = `тип ${key.toUpperCase()} · отсечка ${pair[0]}…${pair[1]} In`;
        }
      }
      if (ticks) {
        ticks.querySelectorAll('text').forEach((tx) => {
          const n = Number(tx.getAttribute('data-tick'));
          const on = key !== 'th' && (n === pair[0] || n === pair[1]);
          tx.setAttribute('fill', on ? '#1e40af' : '#334155');
          tx.setAttribute('font-weight', on ? '700' : '500');
        });
      }
    };
    cbIecSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbIecInfo(tab.dataset.info);
    });
    showCbIecInfo('c');
  }

  /* ===== Lecture 5: IEC 60947-2 ===== */
  const cbIndSlide = document.querySelector('.slide-cb-ind-interactive');
  if (cbIndSlide) {
    const panel = document.getElementById('cbIndPanel');
    const info = {
      icu: {
        title: 'Icu и Ics',
        html: '<p><strong>Icu</strong> — предельная коммутационная способность: автомат отключит КЗ и может после этого не работать.</p><p><strong>Ics</strong> — рабочая: после отключения такого тока аппарат снова готов. Для щита САУ берут Icu ≥ ток КЗ в точке установки.</p>'
      },
      cat: {
        title: 'Категории A и B',
        html: '<p><strong>A</strong> — без выдержки на КЗ, обычно токоограничивающий (модульные и многие MCCB).</p><p><strong>B</strong> — выдерживает ток КЗ время Icw, чтобы нижестоящие успели отключиться: селективность на вводе.</p>'
      },
      adj: {
        title: 'Регулировка',
        html: '<p>Тепловую и электромагнитную уставки на промышленном автомате часто крутят в процентах In. Электронный блок задаёт L, S, I отдельно — это уже не фиксированные B/C/D.</p>'
      },
      vs: {
        title: 'Не 60898',
        html: '<p>МЭК 60898 — бытовые и аналогичные. МЭК 60947-2 — промышленные: выше Icu, другие испытания, категории применения, опции расцепителей.</p><p>В шкаф САУ с двигателями почти всегда 60947-2.</p>'
      }
    };
    const showCbIndInfo = (key) => {
      const data = info[key] || info.icu;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbIndSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbIndSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbIndInfo(card.dataset.info);
    });
    showCbIndInfo('icu');
  }

  /* ===== Lecture 5: electronic trip ===== */
  const cbElSlide = document.querySelector('.slide-cb-el-interactive');
  if (cbElSlide) {
    const panel = document.getElementById('cbElPanel');
    const info = {
      l: {
        title: 'L · перегрузка',
        html: '<p>Long-time: уставка тока Ir и времени tr. Заменяет тепловой расцепитель, но не боится окружающей температуры так же сильно.</p><p>Ток измеряют трансформаторы в полюсах, решение принимает электронный блок.</p>'
      },
      s: {
        title: 'S · КЗ с выдержкой',
        html: '<p>Short-time: ток Isd и выдержка tsd. Нужна, чтобы нижестоящий автомат успел отключить КЗ на своём фидере — селективность.</p>'
      },
      i: {
        title: 'I · мгновенно',
        html: '<p>Instantaneous: ток Ii. Аналог электромагнитной отсечки, но уставка задаётся числом, не кривой B/C/D.</p>'
      },
      g: {
        title: 'G · земля',
        html: '<p>Ground / earth fault: ток утечки на корпус по сумме фаз. Это не УЗО на 30 мА: уставки амперы, защита сети, не человека.</p>'
      }
    };
    const showCbElInfo = (key) => {
      const data = info[key] || info.l;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbElSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbElSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbElInfo(card.dataset.info);
    });
    showCbElInfo('l');
  }

  /* ===== Lecture 5: UVR and shunt ===== */
  const cbUvSlide = document.querySelector('.slide-cb-uv-interactive');
  if (cbUvSlide) {
    const panel = document.getElementById('cbUvPanel');
    const info = {
      uv: {
        title: 'Минимум U',
        html: '<p>Катушка питается от сети. Автомат <strong>держится</strong> включённым, пока есть напряжение. Провал ниже ~0,35…0,7 Un — расцепление.</p><p>Нужен, чтобы механизм не самозапустился после пропадания питания.</p>'
      },
      shunt: {
        title: 'Независимый',
        html: '<p>Катушка в норме <strong>обесточена</strong>. Подали напряжение (кнопка «стоп», пожарка, выход ПЛК) — якорь срывает защёлку.</p><p>Полярность и длительность импульса — по паспорту; катушка не рассчитана на длительное включение.</p>'
      },
      plc: {
        title: 'Выход ПЛК',
        html: '<p>Независимый расцепитель сажают на дискретный выход через реле: авария в программе → автомат отключил силовой ввод.</p><p>Минимум U обычно берут с той же сети, не с ПЛК: иначе пропадёт контроллер — и отключится питание.</p>'
      }
    };
    const showCbUvInfo = (key) => {
      const data = info[key] || info.uv;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbUvSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      cbUvSlide.querySelectorAll('.cb-uv-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    cbUvSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showCbUvInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.cb-uv-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showCbUvInfo(block.dataset.info);
      }
    });
    showCbUvInfo('uv');
  }

  /* ===== Lecture 5: residual current ===== */
  const cbDiffSlide = document.querySelector('.slide-cb-diff-interactive');
  if (cbDiffSlide) {
    const panel = document.getElementById('cbDiffPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Все рабочие проводники проходят через одно магнитопроводное кольцо. Если утечки нет, сумма токов ноль — во вторичной обмотке ЭДС нет.</p><p>Ток на землю (человек, повреждение изоляции) даёт IΔ — расцепитель срывает автомат.</p>'
      },
      tor: {
        title: 'Кольцо',
        html: '<p>Дифференциальный трансформатор тока. PE через кольцо <strong>не</strong> пропускают. N — пропускают, иначе бытовая однофазная схема не сбалансируется.</p>'
      },
      idn: {
        title: 'IΔn',
        html: '<p>Номинальный отключающий дифференциальный ток. Срабатывание обычно в диапазоне 0,5…1 IΔn.</p><p>30 мА — защита людей; 100…300 мА — пожарная защита линий.</p>'
      }
    };
    const tabs = ['intro', 'tor', 'idn'];
    const showCbDiffInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbDiffSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateCbDiff = () => {
      const raw = Number(cbDiffSlide.querySelector('.cb-diff-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0;
      const ma = Math.round(t * 40);
      const trip = ma >= 30;
      const leak = cbDiffSlide.querySelector('.cb-diff-leak');
      const lab = cbDiffSlide.querySelector('.cb-diff-ileak');
      const readout = cbDiffSlide.querySelector('.cb-diff-readout');
      const val = cbDiffSlide.querySelector('.cb-diff-val');
      if (leak) leak.setAttribute('opacity', t > 0.05 ? String(0.3 + t * 0.7) : '0');
      if (lab) lab.setAttribute('opacity', t > 0.05 ? '1' : '0');
      if (readout) {
        readout.textContent = trip
          ? `IΔ = ${ma} мА · сработал (≥ IΔn 30 мА)`
          : (ma === 0 ? 'IΔ = 0 · сумма токов ноль' : `IΔ = ${ma} мА · ниже уставки`);
      }
      if (val) val.textContent = `${ma} мА`;
    };
    cbDiffSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbDiffInfo(tab.dataset.info);
    });
    cbDiffSlide.querySelector('.cb-diff-range')?.addEventListener('input', updateCbDiff);
    showCbDiffInfo('intro');
    updateCbDiff();
  }

  /* ===== Lecture 5: RCD vs RCBO ===== */
  const cbRcdSlide = document.querySelector('.slide-cb-rcd-interactive');
  if (cbRcdSlide) {
    const panel = document.getElementById('cbRcdPanel');
    const info = {
      rcd: {
        title: 'УЗО',
        html: '<p>Устройство защитного отключения: только дифференциальный расцепитель. От перегрузки и КЗ <strong>не защищает</strong> — впереди ставят автомат.</p><p>Типовые IΔn: 10, 30, 100, 300 мА. 30 мА — защита человека.</p>'
      },
      rcbo: {
        title: 'АВДТ',
        html: '<p>Автоматический выключатель, управляемый дифференциальным током: в одном корпусе тепловой, электромагнитный и дифференциальный расцепители.</p><p>Один модуль вместо пары «автомат + УЗО». В щитах САУ — на розеточные и влажные линии.</p>'
      },
      type: {
        title: 'Типы A и AC',
        html: '<p><strong>AC</strong> — только синусоидальная утечка. <strong>A</strong> — ещё и пульсирующий постоянный (частотный привод, импульсные БП).</p><p>У преобразователей частоты обычное УЗО типа AC может «не увидеть» утечку — берут A или B.</p>'
      },
      test: {
        title: 'Кнопка T',
        html: '<p>Искусственно создаёт IΔ. Проверяют ежемесячно: механизм не должен закисать. Нет отключения — аппарат в утиль, не «починят» настройкой.</p>'
      }
    };
    const showCbRcdInfo = (key) => {
      const data = info[key] || info.rcd;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbRcdSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbRcdSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbRcdInfo(card.dataset.info);
    });
    showCbRcdInfo('rcd');
  }

  /* ===== Lecture 5: selection ===== */
  const cbSelSlide = document.querySelector('.slide-cb-sel-interactive');
  if (cbSelSlide) {
    const panel = document.getElementById('cbSelPanel');
    const info = {
      in: {
        title: 'Номинал In',
        html: '<p>Ib ≤ In ≤ Iz: рабочий ток нагрузки не выше номинала автомата, номинал не выше длительно допустимого тока кабеля.</p><p>Для двигателя In берут с запасом на пуск, а кривую — D или специальную моторную.</p>'
      },
      curve: {
        title: 'Кривая',
        html: '<p>B — слабый бросок, C — общий случай щита, D — тяжёлый пуск. Неверная кривая: либо ложные отключения, либо кабель не защищён при КЗ в конце линии.</p>'
      },
      icu: {
        title: 'Icu',
        html: '<p>Icu (или Icn у 60898) не ниже расчётного тока КЗ в месте установки. Запас «на всякий» дороже, но 6 кА на вводе цеха при 25 кА — ошибка проекта.</p>'
      },
      cable: {
        title: 'Кабель',
        html: '<p>Автомат защищает жилу: время-токовая характеристика должна лежать левее допустимой энергии кабеля k²S².</p><p>Сечение сначала по нагрузке и падению U, потом проверяют защиту автоматом.</p>'
      }
    };
    const showCbSelInfo = (key) => {
      const data = info[key] || info.in;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbSelSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbSelSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbSelInfo(card.dataset.info);
    });
    showCbSelInfo('in');
  }

  /* ===== Lecture 5: coordination ===== */
  const cbCoordSlide = document.querySelector('.slide-cb-coord-interactive');
  if (cbCoordSlide) {
    const panel = document.getElementById('cbCoordPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Селективность: при КЗ на отходящей линии отключается <strong>Q2</strong>, ввод Q1 остаётся. Иначе падает весь щит.</p><p>Добиваются ступенью номиналов, кривыми и выдержкой электронных расцепителей. Каскад (backup) — когда верхний помогает гасить, если нижнему не хватает Icu.</p>'
      },
      time: {
        title: 'По времени',
        html: '<p>Электронный S-блок на вводе с выдержкой tsd. Нижний автомат без выдержки успевает первым. Категория B и Icw как раз для этого.</p>'
      },
      curr: {
        title: 'По току',
        html: '<p>Отсечка нижнего ниже, чем у верхнего, плюс разнос номиналов. На малых КЗ этого хватает; на больших токах токоограничение и таблицы селективности завода.</p>'
      }
    };
    const tabs = ['intro', 'time', 'curr'];
    const showCbCoordInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbCoordSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tabs.includes(key) && btn.dataset.info === key);
      });
    };
    const updateCbCoord = () => {
      const raw = Number(cbCoordSlide.querySelector('.cb-coord-range')?.value);
      const t = Number.isFinite(raw) ? raw / 100 : 0.25;
      const both = t >= 0.72;
      const up = cbCoordSlide.querySelector('.cb-coord-up');
      const dn = cbCoordSlide.querySelector('.cb-coord-dn');
      const readout = cbCoordSlide.querySelector('.cb-coord-readout');
      const val = cbCoordSlide.querySelector('.cb-coord-val');
      if (dn) dn.setAttribute('stroke', '#dc2626');
      if (up) up.setAttribute('stroke', both ? '#dc2626' : '#1e293b');
      if (readout) {
        readout.textContent = both
          ? 'большой ток · сработали оба · селективности нет'
          : 'малый ток · отключился Q2 · ввод жив';
      }
      if (val) val.textContent = both ? 'оба' : 'линия';
    };
    cbCoordSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showCbCoordInfo(tab.dataset.info);
    });
    cbCoordSlide.querySelector('.cb-coord-range')?.addEventListener('input', updateCbCoord);
    showCbCoordInfo('intro');
    updateCbCoord();
  }

  /* ===== Lecture 5: where in SAU ===== */
  const cbWhereSlide = document.querySelector('.slide-cb-where-interactive');
  if (cbWhereSlide) {
    const panel = document.getElementById('cbWherePanel');
    const info = {
      in: {
        title: 'Ввод щита',
        html: '<p>Автомат на вводе шкафа САУ: Icu по расчёту КЗ, селективность к вышестоящему на подстанции.</p><p>Часто промышленный (МЭК 60947-2) с электронным расцепителем.</p>'
      },
      mot: {
        title: 'Фидер двигателя',
        html: '<p>Автомат (кривая D или моторный) + контактор + тепловое реле или электронная защита в ПЧ.</p><p>ПЛК включает контактор, автомат только защищает кабель и КЗ.</p>'
      },
      plc: {
        title: 'Статус (плк)',
        html: '<p>Блок-контакт автомата на дискретный вход: «включен / сработал». Авария в SCADA без обхода шкафа.</p>'
      },
      estop: {
        title: 'Авар. стоп',
        html: '<p>Независимый расцепитель с кнопки или с выхода ПЛК снимает силовой ввод. Минимум U — чтобы после провала сети механизм не запустился сам.</p>'
      }
    };
    const showCbWhereInfo = (key) => {
      const data = info[key] || info.in;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      cbWhereSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    cbWhereSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCbWhereInfo(card.dataset.info);
    });
    showCbWhereInfo('in');
  }

  /* ===== Lecture 3: capacitive sensor properties ===== */
  const capSensPropsSlide = document.querySelector('.slide-cap-sens-props-interactive');
  if (capSensPropsSlide) {
    const panel = document.getElementById('capSensPropsPanel');
    const info = {
      make: {
        title: 'Изготовление',
        html: '<p><strong>Достоинство.</strong> Простота конструкции: пластины и диэлектрик, без сложной намотки. Материалы недорогие.</p>'
      },
      size: {
        title: 'Габариты',
        html: '<p><strong>Достоинство.</strong> Малые габариты и масса, малое потребление энергии: ток через конденсатор почти не течёт.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p><strong>Достоинство.</strong> Высокая чувствительность. В резонансной схеме ловят изменение ёмкости до 0,001 %.</p>'
      },
      life: {
        title: 'Срок службы',
        html: '<p><strong>Достоинство.</strong> Нет скользящего контакта, подвижная пластина лёгкая: долго служат и быстро отвечают.</p>'
      },
      level: {
        title: 'Уровень',
        html: '<p><strong>Достоинство.</strong> Между обкладками меняется диэлектрическая проницаемость <var>n</var> — так измеряют уровень жидкости и сыпучих.</p>'
      },
      k: {
        title: 'Коэффициент передачи',
        html: '<p><strong>Недостаток.</strong> Малый коэффициент передачи: Δ<var>C</var> — пикофарады, без усилителя и высокой частоты сигнал не снять.</p>'
      },
      shield: {
        title: 'Экранирование',
        html: '<p><strong>Недостаток.</strong> Высокие требования к экранированию: ёмкость кабеля сравнима с ёмкостью датчика и даёт погрешность.</p>'
      },
      bd: {
        title: 'Пробой',
        html: '<p><strong>Недостаток.</strong> При высоком напряжении и малом зазоре возможен пробой между пластинами.</p>'
      },
      freq: {
        title: 'Частота',
        html: '<p><strong>Недостаток.</strong> На 50 Гц ёмкостное сопротивление слишком велико. Питают повышенной частотой — на практике часто 400 Гц.</p>'
      }
    };
    const showCapSensProps = (key) => {
      const data = info[key] || info.make;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      capSensPropsSlide.querySelectorAll('.xfmr-prop-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    capSensPropsSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.xfmr-prop-item');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showCapSensProps(card.dataset.info);
    });
    showCapSensProps('make');
  }

  /* ===== Lecture 3: temperature intro ===== */
  const tempIntroSlide = document.querySelector('.slide-temp-intro-interactive');
  if (tempIntroSlide) {
    const panel = document.getElementById('tempIntroPanel');
    const info = {
      common: {
        title: 'Частые измерения',
        html: '<p>Температурные измерения — одни из самых распространённых в технологических процессах.</p>'
      },
      params: {
        title: 'Параметры разные',
        html: '<p>Точность, быстродействие и другие требования сильно зависят от конкретного технологического процесса.</p>'
      },
      sig: {
        title: 'В электрический сигнал',
        html: '<p>Общее для любого температурного датчика: измеряемая температура преобразуется в <strong>электрический сигнал</strong>.</p>'
      },
      digit: {
        title: 'В цифру',
        html: '<p>Электрический сигнал дальше можно преобразовать в цифровую форму — на вход ПЛК, регистратора, SCADA.</p>'
      }
    };
    const showTempIntroInfo = (key) => {
      const data = info[key] || info.common;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tempIntroSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    tempIntroSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showTempIntroInfo(card.dataset.info);
    });
    showTempIntroInfo('common');
  }

  /* ===== Lecture 3: contact vs remote ===== */
  const tempMethSlide = document.querySelector('.slide-temp-meth-interactive');
  if (tempMethSlide) {
    const panel = document.getElementById('tempMethPanel');
    const info = {
      contact: {
        title: 'Контактный',
        html: '<p>Непосредственный контакт с объектом. Точность выше.</p><p>Быстродействие ниже: нужно время, чтобы прогрелся материал самого датчика.</p>'
      },
      remote: {
        title: 'Бесконтактный',
        html: '<p>Тепло передаётся излучением. Датчик стоит на расстоянии от объекта — типичный прибор: <strong>пирометр</strong>.</p><p>Показания менее точны, чем при контактном способе.</p>'
      }
    };
    const showTempMethInfo = (key) => {
      const data = info[key] || info.contact;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tempMethSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      tempMethSlide.querySelectorAll('.temp-meth-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    tempMethSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showTempMethInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.temp-meth-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showTempMethInfo(block.dataset.info);
      }
    });
    showTempMethInfo('contact');
  }

  /* ===== Lecture 3: RTD ===== */
  const rtdSlide = document.querySelector('.slide-rtd-interactive');
  if (rtdSlide) {
    const panel = document.getElementById('rtdPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Самый распространённый датчик температуры — <strong>термометр сопротивления</strong> (ТС).</p><p>Основные параметры: температурный коэффициент, номинальное сопротивление <var>R</var><sub>0</sub>, диапазон измерения и номинальная статическая характеристика.</p>'
      },
      coil: {
        title: 'Катушка',
        html: '<p>Миниатюрная катушка из проволоки <strong>никеля, меди или платины</strong>. Вместе с гильзой и выводами это чувствительный элемент.</p>'
      },
      case: {
        title: 'Корпус',
        html: '<p>Защитная гильза. Остальная часть конструкции — головка датчика с клеммами.</p>'
      },
      type: {
        title: 'ТСМ и ТСП',
        html: '<p>Стандартизация по сопротивлению при 0 °C. <strong>ТСМ100</strong> — медь, <strong>ТСП100</strong> — платина, <var>R</var><sub>0</sub> = 100 Ом.</p>'
      }
    };
    const rtdTabKeys = ['intro', 'coil', 'case', 'type'];
    const showRtdInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      rtdSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', rtdTabKeys.includes(key) && btn.dataset.info === key);
      });
      rtdSlide.querySelectorAll('.rtd-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    rtdSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showRtdInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.rtd-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showRtdInfo(block.dataset.info);
      }
    });
    showRtdInfo('intro');
  }

  /* ===== Lecture 3: TCR ===== */
  const rtdAlphaSlide = document.querySelector('.slide-rtd-alpha-interactive');
  if (rtdAlphaSlide) {
    const panel = document.getElementById('rtdAlphaPanel');
    const info = {
      alpha: {
        title: 'Коэффициент α',
        html: '<p>Температурный коэффициент ТС характеризует относительное изменение сопротивления в пределах 0…100 °C.</p>'
      },
      nsc: {
        title: 'НСХ',
        html: '<p>Зная <var>R</var><sub>0</sub> и α, строят номинальную статическую характеристику: <var>R</var><sub>t</sub> = <var>R</var><sub>0</sub> (1 + α <var>t</var>).</p>'
      },
      r0: {
        title: 'R₀',
        html: '<p>Номинальное сопротивление задают при 0 °C. Типовые значения: <strong>10, 50, 100, 500 Ом</strong>.</p>'
      }
    };
    const RTD_R0 = 100;
    const RTD_A = 0.00385;
    const RTD_X0 = 70;
    const RTD_X1 = 230;
    const RTD_Y0 = 128;
    const RTD_Y1 = 56;
    const rtdFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const rtdRof = (t) => RTD_R0 * (1 + RTD_A * t);
    const rtdToX = (t) => RTD_X0 + (t / 100) * (RTD_X1 - RTD_X0);
    const rtdToY = (r) => {
      const r100 = rtdRof(100);
      return RTD_Y0 - ((r - RTD_R0) / (r100 - RTD_R0)) * (RTD_Y0 - RTD_Y1);
    };
    const showRtdAlphaInfo = (key) => {
      const data = info[key] || info.alpha;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      rtdAlphaSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    const updateRtdAlpha = () => {
      const raw = Number(rtdAlphaSlide.querySelector('.rtd-t-range')?.value);
      const t = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
      const r = rtdRof(t);
      const point = rtdAlphaSlide.querySelector('.rtd-alpha-point');
      const readout = rtdAlphaSlide.querySelector('.rtd-alpha-readout');
      const tVal = rtdAlphaSlide.querySelector('.rtd-t-val');
      if (point) {
        point.setAttribute('cx', String(rtdToX(t)));
        point.setAttribute('cy', String(rtdToY(r)));
      }
      if (readout) readout.textContent = `${Math.round(t)} °C · ${rtdFmt(r, 1)} Ом`;
      if (tVal) tVal.textContent = `${Math.round(t)} °C`;
    };
    const curve = rtdAlphaSlide.querySelector('.rtd-alpha-curve');
    if (curve) {
      curve.setAttribute('d', `M${rtdToX(0).toFixed(1)} ${rtdToY(rtdRof(0)).toFixed(1)} L${rtdToX(200).toFixed(1)} ${rtdToY(rtdRof(200)).toFixed(1)}`);
    }
    rtdAlphaSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab?.dataset.info) return;
      e.stopPropagation();
      showRtdAlphaInfo(tab.dataset.info);
    });
    rtdAlphaSlide.querySelector('.rtd-t-range')?.addEventListener('input', updateRtdAlpha);
    showRtdAlphaInfo('alpha');
    updateRtdAlpha();
  }

  /* ===== Lecture 3: RTD ranges ===== */
  const rtdRangeSlide = document.querySelector('.slide-rtd-range-interactive');
  if (rtdRangeSlide) {
    const panel = document.getElementById('rtdRangePanel');
    const info = {
      r0: {
        title: 'R₀',
        html: '<p>Номинальное сопротивление — при 0 °C. Типовые значения: <strong>10, 50, 100, 500 Ом</strong>.</p>'
      },
      pt: {
        title: 'Платина',
        html: '<p>Диапазон измерения: <strong>−196…+660 °C</strong>. ТСП — наиболее широкий интервал среди типовых ТС.</p>'
      },
      cu: {
        title: 'Медь',
        html: '<p>Диапазон измерения: <strong>−50…+200 °C</strong>. ТСМ — дешевле платины, диапазон уже.</p>'
      },
      ni: {
        title: 'Никель',
        html: '<p>Диапазон измерения: <strong>−60…+180 °C</strong>.</p>'
      }
    };
    const showRtdRangeInfo = (key) => {
      const data = info[key] || info.r0;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      rtdRangeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    rtdRangeSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showRtdRangeInfo(card.dataset.info);
    });
    showRtdRangeInfo('r0');
  }

  /* ===== Lecture 3: RTD schematic symbols ===== */
  const rtdSymSlide = document.querySelector('.slide-rtd-sym-interactive');
  if (rtdSymSlide) {
    const panel = document.getElementById('rtdSymPanel');
    const info = {
      four: {
        title: 'Четыре вывода',
        html: '<p>Напряжение снимают с выводов <strong>1</strong> и <strong>2</strong>. К <strong>3</strong> и <strong>4</strong> подключают внешний источник и добавочные резисторы.</p>'
      },
      two: {
        title: 'Два вывода',
        html: '<p>В некоторых конструкциях выводы объединяют: остаются два провода. Падение напряжения на ТС зависит от <var>t</var><sub>окр</sub>.</p>'
      },
      p12: {
        title: 'Выводы 1 и 2',
        html: '<p>С них снимают измеряемое напряжение. Оно зависит от сопротивления ТС, а значит от температуры.</p>'
      },
      p34: {
        title: 'Выводы 3 и 4',
        html: '<p>Сюда подключают внешний источник питания и добавочные резисторы.</p>'
      }
    };
    const showRtdSymInfo = (key) => {
      const data = info[key] || info.four;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      rtdSymSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      rtdSymSlide.querySelectorAll('.rtd-sym-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
      rtdSymSlide.querySelectorAll('.rtd-sym-pin').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    rtdSymSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showRtdSymInfo(tab.dataset.info);
        return;
      }
      const pin = e.target.closest('.rtd-sym-pin');
      if (pin?.dataset.info) {
        e.stopPropagation();
        showRtdSymInfo(pin.dataset.info);
        return;
      }
      const block = e.target.closest('.rtd-sym-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showRtdSymInfo(block.dataset.info);
      }
    });
    showRtdSymInfo('four');
  }

  /* ===== Lecture 3: RTD properties ===== */
  const rtdPropsSlide = document.querySelector('.slide-rtd-props-interactive');
  if (rtdPropsSlide) {
    const panel = document.getElementById('rtdPropsPanel');
    const info = {
      acc: {
        title: 'Точность',
        html: '<p><strong>Достоинство.</strong> Высокая точность измерения: погрешность менее ±1 °C.</p>'
      },
      line: {
        title: 'Линия',
        html: '<p><strong>Достоинство.</strong> Четырёхпроводная схема позволяет исключить влияние изменения сопротивления линии на результат.</p>'
      },
      lin: {
        title: 'Характеристика',
        html: '<p><strong>Достоинство.</strong> Номинальная статическая характеристика почти линейна: <var>R<sub>t</sub></var> = <var>R</var><sub>0</sub> (1 + α <var>t</var>).</p>'
      },
      range: {
        title: 'Диапазон',
        html: '<p><strong>Недостаток.</strong> Диапазон измерения относительно невелик по сравнению с термопарами.</p>'
      },
      cost: {
        title: 'Цена',
        html: '<p><strong>Недостаток.</strong> Стоимость выше, чем у термопар из неблагородных металлов (хромель, алюмель).</p>'
      },
      src: {
        title: 'Питание',
        html: '<p><strong>Недостаток.</strong> Нужен дополнительный источник: через датчик пропускают ток, чтобы снять падение напряжения.</p>'
      }
    };
    const showRtdProps = (key) => {
      const data = info[key] || info.acc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      rtdPropsSlide.querySelectorAll('.xfmr-prop-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    rtdPropsSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.xfmr-prop-item');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showRtdProps(card.dataset.info);
    });
    showRtdProps('acc');
  }

  /* ===== Lecture 3: thermocouple ===== */
  const tcSlide = document.querySelector('.slide-tc-interactive');
  if (tcSlide) {
    const panel = document.getElementById('tcPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Термопара — термоэлектрический преобразователь. На спае двух разнородных металлов возникает термоЭДС.</p><p>ЭДС зависит от разности температур горячего и холодного спаев и от пары металлов.</p>'
      },
      hot: {
        title: 'Горячий спай',
        html: '<p>Рабочий спай <var>T</var><sub>1</sub> — место сварки двух металлов, его помещают в измеряемую среду.</p>'
      },
      cold: {
        title: 'Холодный спай',
        html: '<p>Свободные концы <var>T</var><sub>2</sub> подключают к измерителю. Если <var>T</var><sub>1</sub> = <var>T</var><sub>2</sub>, термоЭДС равна нулю.</p>'
      },
      mat: {
        title: 'Материалы',
        html: '<p>Благородные: платина, платинородий. Неблагородные: хромель, алюмель.</p><p>Диапазон измерения примерно <strong>−200…2200 °C</strong>.</p>'
      },
      tau: {
        title: 'Постоянная τ',
        html: '<p>Постоянная времени зависит от конструкции и контакта со средой: от нескольких минут до <strong>5–20 с</strong>.</p>'
      }
    };
    const tcTabKeys = ['intro', 'hot', 'cold', 'mat', 'tau'];
    const TC_K = 0.041;
    const tcFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showTcInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tcSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', tcTabKeys.includes(key) && btn.dataset.info === key);
      });
      tcSlide.querySelectorAll('.tc-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateTcEmf = () => {
      const raw1 = Number(tcSlide.querySelector('.tc-t1-range')?.value);
      const raw2 = Number(tcSlide.querySelector('.tc-t2-range')?.value);
      const t1 = Number.isFinite(raw1) ? Math.max(0, Math.min(1200, raw1)) : 600;
      const t2 = Number.isFinite(raw2) ? Math.max(0, Math.min(80, raw2)) : 20;
      const e = TC_K * (t1 - t2);
      const eLab = tcSlide.querySelector('.tc-e-lab');
      const readout = tcSlide.querySelector('.tc-readout');
      const t1Val = tcSlide.querySelector('.tc-t1-val');
      const t2Val = tcSlide.querySelector('.tc-t2-val');
      const hot = tcSlide.querySelector('.tc-hot');
      if (eLab) eLab.textContent = `${tcFmt(Math.max(0, e), 1)} мВ`;
      if (readout) {
        readout.textContent = Math.abs(t1 - t2) < 0.5
          ? 'T₁ = T₂ → E = 0'
          : `E ≈ ${tcFmt(e, 1)} мВ · ΔT = ${Math.round(t1 - t2)} °C`;
      }
      if (t1Val) t1Val.textContent = `${Math.round(t1)} °C`;
      if (t2Val) t2Val.textContent = `${Math.round(t2)} °C`;
      if (hot) {
        const k = t1 / 1200;
        const r = Math.round(254 - k * 50);
        const g = Math.round(202 - k * 160);
        const b = Math.round(202 - k * 170);
        hot.setAttribute('fill', `rgb(${r},${g},${b})`);
      }
    };
    tcSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showTcInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.tc-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showTcInfo(block.dataset.info);
      }
    });
    tcSlide.querySelector('.tc-t1-range')?.addEventListener('input', updateTcEmf);
    tcSlide.querySelector('.tc-t2-range')?.addEventListener('input', updateTcEmf);
    showTcInfo('intro');
    updateTcEmf();
  }

  /* ===== Lecture 3: thermocouple parameters ===== */
  const tcParamSlide = document.querySelector('.slide-tc-param-interactive');
  if (tcParamSlide) {
    const panel = document.getElementById('tcParamPanel');
    const info = {
      tpp: {
        title: 'ТПП',
        html: '<p>Электроды ПП-1: платинородий (10 % родия) и платина. Пределы <strong>−20…1200 °C</strong>.</p><p>Свободные концы выносят из головки в зону с постоянной температурой — так повышают точность.</p>'
      },
      tpr: {
        title: 'ТПР',
        html: '<p>Электроды ПР-30: платинородий (30 % родия). Пределы <strong>300…1600 °C</strong>. Для более высоких температур, чем ТПП.</p>'
      },
      txa: {
        title: 'ТХА',
        html: '<p>Хромель — алюмель. Пределы <strong>−50…1000 °C</strong>. Неблагородная пара, распространённая в промышленности.</p>'
      },
      txk: {
        title: 'ТХК',
        html: '<p>Хромель — копель. Пределы <strong>−50…600 °C</strong>. Неблагородная пара, диапазон уже, чем у ТХА.</p>'
      },
      low: {
        title: 'Ниже −50 °C',
        html: '<p>Для температур ниже −50 °C применяют термопары медь — константан, до <strong>−270 °C</strong>.</p>'
      },
      high: {
        title: 'Выше 1800 °C',
        html: '<p>Выше 1800 °C — термопары на основе тугоплавких металлов.</p>'
      }
    };
    const showTcParamInfo = (key) => {
      const data = info[key] || info.tpp;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tcParamSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      tcParamSlide.querySelectorAll('.tc-param-row').forEach((row) => {
        row.classList.toggle('active', row.dataset.info === key);
      });
    };
    tcParamSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showTcParamInfo(tab.dataset.info);
        return;
      }
      const row = e.target.closest('.tc-param-row');
      if (row?.dataset.info) {
        e.stopPropagation();
        showTcParamInfo(row.dataset.info);
      }
    });
    showTcParamInfo('tpp');
  }

  /* ===== Lecture 3: thermocouple properties ===== */
  const tcPropsSlide = document.querySelector('.slide-tc-props-interactive');
  if (tcPropsSlide) {
    const panel = document.getElementById('tcPropsPanel');
    const info = {
      acc: {
        title: 'Точность',
        html: '<p><strong>Достоинство.</strong> Высокая точность измерения температуры — до ±0,01 °C.</p>'
      },
      span: {
        title: 'Диапазон',
        html: '<p><strong>Достоинство.</strong> Широкий диапазон: примерно <strong>−250…2500 °C</strong>.</p>'
      },
      simple: {
        title: 'Конструкция',
        html: '<p><strong>Достоинство.</strong> Простая конструкция: два электрода и спай.</p>'
      },
      cost: {
        title: 'Цена',
        html: '<p><strong>Достоинство.</strong> Невысокая стоимость, особенно у пар из неблагородных металлов.</p>'
      },
      rel: {
        title: 'Надёжность',
        html: '<p><strong>Достоинство.</strong> Надёжны в промышленных условиях.</p>'
      },
      nl: {
        title: 'Нелинейность',
        html: '<p><strong>Недостаток.</strong> Зависимость термоЭДС от температуры нелинейна — усложняет вторичные приборы.</p>'
      },
      cold: {
        title: 'Холодный спай',
        html: '<p><strong>Недостаток.</strong> Показания зависят от температуры холодного спая, нужна компенсация.</p>'
      },
      cal: {
        title: 'Градуировка',
        html: '<p><strong>Недостаток.</strong> Для высокой точности нужна индивидуальная градуировка термопары.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p><strong>Недостаток.</strong> Малая чувствительность.</p>'
      },
      r0: {
        title: 'Сопротивление',
        html: '<p><strong>Недостаток.</strong> Большое начальное сопротивление.</p><p>Общий минус с ТС: датчик вводят в среду — искажается температурное поле и при высоких t сама характеристика.</p>'
      }
    };
    const showTcProps = (key) => {
      const data = info[key] || info.acc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tcPropsSlide.querySelectorAll('.xfmr-prop-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    tcPropsSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.xfmr-prop-item');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showTcProps(card.dataset.info);
    });
    showTcProps('acc');
  }

  /* ===== Lecture 3: pyrometers ===== */
  const pyroSlide = document.querySelector('.slide-pyro-interactive');
  if (pyroSlide) {
    const panel = document.getElementById('pyroPanel');
    const info = {
      intro: {
        title: 'Обзор',
        html: '<p>Пирометры — бесконтактные датчики температуры. Используют излучение нагретых тел и обходят минусы контактного измерения: датчик не вводят в среду.</p>'
      },
      fluo: {
        title: 'Флуоресцентные',
        html: '<p>На поверхность объекта наносят слой люминофора. При измерении объект облучают ультрафиолетом: интенсивность свечения зависит от температуры.</p>'
      },
      inter: {
        title: 'Интерферометрические',
        html: '<p>Сравнивают два луча: контрольный и прошедший через среду, параметры которой меняются с температурой.</p>'
      },
      sol: {
        title: 'На основе растворов',
        html: '<p>Растворы меняют цвет под действием температуры. По оптическому сигналу судят о t.</p>'
      }
    };
    const showPyroInfo = (key) => {
      const data = info[key] || info.intro;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      pyroSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      pyroSlide.querySelectorAll('.pyro-view').forEach((view) => {
        view.classList.toggle('is-on', view.dataset.info === key);
      });
    };
    pyroSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPyroInfo(tab.dataset.info);
      }
    });
    showPyroInfo('intro');
  }

  /* ===== Lecture 3: temperature sensor choice ===== */
  const tempChooseSlide = document.querySelector('.slide-temp-choose-interactive');
  if (tempChooseSlide) {
    const panel = document.getElementById('tempChoosePanel');
    const info = {
      range: {
        title: 'Диапазон',
        html: '<p>Учитывают диапазон измеряемых температур: ТС, термопара и пирометр закрывают разные интервалы.</p>'
      },
      imm: {
        title: 'Погружение',
        html: '<p>Возможность погружения датчика в измеряемую среду. У пирометра контакта нет — поле среды не искажается самим чувствительным элементом.</p>'
      },
      life: {
        title: 'Срок службы',
        html: '<p>Длительность работы без замены и без повторной калибровки.</p>'
      },
      out: {
        title: 'Выход',
        html: '<p>Характер выходного сигнала: сопротивление, милливольты термоЭДС, нормированный ток или напряжение — от этого зависит вход ПЛК.</p>'
      },
      dyn: {
        title: 'Динамика',
        html: '<p>Быстродействие (постоянная времени), погрешность и напряжение питания.</p>'
      },
      acc: {
        title: 'Точность',
        html: '<p>Точность пирометрических датчиков ниже, чем у контактных (ТС, термопара).</p>'
      }
    };
    const showTempChooseInfo = (key) => {
      const data = info[key] || info.range;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tempChooseSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    tempChooseSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showTempChooseInfo(card.dataset.info);
    });
    showTempChooseInfo('range');
  }

  /* ===== Lecture 3: where in SAU ===== */
  const tempWhereSlide = document.querySelector('.slide-temp-where-interactive');
  if (tempWhereSlide) {
    const panel = document.getElementById('tempWherePanel');
    const info = {
      proc: {
        title: 'Техпроцесс',
        html: '<p>Печь, теплоноситель, реактор: температура — ключевой параметр контура. Датчик даёт электрический сигнал, его оцифровывают.</p>'
      },
      motor: {
        title: 'Обмотки',
        html: '<p>ТС в обмотке двигателя или трансформатора: перегрев видно до аварии, защита и ПЛК получают сопротивление как температуру.</p>'
      },
      cab: {
        title: 'Шкаф',
        html: '<p>Температура шкафа САУ: вентиляция, отказ при перегреве модулей. Часто тот же принцип — сопротивление от температуры.</p>'
      },
      plc: {
        title: 'Вход ПЛК',
        html: '<p>Нормированный сигнал (или измеренное R) идёт на аналоговый вход. В программе — уставка, тренд, блокировка.</p>'
      }
    };
    const showTempWhereInfo = (key) => {
      const data = info[key] || info.proc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      tempWhereSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    tempWhereSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showTempWhereInfo(card.dataset.info);
    });
    showTempWhereInfo('proc');
  }

  /* ===== Lecture 3: ultrasonic sensors ===== */
  const usSlide = document.querySelector('.slide-us-interactive');
  if (usSlide) {
    const panel = document.getElementById('usPanel');
    const info = {
      piezo: {
        title: 'Пьезоэффект',
        html: '<p>В электрическом поле керамическая или кварцевая пластина меняет геометрические размеры. При механическом сжатии на поверхности пластины возникает электрическое поле.</p>'
      },
      us: {
        title: 'Ультразвук',
        html: '<p>Звук с частотой выше <strong>16 кГц</strong> человек не слышит — это ультразвук. Поле 300 кГц на пластине даёт ультразвуковые волны той же частоты.</p>'
      },
      dist: {
        title: 'Дальность',
        html: '<p>По скорости звука и времени возврата отражённого сигнала находят расстояние до объекта: <var>L</var> = <var>v</var> <var>t</var> / 2.</p>'
      },
      xdcr: {
        title: 'Преобразователь',
        html: '<p>Пьезопреобразователь работает и как излучатель, и как приёмник: посылает пачку импульсов и преобразует задержку отражённого сигнала.</p>'
      }
    };
    const usTabKeys = ['piezo', 'us', 'dist', 'xdcr'];
    const US_V = 340;
    const usFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showUsInfo = (key) => {
      const data = info[key] || info.piezo;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      usSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', usTabKeys.includes(key) && btn.dataset.info === key);
      });
      usSlide.querySelectorAll('.us-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateUsEcho = () => {
      const raw = Number(usSlide.querySelector('.us-l-range')?.value);
      const L = Number.isFinite(raw) ? Math.max(0.2, Math.min(4, raw / 100)) : 1;
      const tMs = (2 * L / US_V) * 1000;
      const xMin = 155;
      const xMax = 400;
      const x = xMin + ((L - 0.2) / (4 - 0.2)) * (xMax - xMin);
      const x0 = 122;
      const obj = usSlide.querySelector('.us-obj');
      const burst = usSlide.querySelector('.us-burst');
      const echo = usSlide.querySelector('.us-echo');
      const burstLab = usSlide.querySelector('.us-burst-lab');
      const echoLab = usSlide.querySelector('.us-echo-lab');
      const readout = usSlide.querySelector('.us-readout');
      const lVal = usSlide.querySelector('.us-l-val');
      if (obj) obj.setAttribute('transform', `translate(${x - 250},0)`);
      if (burst) burst.setAttribute('d', `M${x0} 102 L${x} 102`);
      if (echo) echo.setAttribute('d', `M${x} 120 L${x0} 120`);
      const mid = (x0 + x) / 2;
      if (burstLab) burstLab.setAttribute('x', String(mid));
      if (echoLab) echoLab.setAttribute('x', String(mid));
      if (readout) readout.textContent = `L = ${usFmt(L, 1)} м · t = ${usFmt(tMs, 1)} мс · v = 340 м/с`;
      if (lVal) lVal.textContent = `${usFmt(L, 1)} м`;
    };
    usSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showUsInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.us-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showUsInfo(block.dataset.info);
      }
    });
    usSlide.querySelector('.us-l-range')?.addEventListener('input', updateUsEcho);
    showUsInfo('piezo');
    updateUsEcho();
  }

  /* ===== Lecture 3: ultrasonic principle ===== */
  const usPrinSlide = document.querySelector('.slide-us-prin-interactive');
  if (usPrinSlide) {
    const panel = document.getElementById('usPrinPanel');
    const info = {
      pulse: {
        title: 'Импульс',
        html: '<p>Излучатель посылает пачку колебаний длительностью <var>Δt</var>. Затем пластина ещё затухает — время <var>t</var><sub>зат</sub>.</p>'
      },
      blind: {
        title: 'Слепая зона',
        html: '<p>Слепую зону образуют <var>Δt</var> и <var>t</var><sub>зат</sub>. В ней датчик не обнаруживает объекты: излучатель ещё занят своим импульсом.</p>'
      },
      echo: {
        title: 'Эхо',
        html: '<p>Отражённый сигнал приходит в момент <var>t</var><sub>1</sub>. По нему судят, есть ли объект. Рабочий диапазон — зона, где объект обнаруживается уверенно.</p>'
      },
      tau: {
        title: '2τ',
        html: '<p>Время распространения эха <var>2τ</var> — от <var>t</var><sub>0</sub> до <var>t</var><sub>1</sub>. Это путь туда и обратно. Передвигайте ползунок: слишком близко — эхо в слепой зоне.</p>'
      },
      diff: {
        title: 'Диффузный',
        html: '<p>Датчик либо измеряет время хода звука до объекта и обратно (диффузный режим), либо проверяет, принят ли посланный сигнал.</p>'
      }
    };
    const usPrinWave = (x0, len, amp, decay, y0, period) => {
      let d = '';
      for (let i = 0; i <= len; i += 1) {
        const y = y0 - amp * Math.exp(-decay * i) * Math.sin((2 * Math.PI * i) / period);
        d += (i === 0 ? 'M' : ' L') + (x0 + i) + ' ' + y.toFixed(1);
      }
      return d;
    };
    const showUsPrinInfo = (key) => {
      const data = info[key] || info.pulse;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      usPrinSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      usPrinSlide.querySelectorAll('.us-prin-hit').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateUsPrinWave = () => {
      const pulse = usPrinSlide.querySelector('.us-prin-pulse');
      const echo = usPrinSlide.querySelector('.us-prin-echo');
      const echoLab = usPrinSlide.querySelector('.us-prin-echo-lab');
      const echoHit = usPrinSlide.querySelector('.us-prin-echo-hit');
      const t1 = usPrinSlide.querySelector('.us-prin-t1');
      const tauLine = usPrinSlide.querySelector('.us-prin-tau-line');
      const tauTick = usPrinSlide.querySelector('.us-prin-tau-tick');
      const tauLab = usPrinSlide.querySelector('.us-prin-tau-lab');
      const readout = usPrinSlide.querySelector('.us-prin-readout');
      const tauVal = usPrinSlide.querySelector('.us-prin-tau-val');
      const raw = Number(usPrinSlide.querySelector('.us-prin-tau-range')?.value);
      const echoX = Number.isFinite(raw) ? Math.max(130, Math.min(430, raw)) : 340;
      const blindEnd = 168;
      const inBlind = echoX < blindEnd;
      if (pulse) pulse.setAttribute('d', usPrinWave(72, 92, 36, 0.032, 108, 10));
      if (echo) {
        echo.setAttribute('d', usPrinWave(echoX, 48, 16, 0.055, 108, 10));
        echo.setAttribute('stroke', inBlind ? '#94a3b8' : '#b91c1c');
      }
      if (echoLab) {
        echoLab.setAttribute('x', String(echoX + 24));
        echoLab.setAttribute('y', echoX < 220 ? '62' : '38');
        echoLab.setAttribute('fill', inBlind ? '#64748b' : '#b91c1c');
      }
      if (echoHit) echoHit.setAttribute('x', String(echoX));
      if (t1) t1.setAttribute('x', String(echoX));
      if (tauLine) tauLine.setAttribute('x2', String(echoX));
      if (tauTick) {
        tauTick.setAttribute('x1', String(echoX));
        tauTick.setAttribute('x2', String(echoX));
      }
      if (tauLab) tauLab.setAttribute('x', String((72 + echoX) / 2));
      if (readout) {
        readout.textContent = inBlind ? 'в слепой зоне' : 'обнаружен';
        readout.setAttribute('fill', inBlind ? '#a16207' : '#1e40af');
      }
      if (tauVal) tauVal.textContent = inBlind ? 'слепая зона' : 'рабочий';
    };
    usPrinSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showUsPrinInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.us-prin-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showUsPrinInfo(hit.dataset.info);
      }
    });
    usPrinSlide.querySelector('.us-prin-tau-range')?.addEventListener('input', updateUsPrinWave);
    showUsPrinInfo('pulse');
    updateUsPrinWave();
  }

  /* ===== Lecture 3: ultrasonic detection methods ===== */
  const usMethSlide = document.querySelector('.slide-us-meth-interactive');
  if (usMethSlide) {
    const panel = document.getElementById('usMethPanel');
    const info = {
      direct: {
        title: 'Непосредственный',
        html: '<p>Одним или двумя преобразователями контролируют пространство перед датчиком и ждут отражённую волну от объекта.</p>'
      },
      refl: {
        title: 'Рефлекторный',
        html: '<p>Контролируют пространство между датчиком и рефлектором. Датчик срабатывает, когда объект прерывает отражённый луч.</p>'
      },
      opp: {
        title: 'Оппозитный',
        html: '<p>Метод прерывания луча: излучатель и приёмник стоят на одной линии друг против друга. Объект обнаруживают, когда волна прерывается. Такие датчики часто называют <strong>барьерными</strong>.</p>'
      },
      mat: {
        title: 'Материалы',
        html: '<p>Обнаруживают твёрдые, жидкие, сыпучие и порошкообразные объекты. Цвет на обнаружение не влияет. Широко применяют в медицине для диагностики.</p>'
      },
      clear: {
        title: 'Прозрачные',
        html: '<p>Прозрачные предметы (стекло, прозрачный пластик) обнаруживаются надёжно — в этом преимущество перед оптическими датчиками.</p>'
      },
      temp: {
        title: 'Температура',
        html: '<p>Температура объекта влияет на скорость звука и тем самым на рабочий диапазон датчика.</p>'
      }
    };
    const showUsMethInfo = (key) => {
      const data = info[key] || info.direct;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      usMethSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      usMethSlide.querySelectorAll('.us-meth-view').forEach((view) => {
        view.classList.toggle('is-on', view.dataset.info === key);
      });
    };
    usMethSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showUsMethInfo(tab.dataset.info);
      }
    });
    showUsMethInfo('direct');
  }

  /* ===== Lecture 3: ultrasonic properties ===== */
  const usPropsSlide = document.querySelector('.slide-us-props-interactive');
  if (usPropsSlide) {
    const panel = document.getElementById('usPropsPanel');
    const info = {
      dust: {
        title: 'Среда',
        html: '<p><strong>Достоинство.</strong> Работают в сильно загрязнённой и запылённой среде.</p>'
      },
      range: {
        title: 'Дальность',
        html: '<p><strong>Достоинство.</strong> Большие рабочие расстояния.</p>'
      },
      ex: {
        title: 'Взрывозащита',
        html: '<p><strong>Достоинство.</strong> Есть взрывозащищённые исполнения.</p>'
      },
      mat: {
        title: 'Материалы',
        html: '<p><strong>Достоинство.</strong> Обнаруживают объекты из любого материала.</p>'
      },
      level: {
        title: 'Уровень',
        html: '<p><strong>Достоинство.</strong> Самый простой и дешёвый бесконтактный способ измерения уровня жидкости.</p>'
      },
      beam: {
        title: 'Диаграмма',
        html: '<p><strong>Недостаток.</strong> Широкая диаграмма направленности — луч расходится.</p>'
      },
      obs: {
        title: 'Помехи',
        html: '<p><strong>Недостаток.</strong> Чувствительность к случайным препятствиям на пути луча.</p>'
      },
      acc: {
        title: 'Точность',
        html: '<p><strong>Недостаток.</strong> Невысокая точность, если по эху судят о температуре, давлении и составе воздуха.</p>'
      },
      speed: {
        title: 'Быстродействие',
        html: '<p><strong>Недостаток.</strong> Низкое быстродействие.</p>'
      },
      cost: {
        title: 'Цена',
        html: '<p><strong>Недостаток.</strong> Относительно высокая стоимость.</p>'
      }
    };
    const showUsProps = (key) => {
      const data = info[key] || info.dust;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      usPropsSlide.querySelectorAll('.xfmr-prop-item').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    usPropsSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.xfmr-prop-item');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showUsProps(card.dataset.info);
    });
    showUsProps('dust');
  }

  /* ===== Lecture 3: string sensors ===== */
  const strSlide = document.querySelector('.slide-str-interactive');
  if (strSlide) {
    const panel = document.getElementById('strPanel');
    const info = {
      freq: {
        title: 'Частотный метод',
        html: '<p>Измеряемую величину (электрическую или нет) преобразуют в переменное напряжение, частота которого зависит от этой величины.</p>'
      },
      str: {
        title: 'Струна',
        html: '<p>Собственная частота <var>f</var> натянутой струны длины <var>l</var> и массы <var>m</var> зависит от силы натяжения <var>F</var>. Линейная плотность μ = <var>m</var>/<var>l</var>.</p>'
      },
      force: {
        title: 'Натяжение F',
        html: '<p>Чем больше <var>F</var>, тем выше <var>f</var>: <var>f</var> = 1/(2<var>l</var>) · √(<var>F</var>/μ).</p>'
      },
      err: {
        title: 'Погрешность',
        html: '<p>Частотный метод не вносит дополнительной погрешности при обработке сигнала.</p>'
      },
      fix: {
        title: 'Струна',
        html: '<p>Собственная частота <var>f</var> натянутой струны длины <var>l</var> и массы <var>m</var> зависит от силы натяжения <var>F</var>.</p>'
      }
    };
    const showStrInfo = (key) => {
      const data = info[key] || info.freq;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      const tabKey = key === 'fix' ? 'str' : key;
      strSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === tabKey);
      });
      strSlide.querySelectorAll('.str-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    strSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showStrInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.str-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showStrInfo(block.dataset.info);
      }
    });
    showStrInfo('freq');
  }

  /* ===== Lecture 3: string pressure sensor ===== */
  const strPSlide = document.querySelector('.slide-str-p-interactive');
  if (strPSlide) {
    const panel = document.getElementById('strPPanel');
    const info = {
      mem: {
        title: 'Мембрана',
        html: '<p>Один конец струны закреплён, другой связан с мембраной-преобразователем (4). Давление <var>P</var> меняет натяжение.</p>'
      },
      str: {
        title: 'Струна',
        html: '<p>Струна (1) колеблется с частотой <var>f</var>, которую задаёт натяжение от давления.</p>'
      },
      exc: {
        title: 'Возбудитель',
        html: '<p>Электромагнитный возбудитель (2) выводит струну из положения покоя. Частота колебаний определяется давлением <var>P</var>.</p>'
      },
      rx: {
        title: 'Приёмник',
        html: '<p>Приёмник (3) преобразует колебания струны в электрический сигнал той же частоты.</p>'
      },
      one: {
        title: 'Совмещённый',
        html: '<p>Часто один электромагнитный узел работает и как возбудитель, и как приёмник: по очереди подаёт напряжение и считывает ЭДС с той же обмотки.</p>'
      },
      mag: {
        title: 'Магнит',
        html: '<p>Струна проходит в зазоре магнита <strong>N–S</strong>. Поле возбуждает и снимает колебания.</p>'
      }
    };
    const strPFmt = (n, d) => n.toFixed(d).replace('.', ',');
    const showStrPInfo = (key) => {
      const data = info[key] || info.mem;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      strPSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      strPSlide.querySelectorAll('.str-p-block').forEach((b) => {
        b.classList.toggle('is-active', b.dataset.info === key);
      });
    };
    const updateStrPFreq = () => {
      const raw = Number(strPSlide.querySelector('.str-p-range')?.value);
      const p = Number.isFinite(raw) ? Math.max(20, Math.min(200, raw)) : 100;
      const f = 1.2 * Math.sqrt(p / 100);
      const cycles = 1.2 + (p - 20) / 180 * 2.4;
      const amp = 10 - (p - 20) / 180 * 5;
      const line = strPSlide.querySelector('.str-p-line');
      const readout = strPSlide.querySelector('.str-p-readout');
      const pVal = strPSlide.querySelector('.str-p-val');
      if (line) {
        let d = '';
        const x0 = 78;
        const x1 = 430;
        const n = 48;
        for (let i = 0; i <= n; i += 1) {
          const t = i / n;
          const x = x0 + t * (x1 - x0);
          const y = 100 + amp * Math.sin(cycles * 2 * Math.PI * t);
          d += (i === 0 ? 'M' : ' L') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        line.setAttribute('d', d);
      }
      if (readout) readout.textContent = `f = ${strPFmt(f, 2)} кГц`;
      if (pVal) pVal.textContent = `${Math.round(p)} кПа`;
    };
    strPSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showStrPInfo(tab.dataset.info);
        return;
      }
      const block = e.target.closest('.str-p-block');
      if (block?.dataset.info) {
        e.stopPropagation();
        showStrPInfo(block.dataset.info);
      }
    });
    strPSlide.querySelector('.str-p-range')?.addEventListener('input', updateStrPFreq);
    showStrPInfo('mem');
    updateStrPFreq();
  }

  /* ===== Lecture 3: string sensor modes ===== */
  const strModeSlide = document.querySelector('.slide-str-mode-interactive');
  if (strModeSlide) {
    const panel = document.getElementById('strModePanel');
    const info = {
      auto: {
        title: 'Автогенератор',
        html: '<p>В автогенераторном режиме струна колеблется постоянно.</p>'
      },
      ask: {
        title: 'По запросу',
        html: '<p>Режим работы по запросу — более лёгкие условия для струны: возбуждение не непрерывно.</p>'
      },
      mat: {
        title: 'Материал',
        html: '<p>Точность задают конструкция, материал струны и крепление. Нужны высокая прочность при вибрации и коэффициент линейного расширения как у корпуса датчика.</p>'
      },
      hz: {
        title: '50 Гц',
        html: '<p>Чтобы повысить точность и уйти от помехи промышленной частоты 50 Гц, частоту колебаний струны стремятся увеличить.</p>'
      },
      acc: {
        title: 'Погрешность',
        html: '<p>Погрешность в условиях эксплуатации не превышает <strong>0,4 %</strong>.</p>'
      },
      dyn: {
        title: 'Динамика',
        html: '<p>Малая инерционность, высокая чувствительность и надёжность.</p>'
      }
    };
    const showStrModeInfo = (key) => {
      const data = info[key] || info.auto;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      strModeSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    strModeSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showStrModeInfo(card.dataset.info);
    });
    showStrModeInfo('auto');
  }

  /* ===== Lecture 3: photoelectric sensors ===== */
  const photoSlide = document.querySelector('.slide-photo-interactive');
  if (photoSlide) {
    const panel = document.getElementById('photoPanel');
    const info = {
      refl: {
        title: 'а отражение',
        html: '<p>Источник (1) через линзу (2) освещает объект. Отражённый поток собирается второй линзой на фоторезисторе (3).</p>'
      },
      emit: {
        title: 'б излучение',
        html: '<p>Источник — сам объект: он излучает поток. Линза (2) собирает свет на фоторезисторе (3).</p>'
      },
      src: {
        title: 'Источник',
        html: '<p>Источник потока — лампа (1) или сам объект: отражает свет либо излучает его.</p>'
      },
      lens: {
        title: 'Линза',
        html: '<p>Собирающая линза (2) формирует поток на объект или на фоторезистор.</p>'
      },
      pr: {
        title: 'Фоторезистор',
        html: '<p>Приёмник (3) — фоторезистор. Фотодатчик: источник потока и приёмник.</p>'
      },
      obj: {
        title: 'Объект',
        html: '<p>Контролируемый объект отражает поток (схема а) или сам его излучает (схема б).</p>'
      },
      def: {
        title: 'Фотоэффект',
        html: '<p>Датчик реагирует на изменение освещённости. Частицы лучистой энергии передают электронам дополнительную энергию — меняется ток через фотодатчик.</p>'
      }
    };
    const photoViews = ['refl', 'emit'];
    const showPhotoInfo = (key) => {
      const data = info[key] || info.refl;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      if (photoViews.includes(key)) {
        photoSlide.querySelectorAll('.photo-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === key);
        });
      }
      photoSlide.querySelectorAll('.photo-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    photoSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPhotoInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showPhotoInfo(hit.dataset.info);
      }
    });
    showPhotoInfo('refl');
  }

  /* ===== Lecture 3: photoelectric effect types ===== */
  const photoKindSlide = document.querySelector('.slide-photo-kind-interactive');
  if (photoKindSlide) {
    const panel = document.getElementById('photoKindPanel');
    const info = {
      ext: {
        title: 'Внешний',
        html: '<p>Световой поток вызывает эмиссию электронов с катода электронной лампы. Ток эмиссии зависит от освещённости катода. Так чаще всего контролируют наличие или отсутствие луча.</p>'
      },
      int: {
        title: 'Внутренний',
        html: '<p>Электропроводность (активное сопротивление) полупроводника зависит от его освещённости.</p>'
      },
      pv: {
        title: 'Вентильный',
        html: '<p>Электроны переходят из освещённого слоя в неосвещённый через барьерный слой. Возникает ЭДС, зависящая от освещённости. Только такие элементы дают ток от света без постороннего питания.</p>'
      },
      tube: {
        title: 'Фотоэлемент',
        html: '<p>Вакуумная или газонаполненная лампа: катод — светочувствительный слой, анод — пластина или кольцо.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p>Отношение фототока (мкА) к световому потоку (лм). Световая характеристика зависит от чувствительности фотоэлемента.</p>'
      },
      lin: {
        title: 'Линейность',
        html: '<p>У вакуумных фотоэлементов характеристика линейна: <var>I</var><sub>ф</sub> = <var>K</var><sub>ф</sub> <var>Φ</var>, где <var>Φ</var> — световой поток, <var>K</var><sub>ф</sub> — коэффициент пропорциональности.</p>'
      }
    };
    const showPhotoKindInfo = (key) => {
      const data = info[key] || info.ext;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoKindSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    photoKindSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card?.dataset.info) return;
      e.stopPropagation();
      showPhotoKindInfo(card.dataset.info);
    });
    showPhotoKindInfo('ext');
  }

  /* ===== Lecture 3: external photocell lamp ===== */
  const photoLampSlide = document.querySelector('.slide-photo-lamp-interactive');
  if (photoLampSlide) {
    const panel = document.getElementById('photoLampPanel');
    const info = {
      lamp: {
        title: 'Лампа',
        html: '<p>Вакуумная лампа: катод — светочувствительный слой, анод — стержень. Свет падает на катод.</p>'
      },
      circ: {
        title: 'Схема',
        html: '<p>Фотоэлемент включают последовательно с источником питания, резистором и амперметром — так снимают фототок.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p>Семейство прямых из начала координат — линейная характеристика чувствительности вакуумного фотоэлемента.</p>'
      },
      cath: {
        title: 'Катод',
        html: '<p>Фотокатод принимает световой поток. От потока зависит фототок.</p>'
      },
      anod: {
        title: 'Анод',
        html: '<p>Анод — металлический стержень или кольцо. Напряжение на аноде задаёт точку на вольт-амперной характеристике.</p>'
      },
      batt: {
        title: 'Питание',
        html: '<p>Источник постоянного напряжения питает цепь фотоэлемента.</p>'
      },
      r: {
        title: 'R',
        html: '<p>Резистор в цепи нагрузки. Падение напряжения с него можно подать на усилитель или вход ПЛК.</p>'
      },
      a: {
        title: 'Амперметр',
        html: '<p>Измеряет фототок в микроамперах.</p>'
      }
    };
    const lampViews = ['lamp', 'circ', 'sens'];
    const showPhotoLampInfo = (key) => {
      const data = info[key] || info.lamp;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoLampSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      if (lampViews.includes(key)) {
        photoLampSlide.querySelectorAll('.photo-lamp-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === key);
        });
      } else if (key === 'cath' || key === 'anod') {
        photoLampSlide.querySelectorAll('.photo-lamp-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === 'lamp');
        });
      } else if (key === 'batt' || key === 'r' || key === 'a') {
        photoLampSlide.querySelectorAll('.photo-lamp-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === 'circ');
        });
      }
      photoLampSlide.querySelectorAll('.photo-lamp-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    photoLampSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPhotoLampInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-lamp-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showPhotoLampInfo(hit.dataset.info);
      }
    });
    showPhotoLampInfo('lamp');
  }

  /* ===== Lecture 3: photocell characteristics ===== */
  const photoCharSlide = document.querySelector('.slide-photo-char-interactive');
  if (photoCharSlide) {
    const panel = document.getElementById('photoCharPanel');
    const info = {
      vac: {
        title: 'Вакуум',
        html: '<p>Вакуумные фотоэлементы практически безынерционны, но дают меньший фототок. Кривые <strong>1, 2, 3</strong>.</p>'
      },
      gas: {
        title: 'Газ',
        html: '<p>Газонаполненные дают больший фототок, но обладают инерционностью. Кривые <strong>4, 5</strong> круче и загибаются вверх.</p>'
      },
      iv: {
        title: 'ВАХ',
        html: '<p>Вольт-амперная характеристика — зависимость фототока от напряжения на аноде.</p>'
      },
      light: {
        title: 'Световая',
        html: '<p>Световая характеристика — зависимость фототока от светового потока, падающего на фотокатод.</p>'
      },
      intg: {
        title: 'Интегральная',
        html: '<p>Интегральная чувствительность — ток, создаваемый всем спектром потока (по интенсивности).</p>'
      },
      spec: {
        title: 'Спектральная',
        html: '<p>Спектральная чувствительность — ток от светового потока одной частоты.</p>'
      },
      amp: {
        title: 'Усилитель',
        html: '<p>В схемах автоматики фотоэлементам нужны усилители с большим коэффициентом усиления, прежде чем сигнал пойдёт на вход ПЛК.</p>'
      }
    };
    const showPhotoCharInfo = (key) => {
      const data = info[key] || info.vac;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoCharSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      photoCharSlide.querySelectorAll('.photo-char-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    photoCharSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPhotoCharInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-char-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showPhotoCharInfo(hit.dataset.info);
      }
    });
    showPhotoCharInfo('vac');
  }

  /* ===== Lecture 3: internal photoeffect ===== */
  const photoIntSlide = document.querySelector('.slide-photo-int-interactive');
  if (photoIntSlide) {
    const panel = document.getElementById('photoIntPanel');
    const info = {
      circ: {
        title: 'Схема',
        html: '<p>Фотосопротивление включают последовательно с измерительным прибором и источником напряжения <var>U</var>. Чувствительность заметно выше, чем у внешнего фотоэффекта.</p>'
      },
      curve: {
        title: 'Характеристика',
        html: '<p>Зависимость <var>I</var><sub>ф</sub> от <var>Φ</var> нелинейна: при росте освещённости чувствительность падает.</p>'
      },
      grid: {
        title: 'Сетка и слой',
        html: '<p>На сетку проводников (1) нанесён светочувствительный слой (2). При освещении сопротивление падает — ток в цепи растёт.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p>Выше, чем у датчиков с внешним фотоэффектом. Чем сильнее освещение, тем меньше прирост тока.</p>'
      },
      lag: {
        title: 'Инерция',
        html: '<p>Существенная инерционность и зависимость от температуры элемента.</p>'
      }
    };
    const intViews = ['circ', 'curve'];
    const showPhotoIntInfo = (key) => {
      const data = info[key] || info.circ;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoIntSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      if (intViews.includes(key)) {
        photoIntSlide.querySelectorAll('.photo-int-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === key);
        });
      } else {
        photoIntSlide.querySelectorAll('.photo-int-view').forEach((view) => {
          view.classList.toggle('is-on', view.dataset.info === 'circ');
        });
      }
      photoIntSlide.querySelectorAll('.photo-int-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    photoIntSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPhotoIntInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-int-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showPhotoIntInfo(hit.dataset.info);
      }
    });
    showPhotoIntInfo('circ');
  }

  /* ===== Lecture 3: photovoltaic / barrier photoeffect ===== */
  const photoPvSlide = document.querySelector('.slide-photo-pv-interactive');
  if (photoPvSlide) {
    const panel = document.getElementById('photoPvPanel');
    const info = {
      pwr: {
        title: 'Суть',
        html: '<p>Свет проходит через полупрозрачный контакт (4) и доходит до границы запирающего слоя (3) и полупроводника (2).</p><p>Электроны идут через слой только в одну сторону — контакты заряжаются разноимённо, появляется ЭДС. Внешний источник питания не нужен.</p>'
      },
      c4: {
        title: 'Контакт 4',
        html: '<p>Полупрозрачный проводник одного из контактов. Через него световой поток проходит внутрь.</p>'
      },
      c3: {
        title: 'Слой 3',
        html: '<p>Запирающий слой. Электроны проходят через него только в одну сторону.</p>'
      },
      c2: {
        title: 'Полупроводник',
        html: '<p>Полупроводник (2) на границе с запирающим слоем. Сюда доходит поток.</p>'
      },
      c1: {
        title: 'Подложка',
        html: '<p>Металлическая подложка (1) — основание структуры.</p>'
      },
      e: {
        title: 'Заряд',
        html: '<p>Электроны, вышедшие из металла, идут через запирающий слой в одну сторону: полупроводник и проводник заряжаются разноимённо.</p>'
      }
    };
    const showPhotoPvInfo = (key) => {
      const data = info[key] || info.pwr;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoPvSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      photoPvSlide.querySelectorAll('.photo-pv-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    photoPvSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab?.dataset.info) {
        e.stopPropagation();
        showPhotoPvInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-pv-hit');
      if (hit?.dataset.info) {
        e.stopPropagation();
        showPhotoPvInfo(hit.dataset.info);
      }
    });
    showPhotoPvInfo('pwr');
  }

  /* ===== Lecture 3: photovoltaic light characteristic ===== */
  const photoPvCharSlide = document.querySelector('.slide-photo-pv-char-interactive');
  if (photoPvCharSlide) {
    const panel = document.getElementById('photoPvCharPanel');
    const info = {
      circ: {
        title: 'Схема',
        html: '<p>Свет падает на слои 4–1. ЭДС снимают с контактов и измеряют прибором — отдельный источник питания не нужен.</p>'
      },
      curve: {
        title: 'Характеристика',
        html: '<p>Световая характеристика: ток <var>I</var> от освещённости <var>E</var>. При малой нагрузке ближе к прямой, при большой <var>R</var><sub>н</sub> гнётся.</p>'
      },
      rh: {
        title: 'Нагрузка',
        html: '<p>Чем больше сопротивление нагрузки <var>R</var><sub>н</sub>, тем сильнее нелинейность световой характеристики.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p>С ростом освещённости чувствительность падает. Наибольшая — при малых значениях освещённости.</p>'
      }
    };
    const charViews = { circ: 'circ', curve: 'curve', rh: 'curve', sens: 'curve' };
    const showPhotoPvCharInfo = (key) => {
      const data = info[key] || info.circ;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoPvCharSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      const view = charViews[key] || 'circ';
      photoPvCharSlide.querySelectorAll('.photo-pv-char-view').forEach((el) => {
        el.classList.toggle('is-on', el.dataset.info === view);
      });
    };
    photoPvCharSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab && tab.dataset.info) {
        e.stopPropagation();
        showPhotoPvCharInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.photo-pv-char-hit');
      if (hit && hit.dataset.info) {
        e.stopPropagation();
        showPhotoPvCharInfo(hit.dataset.info);
      }
    });
    showPhotoPvCharInfo('circ');
  }

  /* ===== Lecture 3: photoresistor drawbacks ===== */
  const photoResSlide = document.querySelector('.slide-photo-res-interactive');
  if (photoResSlide) {
    const panel = document.getElementById('photoResPanel');
    const info = {
      u: {
        title: 'По напряжению',
        html: '<p>Низкая чувствительность по напряжению: для входа ПЛК почти всегда нужен усилитель.</p>'
      },
      nl: {
        title: 'Нелинейность',
        html: '<p>Характеристика нелинейна: при росте освещённости прирост тока всё меньше.</p>'
      },
      lag: {
        title: 'Инерция',
        html: '<p>Инерционность: ток отстаёт от изменения светового потока. Для быстрых процессов это ошибка.</p>'
      },
      t: {
        title: 'Температура',
        html: '<p>Параметры зависят от температуры элемента — нужна стабилизация или компенсация.</p>'
      },
      load: {
        title: 'Нагрузка',
        html: '<p>Нужно включать на низкоомную нагрузку, иначе характеристика ещё сильнее искажается.</p>'
      }
    };
    const showPhotoResInfo = (key) => {
      const data = info[key] || info.u;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      photoResSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    photoResSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card || !card.dataset.info) return;
      e.stopPropagation();
      showPhotoResInfo(card.dataset.info);
    });
    showPhotoResInfo('u');
  }

  /* ===== Lecture 3: encoders overview ===== */
  const encSlide = document.querySelector('.slide-enc-interactive');
  if (encSlide) {
    const panel = document.getElementById('encPanel');
    const info = {
      inc: {
        title: 'Инкрементальный',
        html: '<p>Последовательный импульсный код: угол — число импульсов от старта, скорость — импульсы за время. Если вал стоит, импульсы прекращаются.</p>'
      },
      abs: {
        title: 'Абсолютный',
        html: '<p>Каждому положению — свой цифровой код. После выключения питания угол известен сразу, без возврата в «дом». Счётчик импульсов не нужен, сигнал помехоустойчив.</p>'
      },
      quad: {
        title: 'Два канала',
        html: '<p>Два выхода с одинаковой последовательностью импульсов, сдвинутых на 90°. По фазе видно направление вращения.</p>'
      },
      zero: {
        title: 'Нулевая метка',
        html: '<p>Отдельный импульс за оборот. По нему инкрементальный энкодер находит абсолютное положение вала после старта.</p>'
      },
      opt: {
        title: 'Оптический',
        html: '<p>По принципу действия: оптические, магнитные и магниторезистивные. Оптические разбираем отдельно.</p>'
      },
      mag: {
        title: 'Магнитный',
        html: '<p>Магнитный: вал с полюсами N/S и датчик Холла. Магниторезистивный: катушка в поле — ЭДС зависит от угла. Разбираем на следующих слайдах.</p>'
      }
    };
    const showEncInfo = (key) => {
      const data = info[key] || info.inc;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      encSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    encSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card || !card.dataset.info) return;
      e.stopPropagation();
      showEncInfo(card.dataset.info);
    });
    showEncInfo('inc');
  }

  /* ===== Lecture 3: optical encoder ===== */
  const encOptSlide = document.querySelector('.slide-enc-opt-interactive');
  if (encOptSlide) {
    const panel = document.getElementById('encOptPanel');
    const fig = document.getElementById('encOptFig');
    const figDisk = `<svg class="enc-opt-svg" viewBox="0 0 520 232" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Схема оптического энкодера">
<rect width="520" height="232" fill="#fafafa"/>
<g class="enc-opt-hit" data-info="shaft" style="cursor:pointer">
<rect x="18" y="93" width="132" height="14" rx="7" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
<rect x="370" y="93" width="132" height="14" rx="7" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
<text x="496" y="82" text-anchor="end" font-size="14" font-weight="700" fill="#334155">вал</text>
</g>
<g class="enc-opt-hit" data-info="disk" style="cursor:pointer">
<ellipse cx="260" cy="100" rx="110" ry="68" fill="#f8fafc" stroke="#1e293b" stroke-width="1.8"/>
<ellipse cx="260" cy="100" rx="88" ry="52" fill="none" stroke="#94a3b8" stroke-width="1.1"/>
<g class="enc-anim-spin-ell" stroke="#1e293b" stroke-width="5" stroke-linecap="butt">
<line x1="260" y1="32" x2="260" y2="46"/>
<line x1="328" y1="50" x2="316" y2="58"/>
<line x1="364" y1="88" x2="348" y2="92"/>
<line x1="340" y1="144" x2="328" y2="136"/>
<line x1="260" y1="168" x2="260" y2="154"/>
<line x1="192" y1="150" x2="204" y2="142"/>
<line x1="156" y1="112" x2="172" y2="108"/>
<line x1="180" y1="56" x2="192" y2="64"/>
</g>
<circle cx="260" cy="100" r="10" fill="#94a3b8" stroke="#334155" stroke-width="1.4"/>
<text x="128" y="72" text-anchor="end" font-size="15" font-weight="700" fill="#1e40af">диск</text>
</g>
<g class="enc-opt-hit" data-info="det" style="cursor:pointer">
<rect x="246" y="8" width="28" height="16" rx="2" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
<line x1="274" y1="12" x2="392" y2="12" stroke="#1e40af" stroke-width="1.3"/>
<line x1="274" y1="16" x2="392" y2="16" stroke="#1e40af" stroke-width="1.3"/>
<line x1="274" y1="20" x2="392" y2="20" stroke="#1e40af" stroke-width="1.3"/>
<text x="400" y="20" font-size="14" font-weight="700" fill="#1e40af">фотодетектор</text>
</g>
<g class="enc-opt-hit" data-info="led" style="cursor:pointer">
<circle cx="260" cy="190" r="10" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
<path d="M252 178 L260 168 L268 178" fill="none" stroke="#d97706" stroke-width="1.6"/>
<text x="278" y="194" font-size="14" font-weight="700" fill="#b45309">светодиод</text>
</g>
<text x="260" y="222" text-anchor="middle" font-size="14" fill="#475569">свет через шкалу → импульсы на фотодетекторе</text>
</svg>`;
    const figWave = `<svg class="enc-opt-svg enc-opt-wave-anim" viewBox="0 0 520 248" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Анимация формирования меандра">
<rect width="520" height="248" fill="#fafafa"/>
<text x="136" y="20" font-size="13" font-weight="700" fill="#1e40af">диск крутится → свет прерывается → меандр</text>
<!-- rotating disk (side schematic) -->
<g transform="translate(110 112)">
  <circle r="62" fill="#f1f5f9" stroke="#1e293b" stroke-width="1.6"/>
  <g class="enc-anim-spin" transform-origin="0 0">
    <g stroke="#1e293b" stroke-width="7" stroke-linecap="butt">
      <line x1="0" y1="-62" x2="0" y2="-38"/>
      <line x1="44" y1="-44" x2="27" y2="-27" transform="rotate(0)"/>
      <line transform="rotate(45)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(90)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(135)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(180)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(225)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(270)" x1="0" y1="-62" x2="0" y2="-38"/>
      <line transform="rotate(315)" x1="0" y1="-62" x2="0" y2="-38"/>
    </g>
  </g>
  <circle r="14" fill="#94a3b8" stroke="#334155" stroke-width="1.3"/>
  <text x="-78" y="5" text-anchor="middle" font-size="12" fill="#475569">диск</text>
</g>
<!-- LED + beam + detector -->
<g class="enc-anim-led">
  <circle cx="110" cy="204" r="10" fill="#fde68a" stroke="#b45309" stroke-width="1.5"/>
  <text x="126" y="208" font-size="11" fill="#b45309">LED</text>
</g>
<g class="enc-anim-beam">
  <path d="M110 194 L110 174" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
  <path d="M110 50 L110 30" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
</g>
<rect x="96" y="10" width="28" height="16" rx="2" fill="#dbeafe" stroke="#1e40af" stroke-width="1.4"/>
<text x="110" y="22" text-anchor="middle" font-size="10" fill="#1e40af">фото</text>
<!-- waveforms -->
<defs>
  <clipPath id="encWaveClipSine"><rect x="252" y="50" width="242" height="50"/></clipPath>
  <clipPath id="encWaveClipMeander"><rect x="252" y="136" width="242" height="50"/></clipPath>
</defs>
<text x="250" y="42" font-size="12" font-weight="700" fill="#b45309">квазисинус</text>
<rect x="248" y="48" width="250" height="54" rx="6" fill="#fff" stroke="#e2e8f0"/>
<line x1="260" y1="75" x2="486" y2="75" stroke="#cbd5e1" stroke-dasharray="4 3"/>
<g clip-path="url(#encWaveClipSine)">
  <path class="enc-anim-sine" d="M0 27 C12 -8 28 -8 40 27 S68 62 80 27 S108 -8 120 27 S148 62 160 27 S188 -8 200 27 S228 62 240 27 S268 -8 280 27" fill="none" stroke="#b45309" stroke-width="2.2"/>
</g>
<text x="250" y="128" font-size="12" font-weight="700" fill="#1e40af">меандр</text>
<rect x="248" y="134" width="250" height="54" rx="6" fill="#fff" stroke="#e2e8f0"/>
<g clip-path="url(#encWaveClipMeander)">
  <path class="enc-anim-meander" d="M0 42 H20 V12 H60 V42 H100 V12 H140 V42 H180 V12 H220 V42 H260 V12 H300" fill="none" stroke="#1e40af" stroke-width="2.4"/>
</g>
<!-- counter -->
<rect x="248" y="200" width="250" height="36" rx="6" fill="#eff6ff" stroke="#93c5fd"/>
<text x="280" y="222" font-size="13" fill="#334155">счётчик N =</text>
<text class="enc-anim-count" x="390" y="224" font-size="18" font-weight="700" fill="#1e40af">0</text>
<text x="430" y="222" font-size="12" fill="#64748b">импульсов</text>
</svg>`;
    const info = {
      disk: {
        title: 'Диск',
        html: '<p>На вал посажен оптический диск со шкалой (прорези / штрихи). Он вращается перед неподвижной маской и периодически перекрывает свет.</p><p>Число прорезей за оборот задаёт разрешение: чем гуще шкала, тем мельче шаг угла.</p>',
        fig: figDisk
      },
      led: {
        title: 'Светодиод',
        html: '<p>Светоизлучающий диод стоит с одной стороны диска и светит через прорези шкалы.</p><p>Свет должен быть стабильным: иначе «плывут» амплитуда и порог срабатывания формирователя.</p>',
        fig: figDisk
      },
      det: {
        title: 'Фотодетектор',
        html: '<p>С другой стороны диска фотодетектор принимает свет. На выходе — не идеальный прямоугольник, а <strong>квазисинусоидальные</strong> импульсы: края прорезей и дифракция сглаживают фронты.</p><p>Такой сигнал плохо считать напрямую: около порога шум даёт ложные переключения.</p>',
        fig: figDisk
      },
      wave: {
        title: 'Меандр',
        html: '<p><strong>Меандр</strong> — прямоугольный «высокий / низкий» с чёткими фронтами.</p><p>Смотрите анимацию слева: диск крутится → луч мигает → квазисинус → после формирователя меандр → счётчик считает фронты.</p><ul><li>гистерезис глушит дребезг около порога;</li><li>угол ≈ <var>N</var> · 360° / CPR;</li><li>скорость — частота импульсов.</li></ul>',
        fig: figWave
      },
      shaft: {
        title: 'Вал',
        html: '<p>Диск жёстко связан с валом объекта. Поворот вала = поворот шкалы относительно маски и фотодетектора.</p><p>Любой люфт крепления сразу даёт ошибку угла — диск и вал должны быть соосны.</p>',
        fig: figDisk
      }
    };
    let encCountTimer = null;
    const showEncOptInfo = (key) => {
      const data = info[key] || info.disk;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (fig) fig.innerHTML = data.fig;
      encOptSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      encOptSlide.querySelectorAll('.enc-opt-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
      if (encCountTimer) {
        clearInterval(encCountTimer);
        encCountTimer = null;
      }
      if (key === 'wave') {
        const countEl = fig?.querySelector('.enc-anim-count');
        let n = 0;
        encCountTimer = setInterval(() => {
          n = (n + 1) % 64;
          if (countEl) countEl.textContent = String(n);
        }, 500);
      }
    };
    encOptSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab && tab.dataset.info) {
        e.stopPropagation();
        showEncOptInfo(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.enc-opt-hit');
      if (hit && hit.dataset.info) {
        e.stopPropagation();
        showEncOptInfo(hit.dataset.info);
      }
    });
    showEncOptInfo('disk');
  }

  /* ===== Lecture 3: optical encoder kinds ===== */
  const encKindSlide = document.querySelector('.slide-enc-kind-interactive');
  if (encKindSlide) {
    const panel = document.getElementById('encKindPanel');
    const fig = document.getElementById('encKindFig');
    const figSingle = `<svg class="enc-kind-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Одиночный энкодер">
<rect width="320" height="180" fill="#fafafa"/>
<circle cx="160" cy="84" r="68" fill="#0f172a"/>
<g transform="translate(160 84)" fill="#f8fafc">
<path d="M0 0 L0 -68 A68 68 0 0 1 48.1 -48.1 Z"/>
<path d="M0 0 L68 0 A68 68 0 0 1 48.1 48.1 Z"/>
<path d="M0 0 L0 68 A68 68 0 0 1 -48.1 48.1 Z"/>
<path d="M0 0 L-68 0 A68 68 0 0 1 -48.1 -48.1 Z"/>
</g>
<circle cx="160" cy="84" r="22" fill="#334155"/><circle cx="160" cy="84" r="8" fill="#94a3b8"/>
<text x="160" y="170" text-anchor="middle" font-size="13" fill="#475569">одно кольцо прорезей — один канал</text>
</svg>`;
    const figQuad = `<svg class="enc-kind-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Квадратурный энкодер">
<rect width="320" height="180" fill="#fafafa"/>
<circle cx="160" cy="84" r="70" fill="#0f172a"/>
<g transform="translate(160 84)">
<g fill="#f8fafc">
<path d="M0 0 L0 -70 A70 70 0 0 1 49.5 -49.5 Z"/>
<path d="M0 0 L70 0 A70 70 0 0 1 49.5 49.5 Z"/>
<path d="M0 0 L0 70 A70 70 0 0 1 -49.5 49.5 Z"/>
<path d="M0 0 L-70 0 A70 70 0 0 1 -49.5 -49.5 Z"/>
</g>
<circle r="48" fill="#0f172a"/>
<g fill="#f8fafc" transform="rotate(22.5)">
<path d="M0 0 L0 -48 A48 48 0 0 1 33.9 -33.9 Z"/>
<path d="M0 0 L48 0 A48 48 0 0 1 33.9 33.9 Z"/>
<path d="M0 0 L0 48 A48 48 0 0 1 -33.9 33.9 Z"/>
<path d="M0 0 L-48 0 A48 48 0 0 1 -33.9 -33.9 Z"/>
</g>
<circle r="22" fill="#334155"/><circle r="8" fill="#94a3b8"/>
</g>
<text x="160" y="170" text-anchor="middle" font-size="13" fill="#475569">два кольца со сдвигом 90° — каналы A и B</text>
</svg>`;
    const ringSeg = (r0, r1, a0, a1, fill) => {
      const rad = (d) => (d - 90) * Math.PI / 180;
      const x0 = Math.cos(rad(a0)) * r1, y0 = Math.sin(rad(a0)) * r1;
      const x1 = Math.cos(rad(a1)) * r1, y1 = Math.sin(rad(a1)) * r1;
      const x2 = Math.cos(rad(a1)) * r0, y2 = Math.sin(rad(a1)) * r0;
      const x3 = Math.cos(rad(a0)) * r0, y3 = Math.sin(rad(a0)) * r0;
      const large = (a1 - a0) > 180 ? 1 : 0;
      return `<path d="M${x0.toFixed(2)} ${y0.toFixed(2)} A${r1} ${r1} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} A${r0} ${r0} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z" fill="${fill}"/>`;
    };
    const absDiskTracks = (codes, label, accent, extras) => {
      /* codes[i] — 3 бита MSB..LSB; наружу рисуем LSB (частое кольцо) */
      let segs = '';
      for (let bit = 0; bit < 3; bit++) {
        const r1 = 72 - bit * 18;
        const r0 = r1 - 16;
        for (let i = 0; i < 8; i++) {
          const on = codes[i][2 - bit] === '1';
          segs += ringSeg(r0, r1, i * 45, (i + 1) * 45, on ? '#f8fafc' : '#0f172a');
        }
      }
      return `<g transform="translate(118 112)">
  <g class="enc-abs-rotor">
    <circle r="74" fill="#0f172a"/>
    ${segs}
    <circle r="18" fill="#334155"/><circle r="7" fill="#94a3b8"/>
  </g>
  <line x1="0" y1="-88" x2="0" y2="-20" stroke="${accent}" stroke-width="2.2" stroke-dasharray="4 3"/>
  <text x="12" y="-70" font-size="11" font-weight="700" fill="${accent}">считывание</text>
  ${extras || ''}
  <text x="0" y="98" text-anchor="middle" font-size="11" fill="#64748b">${label}</text>
</g>`;
    };
    const binCodes = ['000', '001', '010', '011', '100', '101', '110', '111'];
    const grayCodes = ['000', '001', '011', '010', '110', '111', '101', '100'];
    const figBin = `<svg class="enc-kind-svg enc-bin-anim" viewBox="0 0 440 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Двоичный код: проблема границы">
<rect width="440" height="210" fill="#fafafa"/>
${absDiskTracks(binCodes, 'двоичный код на диске', '#dc2626', `
  <text x="-22" y="-80" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">7</text>
  <text x="22" y="-80" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">0</text>
  <circle class="enc-bin-s0" cx="0" cy="-64" r="5" fill="#f8fafc" stroke="#b91c1c" stroke-width="1.4"/>
  <circle class="enc-bin-s1" cx="0" cy="-46" r="5" fill="#f8fafc" stroke="#b91c1c" stroke-width="1.4"/>
  <circle class="enc-bin-s2" cx="0" cy="-28" r="5" fill="#f8fafc" stroke="#b91c1c" stroke-width="1.4"/>
`)}
<rect x="236" y="36" width="188" height="150" rx="8" fill="#fef2f2" stroke="#fca5a5" stroke-width="1.4"/>
<text x="330" y="54" text-anchor="middle" font-size="13" font-weight="700" fill="#b91c1c">граница 7 | 0</text>
<text x="330" y="76" text-anchor="middle" font-size="13" font-weight="700" fill="#991b1b">двоичный 111 → 000</text>
<text x="330" y="96" text-anchor="middle" font-size="12" fill="#7f1d1d">кольца переключаются не вместе</text>
<text class="enc-bin-note" x="330" y="122" text-anchor="middle" font-size="12" fill="#7f1d1d">ещё сектор 7</text>
<text x="330" y="146" text-anchor="middle" font-size="12" fill="#64748b">считанный код</text>
<text class="enc-bin-garbage" x="330" y="172" text-anchor="middle" font-size="20" font-weight="700" fill="#64748b">111</text>
</svg>`;
    const figGray = `<svg class="enc-kind-svg enc-gray-anim" viewBox="0 0 440 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Анимация кода Грея">
<rect width="440" height="210" fill="#fafafa"/>
${absDiskTracks(grayCodes, 'код Грея на диске', '#1e40af')}
<rect x="236" y="36" width="188" height="150" rx="8" fill="#eff6ff" stroke="#93c5fd" stroke-width="1.4"/>
<text x="330" y="56" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">сектор</text>
<text class="enc-gray-step" x="330" y="80" text-anchor="middle" font-size="16" font-weight="700" fill="#1e40af">0 → 1</text>
<text x="330" y="102" text-anchor="middle" font-size="11" fill="#64748b">код Грея (не двоичный номер)</text>
<text class="enc-gray-bits" x="330" y="124" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">000 → 001</text>
<text class="enc-gray-note" x="330" y="148" text-anchor="middle" font-size="13" fill="#047857">внутреннее кольцо</text>
<text x="330" y="172" text-anchor="middle" font-size="11" fill="#64748b">мусора на границе нет</text>
</svg>`;
    const graySteps = [
      { from: 0, to: 1, g0: '000', g1: '001', note: 'наружное кольцо' },
      { from: 1, to: 2, g0: '001', g1: '011', note: 'среднее кольцо' },
      { from: 2, to: 3, g0: '011', g1: '010', note: 'наружное кольцо' },
      { from: 3, to: 4, g0: '010', g1: '110', note: 'внутреннее кольцо' },
      { from: 4, to: 5, g0: '110', g1: '111', note: 'наружное кольцо' },
      { from: 5, to: 6, g0: '111', g1: '101', note: 'среднее кольцо' },
      { from: 6, to: 7, g0: '101', g1: '100', note: 'наружное кольцо' },
      { from: 7, to: 0, g0: '100', g1: '000', note: 'внутреннее кольцо' }
    ];
    const binReads = [
      { code: '111', ok: true, note: 'ещё сектор 7' },
      { code: '110', ok: false, note: 'наружное уже 0 — мусор' },
      { code: '100', ok: false, note: 'среднее тоже 0 — мусор' },
      { code: '000', ok: true, note: 'все три — сектор 0' },
      { code: '111', ok: true, note: 'снова сектор 7' },
      { code: '011', ok: false, note: 'внутреннее уже 0 — мусор' },
      { code: '001', ok: false, note: 'два кольца уже 0 — мусор' },
      { code: '000', ok: true, note: 'все три — сектор 0' }
    ];
    const hintEl = document.getElementById('encKindHint');
    const info = {
      single: {
        title: 'Одиночный',
        hint: 'Одно кольцо — импульсы без направления',
        html: '<p>Диск с равномерными радиальными прорезями, один канал. Угол — число импульсов меандра от старта.</p><p>Дёшево и просто, но: старт неизвестен, направление не видно, на границах прорезей возможны ложные срабатывания.</p>',
        fig: figSingle
      },
      quad: {
        title: 'Квадратурный',
        hint: 'Два кольца со сдвигом 90° — каналы A и B',
        html: '<p>Два кольца шкалы со сдвигом ≈ 90° → каналы <strong>A</strong> и <strong>B</strong> (квадратура). По фазе видно направление; ложных срабатываний на границах меньше (можно считать по 4 фронтам за период).</p><p>Стартовое положение вала по-прежнему неизвестно — нужен репер (Z) или абсолютный энкодер.</p>',
        fig: figQuad
      },
      bin: {
        title: 'Двоичный',
        hint: 'Граница 7|0: кольца переключаются не вместе',
        html: '<p>Три концентрические дорожки = три бита. На схеме: граница <strong>7→0</strong>, двоичный код <strong>111→000</strong> — меняются все три кольца сразу.</p><p>Фотоприёмники не переключаются синхронно → на миг читается <em>мусор</em> (110, 101…). Абсолютный отсчёт ломается.</p>',
        fig: figBin
      },
      gray: {
        title: 'Код Грея',
        hint: 'За шаг меняется одно кольцо — мусора нет',
        html: '<p>Те же 3 дорожки, но размечены <strong>кодом Грея</strong>: соседние сектора отличаются ровно одним кольцом.</p><p>Числа <strong>110</strong> и <strong>111</strong> — это код на диске, не двоичный номер сектора. На границе ошибка максимум ±1 шаг, мусорного кода нет.</p>',
        fig: figGray
      }
    };
    let grayTimer = null;
    let binTimer = null;
    const showEncKindInfo = (key) => {
      const data = info[key] || info.single;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (hintEl) hintEl.textContent = data.hint;
      if (fig) fig.innerHTML = data.fig;
      encKindSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      if (grayTimer) {
        clearInterval(grayTimer);
        grayTimer = null;
      }
      if (binTimer) {
        clearInterval(binTimer);
        binTimer = null;
      }
      if (key === 'bin') {
        let i = 0;
        const paintBin = () => {
          const step = binReads[i];
          const gEl = fig.querySelector('.enc-bin-garbage');
          const nEl = fig.querySelector('.enc-bin-note');
          if (gEl) {
            gEl.textContent = step.code;
            gEl.setAttribute('fill', step.ok ? '#64748b' : '#dc2626');
          }
          if (nEl) nEl.textContent = step.note;
          const dots = [
            fig.querySelector('.enc-bin-s0'),
            fig.querySelector('.enc-bin-s1'),
            fig.querySelector('.enc-bin-s2')
          ];
          dots.forEach((dot, bit) => {
            if (!dot) return;
            const on = step.code[2 - bit] === '1';
            dot.setAttribute('fill', on ? '#f8fafc' : '#0f172a');
          });
          i = (i + 1) % binReads.length;
        };
        paintBin();
        binTimer = setInterval(paintBin, 800);
      }
      if (key === 'gray') {
        let i = 0;
        const paint = () => {
          const step = graySteps[i];
          const stepEl = fig.querySelector('.enc-gray-step');
          const bitsEl = fig.querySelector('.enc-gray-bits');
          const noteEl = fig.querySelector('.enc-gray-note');
          const rotor = fig.querySelector('.enc-abs-rotor');
          if (stepEl) stepEl.textContent = `${step.from} → ${step.to}`;
          if (bitsEl) bitsEl.textContent = `${step.g0} → ${step.g1}`;
          if (noteEl) noteEl.textContent = step.note;
          if (rotor) rotor.style.transform = `rotate(${-step.to * 45}deg)`;
          i = (i + 1) % graySteps.length;
        };
        paint();
        grayTimer = setInterval(paint, 1100);
      }
    };
    encKindSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card || !card.dataset.info) return;
      e.stopPropagation();
      showEncKindInfo(card.dataset.info);
    });
    showEncKindInfo('single');
  }

  /* ===== Lecture 3: magnetic / magnetoresistive encoders ===== */
  const encMagSlide = document.querySelector('.slide-enc-mag-interactive');
  if (encMagSlide) {
    const panel = document.getElementById('encMagPanel');
    const fig = document.getElementById('encMagFig');
    const figMag = `<svg class="enc-mag-svg" viewBox="0 0 480 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Магнитный энкодер">
<rect width="480" height="210" fill="#fafafa"/>
<rect x="40" y="92" width="200" height="18" rx="6" fill="#cbd5e1" stroke="#334155" stroke-width="1.4"/>
<text x="140" y="84" text-anchor="middle" font-size="13" fill="#475569">вал</text>
<g class="enc-mag-rotor" transform="translate(280 110)">
  <circle r="58" fill="#f8fafc" stroke="#1e293b" stroke-width="1.6"/>
  <path d="M0 -58 L12 -12 L-12 -12 Z" fill="#ef4444"/>
  <path d="M0 58 L12 12 L-12 12 Z" fill="#ef4444"/>
  <path d="M58 0 L12 12 L12 -12 Z" fill="#3b82f6"/>
  <path d="M-58 0 L-12 12 L-12 -12 Z" fill="#3b82f6"/>
  <text x="0" y="-36" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">N</text>
  <text x="0" y="42" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">N</text>
  <text x="38" y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">S</text>
  <text x="-38" y="5" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">S</text>
  <circle r="10" fill="#94a3b8" stroke="#334155"/>
</g>
<path d="M280 52 A58 58 0 0 1 330 80" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#encMagArr)"/>
<defs><marker id="encMagArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#64748b"/></marker></defs>
<rect x="360" y="88" width="88" height="44" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.5"/>
<text x="404" y="108" text-anchor="middle" font-size="12" font-weight="700" fill="#1e40af">Холл</text>
<text x="404" y="124" text-anchor="middle" font-size="11" fill="#475569">датчик</text>
<text x="240" y="198" text-anchor="middle" font-size="12" fill="#64748b">полюса проходят мимо сенсора → скорость и направление</text>
</svg>`;
    const figMr = `<svg class="enc-mag-svg" viewBox="0 0 480 210" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Магниторезистивный энкодер">
<rect width="480" height="210" fill="#fafafa"/>
<path d="M80 50 L80 170 L140 170 L140 130 L200 130 L200 170 L260 170 L260 50 L200 50 L200 90 L140 90 L140 50 Z" fill="none" stroke="#1e293b" stroke-width="2.2"/>
<text x="70" y="115" text-anchor="end" font-size="16" font-weight="700" fill="#ef4444">N</text>
<text x="270" y="115" font-size="16" font-weight="700" fill="#3b82f6">S</text>
<line x1="170" y1="40" x2="170" y2="180" stroke="#94a3b8" stroke-width="3"/>
<g stroke="#b45309" stroke-width="1.8" fill="none">
  <ellipse cx="170" cy="100" rx="28" ry="10"/>
  <ellipse cx="170" cy="112" rx="28" ry="10"/>
  <ellipse cx="170" cy="124" rx="28" ry="10"/>
</g>
<text x="170" y="198" text-anchor="middle" font-size="12" fill="#475569">катушка на валу в поле магнита</text>
<rect x="300" y="70" width="150" height="90" rx="8" fill="#fff" stroke="#cbd5e1"/>
<text x="375" y="100" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">угол → ЭДС</text>
<text x="375" y="124" text-anchor="middle" font-size="12" fill="#64748b">витки режут</text>
<text x="375" y="142" text-anchor="middle" font-size="12" fill="#64748b">линии поля →</text>
<text x="375" y="160" text-anchor="middle" font-size="12" fill="#64748b">ток зависит от φ</text>
</svg>`;
    const info = {
      mag: {
        title: 'Магнитный энкодер',
        html: '<p>На валу — магнит с чередующимися полюсами <strong>N/S</strong>, рядом — датчик Холла.</p><p>При вращении полюса проходят мимо сенсора: считают скорость и направление вращения. Конструкции без оптики — устойчивее к пыли и маслу.</p>',
        fig: figMag
      },
      mr: {
        title: 'Магниторезистивный',
        html: '<p>Катушка закреплена на валу и находится в магнитном поле.</p><p>При повороте меняется ориентация витков относительно линий поля → меняются наводимая ЭДС и ток в зависимости от угла.</p>',
        fig: figMr
      }
    };
    const show = (key) => {
      const data = info[key] || info.mag;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (fig) fig.innerHTML = data.fig;
      encMagSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    encMagSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (!tab || !tab.dataset.info) return;
      e.stopPropagation();
      show(tab.dataset.info);
    });
    show('mag');
  }

  /* ===== Lecture 3: encoder selection ===== */
  const encChooseSlide = document.querySelector('.slide-enc-choose-interactive');
  if (encChooseSlide) {
    const panel = document.getElementById('encChoosePanel');
    const info = {
      ppr: {
        title: 'Импульсы / биты',
        html: '<p>Число импульсов за оборот (инкрементальный) или число бит (абсолютный).</p><p>Чем больше — тем выше потенциальная точность угла в системе.</p>'
      },
      out: {
        title: 'Выходной сигнал',
        html: '<p>Тип кода и интерфейса: двоичный, <strong>код Грея</strong>, меандр A/B/Z, SSI, BiSS…</p><p>От этого зависит, как читать энкодер в ПЛК и как передавать данные дальше.</p>'
      },
      u: {
        title: 'Питание',
        html: '<p>Напряжение питания влияет на работу электроники и на точность сигнала (особенно у аналоговых и магнитных схем).</p>'
      },
      cable: {
        title: 'Кабель / разъём',
        html: '<p>Длина кабеля и тип разъёма ограничивают монтаж: экранирование, падение напряжения, удобство замены на станке.</p>'
      },
      mount: {
        title: 'Крепление',
        html: '<p>Конструкция и требования к монтажу. Люфт и перекос вала сразу бьют по точности всей системы.</p>'
      },
      ip: {
        title: 'Степень защиты IP',
        html: '<p>Защита от пыли и влаги. Для «грязных» зон часто выбирают магнитный энкодер вместо оптического.</p>'
      }
    };
    const show = (key) => {
      const data = info[key] || info.ppr;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      encChooseSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    encChooseSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card || !card.dataset.info) return;
      e.stopPropagation();
      show(card.dataset.info);
    });
    show('ppr');
  }

  /* ===== Lecture 3: Hall sensor ===== */
  const hallSlide = document.querySelector('.slide-hall-interactive');
  if (hallSlide) {
    const panel = document.getElementById('hallPanel');
    const fig = document.getElementById('hallFig');
    const figHall = `<svg class="hall-svg" viewBox="0 0 480 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Датчик Холла">
<rect width="480" height="200" fill="#fafafa"/>
<!-- plate -->
<g class="hall-hit" data-info="plate" style="cursor:pointer">
  <path d="M140 70 L300 55 L320 130 L160 145 Z" fill="#e2e8f0" stroke="#1e293b" stroke-width="1.7"/>
  <text x="230" y="105" text-anchor="middle" font-size="13" fill="#334155">пластина</text>
</g>
<!-- I contacts -->
<g class="hall-hit" data-info="i" style="cursor:pointer">
  <rect x="118" y="95" width="28" height="22" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.4"/>
  <rect x="312" y="78" width="28" height="22" rx="3" fill="#fde68a" stroke="#b45309" stroke-width="1.4"/>
  <text x="100" y="112" text-anchor="end" font-size="14" font-weight="700" fill="#b45309">1</text>
  <text x="352" y="94" font-size="14" font-weight="700" fill="#b45309">2</text>
  <path d="M146 106 H200" stroke="#b45309" stroke-width="2" marker-end="url(#hallI)"/>
  <defs><marker id="hallI" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#b45309"/></marker></defs>
  <text x="175" y="98" font-size="14" font-style="italic" font-weight="700" fill="#b45309">I</text>
</g>
<!-- H field -->
<g class="hall-hit" data-info="h" style="cursor:pointer">
  <path d="M220 30 V55 M240 28 V52 M260 30 V54" stroke="#7c3aed" stroke-width="2" marker-end="url(#hallH)"/>
  <defs><marker id="hallH" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto"><path d="M0 0 L3 6 L6 0 Z" fill="#7c3aed"/></marker></defs>
  <text x="240" y="22" text-anchor="middle" font-size="14" font-style="italic" font-weight="700" fill="#7c3aed">H</text>
</g>
<!-- E contacts -->
<g class="hall-hit" data-info="e" style="cursor:pointer">
  <rect x="200" y="48" width="24" height="16" rx="2" fill="#dbeafe" stroke="#1e40af" stroke-width="1.4"/>
  <rect x="210" y="138" width="24" height="16" rx="2" fill="#dbeafe" stroke="#1e40af" stroke-width="1.4"/>
  <text x="190" y="60" text-anchor="end" font-size="14" font-weight="700" fill="#1e40af">3</text>
  <text x="248" y="152" font-size="14" font-weight="700" fill="#1e40af">4</text>
  <text x="280" y="175" text-anchor="middle" font-size="14" font-style="italic" font-weight="700" fill="#1e40af">E</text>
  <path d="M222 64 V138" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="4 3"/>
</g>
<text x="400" y="100" text-anchor="middle" font-size="15" font-weight="700" fill="#1e40af">E = K·I·H</text>
<text x="400" y="122" text-anchor="middle" font-size="12" fill="#64748b">K — материал</text>
<text x="400" y="140" text-anchor="middle" font-size="12" fill="#64748b">и толщина d</text>
</svg>`;
    const info = {
      plate: {
        title: 'Пластина',
        html: '<p>Полупроводниковая пластина с четырьмя электродами (рис. 2.29). Рабочая зона ограничена концами электродов; геометрией подстраивают под задачу.</p><p>По сути это <strong>датчик магнитного поля</strong>.</p>',
        fig: figHall
      },
      i: {
        title: 'Ток I',
        html: '<p>Через контакты <strong>1–2</strong> по пластине течёт ток <var>I</var>. Без тока ЭДС Холла не появится.</p>',
        fig: figHall
      },
      h: {
        title: 'Поле H',
        html: '<p>Перпендикулярно пластине действует магнитное поле напряжённостью <var>H</var> (индукцией <var>B</var>). Носители заряда отклоняются силой Лоренца.</p>',
        fig: figHall
      },
      e: {
        title: 'ЭДС Холла E',
        html: '<p>На контактах <strong>3–4</strong> возникает ЭДС Холла:</p><p><var>E</var> = <var>K</var>·<var>I</var>·<var>H</var>, где <var>K</var> зависит от материала и толщины пластины (постоянная Холла / геометрия).</p>',
        fig: figHall
      },
      use: {
        title: 'Где применяют',
        html: '<p>Ток, положение, расход, угол, вибрация; комmutation BLDC-двигателей. Дёшевы, просты, нет трущихся частей — высокая надёжность. Распространились с микроэлектроникой (линейные «генераторы Холла»).</p>',
        fig: figHall
      }
    };
    const show = (key) => {
      const data = info[key] || info.plate;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (fig) fig.innerHTML = data.fig;
      hallSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      hallSlide.querySelectorAll('.hall-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    hallSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab && tab.dataset.info) {
        e.stopPropagation();
        show(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.hall-hit');
      if (hit && hit.dataset.info) {
        e.stopPropagation();
        show(hit.dataset.info);
      }
    });
    show('plate');
  }

  /* ===== Lecture 3: Hall types ===== */
  const hallTypesSlide = document.querySelector('.slide-hall-types-interactive');
  if (hallTypesSlide) {
    const panel = document.getElementById('hallTypesPanel');
    const info = {
      analog: {
        title: 'Аналоговый',
        html: '<p>Преобразует индукцию магнитного поля в напряжение. Выход зависит от полярности, силы поля и расстояния до магнита.</p><p>Диапазон измеряемой индукции задаёт производитель (Гс или мТл).</p>'
      },
      digital: {
        title: 'Цифровой',
        html: '<p>Фиксирует наличие / отсутствие поля: «1», если индукция выше порога, «0» — если ниже.</p><p>Минус — зона нечувствительности между порогами включения и отпускания.</p>'
      },
      bip: {
        title: 'Биполярный',
        html: '<p>Реагирует на смену полярности: одна полярность включает выход, другая — выключает. Удобно для магнитного энкодера с чередующимися N/S.</p>'
      },
      uni: {
        title: 'Униполярный',
        html: '<p>Срабатывает при достижении порога одной полярности и отпускает, когда индукция этой же полярности падает.</p>'
      },
      sens: {
        title: 'Чувствительность',
        html: '<p>Наклон характеристики линейного датчика: мВ/Гс или мВ/мТл.</p><p>Также смотрят полный выходной диапазон <var>U</var><sub>вых</sub> (доля от питания), погрешность линейности (метод наименьших квадратов, % шкалы), напряжение при нулевом поле и время отклика (10→90&nbsp;%).</p>'
      },
      drift: {
        title: 'Температурный дрейф',
        html: '<p>Дрейф нуля и дрейф чувствительности — в %/°C относительно 25&nbsp;°C.</p><p>Полоса пропускания <var>f</var><sub>s</sub> — по уровню −3&nbsp;дБ чувствительности в режиме малого сигнала.</p>'
      }
    };
    const show = (key) => {
      const data = info[key] || info.analog;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      hallTypesSlide.querySelectorAll('.app-purpose-card').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
    };
    hallTypesSlide.addEventListener('click', (e) => {
      const card = e.target.closest('.app-purpose-card');
      if (!card || !card.dataset.info) return;
      e.stopPropagation();
      show(card.dataset.info);
    });
    show('analog');
  }

  /* ===== Lecture 3: sensor test stand ===== */
  const sensorTestSlide = document.querySelector('.slide-sensor-test-interactive');
  if (sensorTestSlide) {
    const panel = document.getElementById('sensorTestPanel');
    const fig = document.getElementById('sensorTestFig');
    const figStand = `<svg class="sensor-test-svg" viewBox="0 0 520 200" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-label="Стенд испытаний датчиков">
<rect width="520" height="200" fill="#fafafa"/>
<text x="260" y="20" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">рис. 2.30 — стенд испытаний</text>
<g class="stest-hit" data-info="cu" style="cursor:pointer">
  <rect x="200" y="32" width="120" height="40" rx="6" fill="#fef3c7" stroke="#b45309" stroke-width="1.5"/>
  <text x="260" y="56" text-anchor="middle" font-size="14" font-weight="700" fill="#92400e">УУ</text>
</g>
<path d="M260 72 V88" stroke="#94a3b8" stroke-width="1.5"/>
<g class="stest-hit" data-info="task" style="cursor:pointer">
  <rect x="24" y="96" width="100" height="56" rx="6" fill="#fff" stroke="#1e293b" stroke-width="1.5"/>
  <text x="74" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">Задание</text>
</g>
<path d="M124 124 H148" stroke="#1e293b" stroke-width="1.5"/><polygon points="148,124 140,119 140,129" fill="#1e293b"/>
<g class="stest-hit" data-info="env" style="cursor:pointer">
  <rect x="148" y="96" width="110" height="56" rx="6" fill="#fff" stroke="#1e293b" stroke-width="1.5"/>
  <text x="203" y="122" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">среда</text>
  <text x="203" y="140" text-anchor="middle" font-size="11" fill="#64748b">T, P…</text>
</g>
<path d="M258 124 H282" stroke="#1e293b" stroke-width="1.5"/><polygon points="282,124 274,119 274,129" fill="#1e293b"/>
<g class="stest-hit" data-info="uut" style="cursor:pointer">
  <rect x="282" y="96" width="100" height="56" rx="6" fill="#dbeafe" stroke="#1e40af" stroke-width="1.6"/>
  <text x="332" y="128" text-anchor="middle" font-size="14" font-weight="700" fill="#1e40af">датчик</text>
</g>
<path d="M382 124 H406" stroke="#1e293b" stroke-width="1.5"/><polygon points="406,124 398,119 398,129" fill="#1e293b"/>
<g class="stest-hit" data-info="meter" style="cursor:pointer">
  <rect x="406" y="96" width="96" height="56" rx="6" fill="#fff" stroke="#1e293b" stroke-width="1.5"/>
  <text x="454" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">прибор</text>
</g>
<text x="260" y="188" text-anchor="middle" font-size="12" fill="#64748b">пример: термометр сопротивления — греют по заданию, меряют R</text>
</svg>`;
    const info = {
      task: {
        title: 'Задание',
        html: '<p>Задают уровни параметра испытательной среды. Для разных значений снимают точки и строят характеристику датчика.</p>',
        fig: figStand
      },
      env: {
        title: 'Испытательная среда',
        html: '<p>Формирует нужные условия: нагреватель, давление, перемещение… Управляется блоком УУ по сигналу «Задание».</p>',
        fig: figStand
      },
      uut: {
        title: 'Датчик',
        html: '<p>Испытуемый чувствительный элемент реагирует на среду. Методики для большинства датчиков похожи: меняем среду — записываем показания.</p>',
        fig: figStand
      },
      meter: {
        title: 'Измерительный прибор',
        html: '<p>Фиксирует выход датчика. Для ТС: по напряжению и току считают сопротивление; эталонный прибор может параллельно мерить саму среду.</p>',
        fig: figStand
      },
      cu: {
        title: 'Управляющее устройство (УУ)',
        html: '<p>Включает датчик в рабочую цепь (питание, токоограничение) и управляет средой — например, греет до температуры из «Задания».</p>',
        fig: figStand
      }
    };
    const show = (key) => {
      const data = info[key] || info.task;
      if (panel) panel.innerHTML = `<h3>${data.title}</h3>${data.html}`;
      if (fig) fig.innerHTML = data.fig;
      sensorTestSlide.querySelectorAll('.asutp-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.info === key);
      });
      sensorTestSlide.querySelectorAll('.stest-hit').forEach((hit) => {
        hit.classList.toggle('is-active', hit.dataset.info === key);
      });
    };
    sensorTestSlide.addEventListener('click', (e) => {
      const tab = e.target.closest('.asutp-tab');
      if (tab && tab.dataset.info) {
        e.stopPropagation();
        show(tab.dataset.info);
        return;
      }
      const hit = e.target.closest('.stest-hit');
      if (hit && hit.dataset.info) {
        e.stopPropagation();
        show(hit.dataset.info);
      }
    });
    show('task');
  }
})();

