/* =============================================
   RAGE — Hidden Terminal (BIOS boot → CMD)
   ============================================= */
(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  var backdropEl  = document.getElementById('termBackdrop');
  var terminalEl  = document.getElementById('terminal');
  var screenEl    = document.getElementById('termScreen');
  var inputLineEl = document.getElementById('termInputLine');
  var inputEl     = document.getElementById('termInput');
  var secretBtn   = document.getElementById('secretBtn');
  var closeBtn    = document.getElementById('termClose');
  var minBtn      = document.getElementById('termMin');

  if (!backdropEl || !secretBtn) return;

  /* ---------- Helpers ---------- */
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function print(text) {
    screenEl.textContent += text;
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  function println(text) { print(text + '\n'); }

  async function typeText(text, charDelay) {
    charDelay = charDelay || 14;
    for (var i = 0; i < text.length; i++) {
      print(text[i]);
      await sleep(charDelay);
    }
  }

  function cls() { screenEl.textContent = ''; }

  function replaceTrailing(oldText, newText) {
    var content = screenEl.textContent;
    var idx = content.lastIndexOf(oldText);
    if (idx !== -1) {
      screenEl.textContent = content.substring(0, idx) + newText + content.substring(idx + oldText.length);
    }
  }

  function replaceLastLine(newLine) {
    var content = screenEl.textContent;
    var lastNewline = content.lastIndexOf('\n');
    if (lastNewline === -1) {
      screenEl.textContent = newLine;
    } else {
      screenEl.textContent = content.substring(0, lastNewline + 1) + newLine;
    }
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  /* ===========================================
     PHASE 1 — BIOS POST
     =========================================== */
  async function phaseBiosPost() {
    println('Award Modular BIOS v4.51PG, An Energy Star Ally');
    println('Copyright (C) 1984-97, Award Software, Inc.');
    println('');
    println('(55XWUQ0E) Intel i430VX PCIset(TM)');
    println('');
    println('Pentium-S CPU at 75MHz');
    println('');

    await sleep(600);

    var target = 32768;
    var step   = 1024;
    var current = 0;
    while (current < target) {
      current += step;
      if (current > target) current = target;
      replaceLastLine('Memory Test: ' + current + 'K OK');
      await sleep(40);
    }
    println('');
    await sleep(400);

    println('');
    println('Award Plug and Play BIOS Extension v1.0A');
    println('Copyright (C) 1997, Award Software, Inc.');
    println('');
    await sleep(500);

    var ideLines = [
      { label: 'Detecting IDE Primary Master',   result: 'PCemHD' },
      { label: 'Detecting IDE Primary Slave',    result: 'PCemCD' },
      { label: 'Detecting IDE Secondary Master',  result: 'None' },
      { label: 'Detecting IDE Secondary Slave',   result: 'None' }
    ];

    for (var i = 0; i < ideLines.length; i++) {
      var entry = ideLines[i];
      print(entry.label + ' ... ');
      print('[Press F4 to skip]');
      await sleep(800 + Math.random() * 600);
      replaceTrailing('[Press F4 to skip]', entry.result);
      println('');
      await sleep(200);
    }

    println('');
    println('Press DEL to enter SETUP');
    println('12/10/97-i430VX,UMCB669-ZA59GH2BC-00');

    await sleep(2000);
  }

  /* ===========================================
     PHASE 2 — System Configurations table
     =========================================== */
  async function phaseSystemConfig() {
    cls();

    var t = '';
    t += '                     System Configurations\n';
    t += '\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n';
    t += '\u2502 CPU Type      : PENTIUM-S      \u2502 Base Memory     :   640K \u2502\n';
    t += '\u2502 Co-Processor  : Installed      \u2502 Extended Memory : 31744K \u2502\n';
    t += '\u2502 CPU Clock     : 75MHz          \u2502 Cache Memory    :  None  \u2502\n';
    t += '\u251C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n';
    t += '\u2502 Diskette A : 2.88M, 3.5 in.   \u2502 Display Type   : EGA/VGA\u2502\n';
    t += '\u2502 Diskette B : None             \u2502 Serial Port(s) : 3F8 2F8\u2502\n';
    t += '\u2502 Pri. Master: LBA, Mode 2      \u2502 Parallel Port  : 378    \u2502\n';
    t += '\u2502 Pri. Slave : CDROM, Mode 4    \u2502 EDO DRAM Row   : None   \u2502\n';
    t += '\u2502 Sec. Master: None             \u2502 SDRAM at Row   : 0 1 2 3\u2502\n';
    t += '\u2502 Sec. Slave : None             \u2502 L2 Cache Type  : None   \u2502\n';
    t += '\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n';
    t += '\n';
    t += ' PCI device listing .....\n';
    t += ' Bus No. Device No. Func No. Vendor ID Device ID  Class            IRQ\n';
    t += ' \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n';
    t += '   0        7          1       8086      1230   IDE Controller     14\n';
    t += '   0       17          0       1274      1371   Multimedia Device  11\n';

    print(t);
    await sleep(2500);

    println('');
    await typeText('Verifying DMI Pool Data .......', 50);
    await sleep(1000);
    println('');
    await typeText('Starting Windows 95', 60);

    for (var d = 0; d < 3; d++) {
      await sleep(500);
      print('.');
    }

    await sleep(1500);
  }

  /* ===========================================
     PHASE 3 — CMD Prompt
     =========================================== */
  async function phaseCMD() {
    cls();

    println('Microsoft(R) Windows 95');
    println('   (C)Copyright Microsoft Corp 1981-1996.');
    println('');

    await sleep(400);
    var loadSteps = [
      'Loading system drivers',
      'Initializing command interface',
      'Loading modules'
    ];
    for (var i = 0; i < loadSteps.length; i++) {
      print(loadSteps[i]);
      for (var d = 0; d < 3; d++) {
        await sleep(300);
        print('.');
      }
      await sleep(200);
      println(' OK');
    }

    println('');
    await sleep(300);
    println('Type "help" to see available commands.');
    println('');

    inputLineEl.style.display = 'flex';
    inputEl.focus();
  }

  /* ---------- Command processing ---------- */
  var commands = {
    help: function () {
      return [
        '',
        'Available commands:',
        '  HELP      - Show this help message',
        '  QUESTION  - Ask the system a question',
        '  LOGIN     - Attempt to log in',
        '  NEWS!     - View the latest news',
        '  CLS       - Clear the screen',
        '  EXIT      - Close the terminal',
        ''
      ].join('\n');
    },

    question: function () {
      return [
        '',
        '  What do you want to know?',
        '  ...The system is listening.',
        '  [This feature is under construction]',
        ''
      ].join('\n');
    },

    login: function () {
      return [
        '',
        '  ACCESS DENIED.',
        '  Authorization level: INSUFFICIENT',
        '  Contact system administrator.',
        ''
      ].join('\n');
    },

    'news!': function () {
      return [
        '',
        '  ========== SYSTEM NEWS ==========',
        '  > RAGE development is underway.',
        '  > New team members recruited.',
        '  > Something big is coming...',
        '  =================================',
        ''
      ].join('\n');
    },

    cls: function () {
      cls();
      return '';
    },

    exit: function () {
      closeTerminal();
      return '';
    }
  };

  function processCommand(raw) {
    var cmd = raw.trim().toLowerCase();
    if (cmd === '') return '';
    if (commands[cmd]) return commands[cmd]();
    return '\n  \'' + raw.trim() + '\' is not recognized as an internal or external command,\n  operable program or batch file.\n';
  }

  /* ---------- Input handler ---------- */
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var value = inputEl.value;
      inputEl.value = '';
      println('C:\\>' + value);
      var result = processCommand(value);
      if (result) print(result);
      screenEl.scrollTop = screenEl.scrollHeight;
    }
  });

  /* ---------- Open / close ---------- */
  function openTerminal() {
    backdropEl.classList.add('term-backdrop--open');
    runBootSequence();
  }

  function closeTerminal() {
    backdropEl.classList.remove('term-backdrop--open');
    inputLineEl.style.display = 'none';
    cls();
  }

  async function runBootSequence() {
    cls();
    inputLineEl.style.display = 'none';
    await sleep(500);
    await phaseBiosPost();
    await phaseSystemConfig();
    await phaseCMD();
  }

  /* ---------- Secret button ---------- */
  secretBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    openTerminal();
  });

  /* ---------- Window controls ---------- */
  closeBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeTerminal();
  });

  minBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    closeTerminal();
  });

  /* Click backdrop to close */
  backdropEl.addEventListener('click', function (e) {
    if (e.target === backdropEl) closeTerminal();
  });

  /* ESC to close */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdropEl.classList.contains('term-backdrop--open')) {
      closeTerminal();
    }
  });

  /* Keep focus on input when clicking inside the terminal */
  terminalEl.addEventListener('click', function () {
    if (inputLineEl.style.display !== 'none') {
      inputEl.focus();
    }
  });

})();
