// Authentic Nokia 3310 Snake II Engine with Pixel-Art LCD Graphics and Reactive Controls
(function(window) {
  'use strict';

  const GRID_COLS = 30;
  const GRID_ROWS = 20;

  // Speeds in ms (Level 1 = 230ms, Level 9 = 50ms)
  const SPEED_LEVELS = [230, 195, 160, 130, 105, 85, 70, 58, 48];

  // Classic Nokia Mazes
  const MAZES = [
    {
      id: 0,
      name: "1. No Walls (Wrap)",
      desc: "Snake passes through screen boundaries",
      walls: []
    },
    {
      id: 1,
      name: "2. Box (Border)",
      desc: "Solid walls around the field",
      walls: generateBoxWalls()
    },
    {
      id: 2,
      name: "3. Tunnel",
      desc: "Top and bottom tunnels with central pillars",
      walls: generateTunnelWalls()
    },
    {
      id: 3,
      name: "4. Mill",
      desc: "Four obstacle crosses",
      walls: generateMillWalls()
    },
    {
      id: 4,
      name: "5. Rails",
      desc: "Two horizontal barrier rails",
      walls: generateRailsWalls()
    }
  ];

  function generateBoxWalls() {
    const walls = [];
    for (let x = 0; x < GRID_COLS; x++) {
      walls.push({ x, y: 0 });
      walls.push({ x, y: GRID_ROWS - 1 });
    }
    for (let y = 1; y < GRID_ROWS - 1; y++) {
      walls.push({ x: 0, y });
      walls.push({ x: GRID_COLS - 1, y });
    }
    return walls;
  }

  function generateTunnelWalls() {
    const walls = [];
    for (let x = 0; x < GRID_COLS; x++) {
      if (x < 9 || x > 20) {
        walls.push({ x, y: 0 });
        walls.push({ x, y: GRID_ROWS - 1 });
      }
    }
    for (let y = 5; y <= 14; y++) {
      walls.push({ x: 9, y });
      walls.push({ x: 20, y });
    }
    return walls;
  }

  function generateMillWalls() {
    const walls = [];
    const cx = Math.floor(GRID_COLS / 2);
    const cy = Math.floor(GRID_ROWS / 2);
    for (let i = -4; i <= 4; i++) {
      if (Math.abs(i) > 0) {
        walls.push({ x: cx + i, y: cy });
        walls.push({ x: cx, y: cy + i });
      }
    }
    for (let i = 2; i <= 5; i++) {
      walls.push({ x: i, y: 3 });
      walls.push({ x: GRID_COLS - 1 - i, y: 3 });
      walls.push({ x: i, y: GRID_ROWS - 4 });
      walls.push({ x: GRID_COLS - 1 - i, y: GRID_ROWS - 4 });
    }
    return walls;
  }

  function generateRailsWalls() {
    const walls = [];
    const y1 = 5;
    const y2 = GRID_ROWS - 6;
    for (let x = 3; x < GRID_COLS - 3; x++) {
      if (x < 12 || x > 17) {
        walls.push({ x, y: y1 });
        walls.push({ x, y: y2 });
      }
    }
    return walls;
  }

  // Themes with authentic Nokia LCD palettes
  const THEMES = {
    green: {
      id: 'green',
      name: 'Nokia 3310 (Green LCD)',
      bg: '#98AB70',
      bgGrid: '#8C9F65',
      pixel: '#182310',
      pixelDim: '#6A7D4E'
    },
    amber: {
      id: 'amber',
      name: 'Nokia 3210 (Amber / Orange)',
      bg: '#E59B3C',
      bgGrid: '#D48C2E',
      pixel: '#2F1A02',
      pixelDim: '#B87A24'
    },
    blue: {
      id: 'blue',
      name: 'Nokia 1100 (Ice Blue)',
      bg: '#80A8B8',
      bgGrid: '#729AA9',
      pixel: '#14252F',
      pixelDim: '#608695'
    },
    mono: {
      id: 'mono',
      name: 'Monochrome (Gray LCD)',
      bg: '#BDC7BD',
      bgGrid: '#ACB6AC',
      pixel: '#1F241F',
      pixelDim: '#99A399'
    }
  };

  // Nokia 5x7 Pixel Font Definitions for authentic LCD rendering
  const PIXEL_FONT = {
    '0': [0x1E, 0x21, 0x25, 0x29, 0x31, 0x21, 0x1E],
    '1': [0x08, 0x18, 0x28, 0x08, 0x08, 0x08, 0x3E],
    '2': [0x1E, 0x21, 0x01, 0x0E, 0x18, 0x20, 0x3F],
    '3': [0x1E, 0x21, 0x01, 0x0E, 0x01, 0x21, 0x1E],
    '4': [0x04, 0x0C, 0x14, 0x24, 0x3F, 0x04, 0x04],
    '5': [0x3F, 0x20, 0x3E, 0x01, 0x01, 0x21, 0x1E],
    '6': [0x0E, 0x10, 0x20, 0x3E, 0x21, 0x21, 0x1E],
    '7': [0x3F, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20],
    '8': [0x1E, 0x21, 0x21, 0x1E, 0x21, 0x21, 0x1E],
    '9': [0x1E, 0x21, 0x21, 0x1F, 0x01, 0x02, 0x1C],
    ' ': [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    ':': [0x00, 0x0C, 0x0C, 0x00, 0x0C, 0x0C, 0x00],
    '.': [0x00, 0x00, 0x00, 0x00, 0x00, 0x0C, 0x0C],
    '-': [0x00, 0x00, 0x00, 0x3E, 0x00, 0x00, 0x00],
    '>': [0x20, 0x10, 0x08, 0x04, 0x08, 0x10, 0x20],
    '<': [0x04, 0x08, 0x10, 0x20, 0x10, 0x08, 0x04],
    'A': [0x0E, 0x11, 0x21, 0x3F, 0x21, 0x21, 0x21],
    'B': [0x3E, 0x21, 0x21, 0x3E, 0x21, 0x21, 0x3E],
    'C': [0x1E, 0x21, 0x20, 0x20, 0x20, 0x21, 0x1E],
    'D': [0x3C, 0x22, 0x21, 0x21, 0x21, 0x22, 0x3C],
    'E': [0x3F, 0x20, 0x20, 0x3E, 0x20, 0x20, 0x3F],
    'F': [0x3F, 0x20, 0x20, 0x3E, 0x20, 0x20, 0x20],
    'G': [0x1E, 0x21, 0x20, 0x27, 0x21, 0x21, 0x1F],
    'H': [0x21, 0x21, 0x21, 0x3F, 0x21, 0x21, 0x21],
    'I': [0x1F, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x1F],
    'J': [0x03, 0x01, 0x01, 0x01, 0x21, 0x21, 0x1E],
    'K': [0x21, 0x22, 0x24, 0x38, 0x24, 0x22, 0x21],
    'L': [0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x3F],
    'M': [0x21, 0x33, 0x2D, 0x21, 0x21, 0x21, 0x21],
    'N': [0x21, 0x31, 0x29, 0x25, 0x23, 0x21, 0x21],
    'O': [0x1E, 0x21, 0x21, 0x21, 0x21, 0x21, 0x1E],
    'P': [0x3E, 0x21, 0x21, 0x3E, 0x20, 0x20, 0x20],
    'Q': [0x1E, 0x21, 0x21, 0x21, 0x25, 0x23, 0x1F],
    'R': [0x3E, 0x21, 0x21, 0x3E, 0x24, 0x22, 0x21],
    'S': [0x1E, 0x21, 0x20, 0x1E, 0x01, 0x21, 0x1E],
    'T': [0x3F, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E],
    'U': [0x21, 0x21, 0x21, 0x21, 0x21, 0x21, 0x1E],
    'V': [0x21, 0x21, 0x21, 0x12, 0x12, 0x0C, 0x0C],
    'W': [0x21, 0x21, 0x21, 0x21, 0x2D, 0x33, 0x21],
    'X': [0x21, 0x12, 0x0C, 0x0C, 0x12, 0x21, 0x21],
    'Y': [0x21, 0x12, 0x0C, 0x08, 0x08, 0x08, 0x08],
    'Z': [0x3F, 0x02, 0x04, 0x08, 0x10, 0x20, 0x3F],
    '!': [0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x08],
    '?': [0x1E, 0x21, 0x02, 0x04, 0x08, 0x00, 0x08]
  };

  class SnakeGame {
    constructor(canvas, uiElements) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.ui = uiElements || {};

      // Settings
      this.speedLevel = parseInt(localStorage.getItem('nokia_snake_speed') || '4', 10);
      this.currentMazeId = parseInt(localStorage.getItem('nokia_snake_maze') || '0', 10);
      this.currentThemeKey = localStorage.getItem('nokia_snake_theme') || 'green';
      this.currentTheme = THEMES[this.currentThemeKey] || THEMES.green;

      // Game state
      this.state = 'MENU'; // 'MENU', 'PLAYING', 'PAUSED', 'GAMEOVER'
      this.menuIndex = 0;

      // Snake & items
      this.snake = [];
      this.dir = { dx: 1, dy: 0 };
      this.inputQueue = []; // Multi-step turn queue for ultra-responsive control
      this.food = null;
      this.bonus = null;
      this.bonusTimer = 0;
      this.bonusMaxTimer = 0;
      this.foodsEaten = 0;
      this.tickCount = 0;

      // Scores
      this.score = 0;
      this.highScores = this.loadHighScores();

      // Loop control
      this.lastTickTime = 0;
      this.animId = null;

      this.initDisplay();
      this.bindEvents();
      this.updateHighScoresUI();
      this.syncSpeedUI();
      this.draw();
    }

    initDisplay() {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      const width = rect.width || 360;
      const height = rect.height || 240;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.displayWidth = width;
      this.displayHeight = height;

      this.cellSizeX = width / GRID_COLS;
      this.cellSizeY = height / GRID_ROWS;
    }

    loadHighScores() {
      try {
        const data = localStorage.getItem('nokia_snake_highscores');
        if (data) return JSON.parse(data);
      } catch (e) {}
      return { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
    }

    saveHighScore(mazeId, score) {
      if (score > (this.highScores[mazeId] || 0)) {
        this.highScores[mazeId] = score;
        localStorage.setItem('nokia_snake_highscores', JSON.stringify(this.highScores));
        return true;
      }
      return false;
    }

    getHighScore() {
      return this.highScores[this.currentMazeId] || 0;
    }

    // Reactive Speed Changer: Updates instantly everywhere and adjusts loop timing
    setSpeed(level) {
      const newSpeed = Math.max(1, Math.min(9, level));
      this.speedLevel = newSpeed;
      localStorage.setItem('nokia_snake_speed', newSpeed.toString());

      // If playing, clamp tick time so new speed takes effect immediately
      if (this.state === 'PLAYING') {
        const currentInterval = SPEED_LEVELS[this.speedLevel - 1];
        this.lastTickTime = Math.min(this.lastTickTime, performance.now() - currentInterval + 15);
      }

      window.NokiaSound.click();
      this.syncSpeedUI();
      this.draw();
    }

    cycleSpeed() {
      const nextSpeed = (this.speedLevel % 9) + 1;
      this.setSpeed(nextSpeed);
    }

    syncSpeedUI() {
      if (this.ui.speedDisplay) this.ui.speedDisplay.textContent = this.speedLevel;
      if (this.ui.quickSpeedVal) this.ui.quickSpeedVal.textContent = this.speedLevel;
      if (this.ui.lcdSpeedVal) this.ui.lcdSpeedVal.textContent = this.speedLevel;

      // Update speed pills
      document.querySelectorAll('.speed-pill-btn, .pill-btn[data-speed]').forEach(btn => {
        const s = parseInt(btn.getAttribute('data-speed'), 10);
        btn.classList.toggle('active', s === this.speedLevel);
      });
    }

    setMaze(mazeId) {
      this.currentMazeId = mazeId % MAZES.length;
      localStorage.setItem('nokia_snake_maze', this.currentMazeId.toString());
      if (this.ui.mazeDisplay) {
        this.ui.mazeDisplay.textContent = MAZES[this.currentMazeId].name;
      }
      this.updateHighScoresUI();
      window.NokiaSound.click();
      this.draw();
    }

    cycleMaze() {
      this.setMaze(this.currentMazeId + 1);
    }

    setTheme(themeKey) {
      if (THEMES[themeKey]) {
        this.currentThemeKey = themeKey;
        this.currentTheme = THEMES[themeKey];
        localStorage.setItem('nokia_snake_theme', themeKey);
        document.documentElement.setAttribute('data-theme', themeKey);
        this.draw();
      }
    }

    startNewGame() {
      this.score = 0;
      this.foodsEaten = 0;
      this.bonus = null;
      this.bonusTimer = 0;
      this.inputQueue = [];

      // Snake starts in center
      const startX = Math.floor(GRID_COLS / 2);
      const startY = Math.floor(GRID_ROWS / 2);

      this.snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY },
        { x: startX - 3, y: startY }
      ];

      this.dir = { dx: 1, dy: 0 };

      this.spawnFood();

      this.state = 'PLAYING';
      this.lastTickTime = performance.now();
      window.NokiaSound.select();

      this.updateHUD();
      this.runLoop();
    }

    spawnFood() {
      const walls = MAZES[this.currentMazeId].walls;
      let valid = false;
      let pt = null;
      let attempts = 0;

      while (!valid && attempts < 300) {
        attempts++;
        pt = {
          x: Math.floor(Math.random() * (GRID_COLS - 2)) + 1,
          y: Math.floor(Math.random() * (GRID_ROWS - 2)) + 1
        };

        const onSnake = this.snake.some(s => s.x === pt.x && s.y === pt.y);
        const onWall = walls.some(w => w.x === pt.x && w.y === pt.y);
        const onBonus = this.bonus && this.bonus.x === pt.x && this.bonus.y === pt.y;

        if (!onSnake && !onWall && !onBonus) {
          valid = true;
        }
      }

      this.food = pt || { x: 5, y: 5 };
    }

    spawnBonus() {
      const walls = MAZES[this.currentMazeId].walls;
      let valid = false;
      let pt = null;
      let attempts = 0;

      while (!valid && attempts < 300) {
        attempts++;
        pt = {
          x: Math.floor(Math.random() * (GRID_COLS - 4)) + 2,
          y: Math.floor(Math.random() * (GRID_ROWS - 4)) + 2
        };

        const onSnake = this.snake.some(s => s.x === pt.x && s.y === pt.y);
        const onWall = walls.some(w => w.x === pt.x && w.y === pt.y);
        const onFood = this.food && this.food.x === pt.x && this.food.y === pt.y;

        if (!onSnake && !onWall && !onFood) {
          valid = true;
        }
      }

      if (valid) {
        this.bonus = pt;
        this.bonusMaxTimer = 32;
        this.bonusTimer = this.bonusMaxTimer;
        window.NokiaSound.bonusAppear();
      }
    }

    update() {
      if (this.state !== 'PLAYING') return;

      this.tickCount++;

      // Dequeue next input direction
      if (this.inputQueue.length > 0) {
        const next = this.inputQueue.shift();
        if (!(next.dx === -this.dir.dx && next.dy === -this.dir.dy)) {
          this.dir = next;
        }
      }

      let newHead = {
        x: this.snake[0].x + this.dir.dx,
        y: this.snake[0].y + this.dir.dy
      };

      // Maze 0: Open border wrap-around
      if (this.currentMazeId === 0) {
        if (newHead.x < 0) newHead.x = GRID_COLS - 1;
        if (newHead.x >= GRID_COLS) newHead.x = 0;
        if (newHead.y < 0) newHead.y = GRID_ROWS - 1;
        if (newHead.y >= GRID_ROWS) newHead.y = 0;
      }

      // Check wall collision
      const walls = MAZES[this.currentMazeId].walls;
      const hitWall = walls.some(w => w.x === newHead.x && w.y === newHead.y) ||
        (this.currentMazeId !== 0 && (newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS));

      if (hitWall) {
        this.handleGameOver();
        return;
      }

      // Check self collision (ignoring tail tip)
      const hitSelf = this.snake.slice(0, -1).some(s => s.x === newHead.x && s.y === newHead.y);
      if (hitSelf) {
        this.handleGameOver();
        return;
      }

      // Move snake head forward
      this.snake.unshift(newHead);

      // Check regular food
      if (this.food && newHead.x === this.food.x && newHead.y === this.food.y) {
        this.foodsEaten++;
        const points = 10 * this.speedLevel;
        this.score += points;
        window.NokiaSound.eat();

        this.spawnFood();

        // Bonus creature every 5 regular foods
        if (this.foodsEaten % 5 === 0 && !this.bonus) {
          this.spawnBonus();
        }
      } else if (this.bonus && newHead.x === this.bonus.x && newHead.y === this.bonus.y) {
        // Bonus eaten!
        const bonusPoints = Math.round(50 + (this.bonusTimer / this.bonusMaxTimer) * 150) * this.speedLevel;
        this.score += bonusPoints;
        window.NokiaSound.bonusEat();
        this.bonus = null;
        this.bonusTimer = 0;
      } else {
        // Normal step: pop tail
        this.snake.pop();
      }

      // Bonus creature countdown
      if (this.bonus) {
        this.bonusTimer--;
        if (this.bonusTimer <= 0) {
          this.bonus = null;
        }
      }

      this.updateHUD();
    }

    handleGameOver() {
      this.state = 'GAMEOVER';
      window.NokiaSound.gameOver();
      const isNewHigh = this.saveHighScore(this.currentMazeId, this.score);
      this.isNewHigh = isNewHigh;
      this.updateHighScoresUI();
      this.draw();
    }

    togglePause() {
      if (this.state === 'PLAYING') {
        this.state = 'PAUSED';
        window.NokiaSound.pause();
      } else if (this.state === 'PAUSED') {
        this.state = 'PLAYING';
        this.lastTickTime = performance.now();
        window.NokiaSound.click();
        this.runLoop();
      }
      this.draw();
    }

    // High responsiveness: accepts rapid turns and queues them cleanly
    setDirection(dx, dy) {
      if (this.state !== 'PLAYING') {
        if (this.state === 'MENU' || this.state === 'GAMEOVER') {
          this.startNewGame();
          return;
        }
        if (this.state === 'PAUSED') {
          this.togglePause();
          return;
        }
      }

      const referenceDir = this.inputQueue.length > 0 
        ? this.inputQueue[this.inputQueue.length - 1] 
        : this.dir;

      // Disallow 180-degree immediate reversal
      if (dx !== 0 && referenceDir.dx !== 0 && dx === -referenceDir.dx) return;
      if (dy !== 0 && referenceDir.dy !== 0 && dy === -referenceDir.dy) return;

      // Disallow redundant duplicate commands
      if (dx === referenceDir.dx && dy === referenceDir.dy) return;

      if (this.inputQueue.length < 2) {
        this.inputQueue.push({ dx, dy });
        window.NokiaSound.turn();
      }
    }

    runLoop() {
      if (this.state !== 'PLAYING') return;

      const now = performance.now();
      const interval = SPEED_LEVELS[this.speedLevel - 1];

      if (now - this.lastTickTime >= interval) {
        this.update();
        this.lastTickTime = now;
      }

      this.draw();

      if (this.state === 'PLAYING') {
        this.animId = requestAnimationFrame(() => this.runLoop());
      }
    }

    updateHUD() {
      if (this.ui.scoreDisplay) this.ui.scoreDisplay.textContent = this.score;
      if (this.ui.highScoreDisplay) this.ui.highScoreDisplay.textContent = this.getHighScore();
      if (this.ui.bonusMeter) {
        if (this.bonus) {
          this.ui.bonusMeter.style.display = 'block';
          const pct = Math.max(0, (this.bonusTimer / this.bonusMaxTimer) * 100);
          this.ui.bonusMeterFill.style.width = pct + '%';
        } else {
          this.ui.bonusMeter.style.display = 'none';
        }
      }
    }

    updateHighScoresUI() {
      if (this.ui.highScoreDisplay) {
        this.ui.highScoreDisplay.textContent = this.getHighScore();
      }
      if (this.ui.highScoresList) {
        this.ui.highScoresList.innerHTML = MAZES.map(m => `
          <div class="score-row ${m.id === this.currentMazeId ? 'active-maze' : ''}">
            <span class="maze-label">${m.name}:</span>
            <span class="score-num">${this.highScores[m.id] || 0}</span>
          </div>
        `).join('');
      }
    }

    // DRAWING
    draw() {
      const rect = this.canvas.getBoundingClientRect();
      const w = rect.width || 360;
      const h = rect.height || 240;

      this.ctx.fillStyle = this.currentTheme.bg;
      this.ctx.fillRect(0, 0, w, h);

      // LCD faint pixel matrix background
      this.drawLcdGrid(w, h);

      if (this.state === 'MENU') {
        this.drawMenu(w, h);
      } else if (this.state === 'PLAYING' || this.state === 'PAUSED') {
        this.drawGame(w, h);
        if (this.state === 'PAUSED') {
          this.drawPausedOverlay(w, h);
        }
      } else if (this.state === 'GAMEOVER') {
        this.drawGame(w, h);
        this.drawGameOverOverlay(w, h);
      }
    }

    drawLcdGrid(w, h) {
      this.ctx.fillStyle = this.currentTheme.bgGrid;
      const dot = 1.2;
      for (let x = 0; x < GRID_COLS; x++) {
        for (let y = 0; y < GRID_ROWS; y++) {
          const px = Math.round(x * this.cellSizeX + this.cellSizeX * 0.5);
          const py = Math.round(y * this.cellSizeY + this.cellSizeY * 0.5);
          this.ctx.fillRect(px, py, dot, dot);
        }
      }
    }

    // Draw single cell block
    drawCell(x, y, color = this.currentTheme.pixel) {
      this.ctx.fillStyle = color;
      const px = Math.round(x * this.cellSizeX);
      const py = Math.round(y * this.cellSizeY);
      const pw = Math.round(this.cellSizeX);
      const ph = Math.round(this.cellSizeY);
      this.ctx.fillRect(px, py, pw, ph);
    }

    // Draw game elements (Walls, Food, Snake)
    drawGame(w, h) {
      // 1. Draw Maze Walls
      const walls = MAZES[this.currentMazeId].walls;
      walls.forEach(wall => {
        this.drawCell(wall.x, wall.y, this.currentTheme.pixel);
      });

      // 2. Draw Food (Authentic Nokia Fly/Bug)
      if (this.food) {
        this.drawNokiaBug(this.food.x, this.food.y);
      }

      // 3. Draw Bonus Creature (Beetle with wiggling legs)
      if (this.bonus) {
        this.drawNokiaBonusBeetle(this.bonus.x, this.bonus.y);
      }

      // 4. Draw Snake with iconic segmented body and eyes!
      this.drawNokiaSnake();
    }

    // Authentic Nokia Snake Rendering: Head with direction-facing eyes & segmented body
    drawNokiaSnake() {
      const sX = this.cellSizeX;
      const sY = this.cellSizeY;

      for (let i = this.snake.length - 1; i >= 0; i--) {
        const seg = this.snake[i];
        const px = Math.round(seg.x * sX);
        const py = Math.round(seg.y * sY);
        const w = Math.round(sX) - 1;
        const h = Math.round(sY) - 1;

        if (i === 0) {
          // --- SNAKE HEAD ---
          this.ctx.fillStyle = this.currentTheme.pixel;
          this.ctx.fillRect(px, py, w, h);

          // Authentic Nokia Eyes (drawn in LCD background color)
          this.ctx.fillStyle = this.currentTheme.bg;
          const eyeSize = Math.max(2, Math.round(Math.min(sX, sY) * 0.25));

          if (this.dir.dx === 1) {
            // Heading Right: eyes on right edge
            this.ctx.fillRect(px + w - eyeSize - 1, py + 1, eyeSize, eyeSize);
            this.ctx.fillRect(px + w - eyeSize - 1, py + h - eyeSize - 1, eyeSize, eyeSize);
          } else if (this.dir.dx === -1) {
            // Heading Left: eyes on left edge
            this.ctx.fillRect(px + 1, py + 1, eyeSize, eyeSize);
            this.ctx.fillRect(px + 1, py + h - eyeSize - 1, eyeSize, eyeSize);
          } else if (this.dir.dy === -1) {
            // Heading Up: eyes on top edge
            this.ctx.fillRect(px + 1, py + 1, eyeSize, eyeSize);
            this.ctx.fillRect(px + w - eyeSize - 1, py + 1, eyeSize, eyeSize);
          } else {
            // Heading Down: eyes on bottom edge
            this.ctx.fillRect(px + 1, py + h - eyeSize - 1, eyeSize, eyeSize);
            this.ctx.fillRect(px + w - eyeSize - 1, py + h - eyeSize - 1, eyeSize, eyeSize);
          }
        } else {
          // --- BODY SEGMENT ---
          // Solid dark segment with 1px border separation for that unmistakable segmented look
          this.ctx.fillStyle = this.currentTheme.pixel;
          this.ctx.fillRect(px, py, w, h);

          // Subtle center notch on inner segments like real Nokia 3310
          if (i % 2 === 0 && w > 6 && h > 6) {
            this.ctx.fillStyle = this.currentTheme.bg;
            this.ctx.fillRect(px + Math.round(w * 0.38), py + Math.round(h * 0.38), 2, 2);
          }
        }
      }
    }

    // Classic Nokia Fly / Bug Food (Center 2x2 body + 4 feet)
    drawNokiaBug(x, y) {
      const px = Math.round(x * this.cellSizeX);
      const py = Math.round(y * this.cellSizeY);
      const w = Math.round(this.cellSizeX) - 1;
      const h = Math.round(this.cellSizeY) - 1;

      this.ctx.fillStyle = this.currentTheme.pixel;

      // Solid central body
      const cx = px + Math.round(w * 0.22);
      const cy = py + Math.round(h * 0.22);
      const bw = Math.round(w * 0.56);
      const bh = Math.round(h * 0.56);
      this.ctx.fillRect(cx, cy, bw, bh);

      // Four feet / wings at corners
      const legSize = Math.max(1, Math.round(Math.min(w, h) * 0.2));
      const wiggle = (Math.floor(this.tickCount / 3) % 2 === 0);

      if (wiggle) {
        this.ctx.fillRect(px, py, legSize, legSize);
        this.ctx.fillRect(px + w - legSize, py, legSize, legSize);
        this.ctx.fillRect(px, py + h - legSize, legSize, legSize);
        this.ctx.fillRect(px + w - legSize, py + h - legSize, legSize, legSize);
      } else {
        this.ctx.fillRect(px + 1, py, legSize, legSize);
        this.ctx.fillRect(px + w - legSize - 1, py, legSize, legSize);
        this.ctx.fillRect(px + 1, py + h - legSize, legSize, legSize);
        this.ctx.fillRect(px + w - legSize - 1, py + h - legSize, legSize, legSize);
      }
    }

    // Classic Nokia Snake II Bonus Beetle
    drawNokiaBonusBeetle(x, y) {
      const px = Math.round(x * this.cellSizeX);
      const py = Math.round(y * this.cellSizeY);
      const w = Math.round(this.cellSizeX) - 1;
      const h = Math.round(this.cellSizeY) - 1;

      this.ctx.fillStyle = this.currentTheme.pixel;

      // Bigger central beetle shell
      this.ctx.fillRect(px + 1, py + 1, w - 2, h - 2);

      // Center shell split line
      this.ctx.fillStyle = this.currentTheme.bg;
      this.ctx.fillRect(px + Math.round(w * 0.45), py + 2, 1, h - 4);

      // Crawling legs on sides
      this.ctx.fillStyle = this.currentTheme.pixel;
      const legWiggle = (Math.floor(this.tickCount / 2) % 2 === 0);
      const off = legWiggle ? 1 : 2;

      this.ctx.fillRect(px - 1, py + off, 2, 2);
      this.ctx.fillRect(px + w - 1, py + off, 2, 2);
      this.ctx.fillRect(px - 1, py + h - off - 2, 2, 2);
      this.ctx.fillRect(px + w - 1, py + h - off - 2, 2, 2);
    }

    // Render Nokia 5x7 Bitmap text directly to canvas
    drawPixelText(text, x, y, scale = 2, color = this.currentTheme.pixel) {
      this.ctx.fillStyle = color;
      let curX = x;

      for (let i = 0; i < text.length; i++) {
        const ch = text[i].toUpperCase();
        const glyph = PIXEL_FONT[ch] || PIXEL_FONT[' '];

        for (let row = 0; row < 7; row++) {
          const rowBits = glyph[row] || 0;
          for (let col = 0; col < 5; col++) {
            if ((rowBits & (1 << (5 - col))) !== 0) {
              this.ctx.fillRect(curX + col * scale, y + row * scale, scale, scale);
            }
          }
        }
        curX += (5 + 1) * scale;
      }
    }

    getPixelTextWidth(text, scale = 2) {
      return text.length * 6 * scale;
    }

    // Nokia Phone Menu Screen
    drawMenu(w, h) {
      // Title: "SNAKE II"
      const title = "SNAKE II";
      const titleScale = 3;
      const titleW = this.getPixelTextWidth(title, titleScale);
      this.drawPixelText(title, Math.round((w - titleW) / 2), 22, titleScale);

      // Sub-rule border
      this.ctx.fillStyle = this.currentTheme.pixel;
      this.ctx.fillRect(Math.round(w * 0.1), 48, Math.round(w * 0.8), 2);

      // Interactive Menu items
      const items = [
        "1. PLAY GAME",
        `2. MAZE: ${this.currentMazeId + 1}`,
        `3. SPEED: ${this.speedLevel}`,
        "4. HIGH SCORES"
      ];

      items.forEach((item, idx) => {
        const y = 68 + idx * 28;
        const itemW = this.getPixelTextWidth(item, 2);
        const itemX = Math.round((w - itemW) / 2);

        if (idx === this.menuIndex) {
          // Highlight active row
          this.ctx.fillStyle = this.currentTheme.pixel;
          this.ctx.fillRect(Math.round(w * 0.08), y - 4, Math.round(w * 0.84), 20);
          this.drawPixelText(`> ${item} <`, itemX - 24, y, 2, this.currentTheme.bg);
        } else {
          this.drawPixelText(item, itemX, y, 2, this.currentTheme.pixel);
        }
      });

      // Bottom helper hints
      const hint = "TAP SCREEN OR 2/8/5";
      const hintW = this.getPixelTextWidth(hint, 1);
      this.drawPixelText(hint, Math.round((w - hintW) / 2), h - 16, 1, this.currentTheme.pixelDim);
    }

    drawPausedOverlay(w, h) {
      const boxW = Math.round(w * 0.72);
      const boxH = 50;
      const bx = Math.round((w - boxW) / 2);
      const by = Math.round((h - boxH) / 2);

      this.ctx.fillStyle = this.currentTheme.bg;
      this.ctx.fillRect(bx, by, boxW, boxH);
      this.ctx.strokeStyle = this.currentTheme.pixel;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(bx, by, boxW, boxH);

      const pausedTxt = "PAUSED";
      const pw = this.getPixelTextWidth(pausedTxt, 2);
      this.drawPixelText(pausedTxt, Math.round((w - pw) / 2), by + 12, 2);

      const resumeTxt = "PRESS 5 OR TAP";
      const rw = this.getPixelTextWidth(resumeTxt, 1);
      this.drawPixelText(resumeTxt, Math.round((w - rw) / 2), by + 34, 1);
    }

    drawGameOverOverlay(w, h) {
      const boxW = Math.round(w * 0.84);
      const boxH = 100;
      const bx = Math.round((w - boxW) / 2);
      const by = Math.round((h - boxH) / 2) - 8;

      this.ctx.fillStyle = this.currentTheme.bg;
      this.ctx.fillRect(bx, by, boxW, boxH);
      this.ctx.strokeStyle = this.currentTheme.pixel;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(bx, by, boxW, boxH);

      const goTxt = "GAME OVER";
      const gw = this.getPixelTextWidth(goTxt, 2);
      this.drawPixelText(goTxt, Math.round((w - gw) / 2), by + 14, 2);

      const scoreTxt = `SCORE: ${this.score}`;
      const sw = this.getPixelTextWidth(scoreTxt, 2);
      this.drawPixelText(scoreTxt, Math.round((w - sw) / 2), by + 38, 2);

      if (this.isNewHigh) {
        const highTxt = "NEW HIGH SCORE!";
        const hw = this.getPixelTextWidth(highTxt, 1);
        this.drawPixelText(highTxt, Math.round((w - hw) / 2), by + 60, 1);
      } else {
        const highTxt = `HIGH: ${this.getHighScore()}`;
        const hw = this.getPixelTextWidth(highTxt, 1);
        this.drawPixelText(highTxt, Math.round((w - hw) / 2), by + 60, 1);
      }

      const contTxt = "TAP OR PRESS 5";
      const cw = this.getPixelTextWidth(contTxt, 1);
      this.drawPixelText(contTxt, Math.round((w - cw) / 2), by + 78, 1);
    }

    handleMenuSelect() {
      window.NokiaSound.select();
      if (this.menuIndex === 0) {
        this.startNewGame();
      } else if (this.menuIndex === 1) {
        this.cycleMaze();
      } else if (this.menuIndex === 2) {
        this.cycleSpeed();
      } else if (this.menuIndex === 3) {
        if (this.ui.openScoresModal) this.ui.openScoresModal();
      }
    }

    bindEvents() {
      // Keyboard input
      window.addEventListener('keydown', (e) => {
        const key = e.key;

        if (this.state === 'MENU') {
          if (key === 'ArrowUp' || key === '2' || key === 'w' || key === 'W') {
            this.menuIndex = (this.menuIndex - 1 + 4) % 4;
            window.NokiaSound.click();
            this.draw();
            e.preventDefault();
          } else if (key === 'ArrowDown' || key === '8' || key === 's' || key === 'S') {
            this.menuIndex = (this.menuIndex + 1) % 4;
            window.NokiaSound.click();
            this.draw();
            e.preventDefault();
          } else if (key === 'Enter' || key === '5' || key === ' ') {
            this.handleMenuSelect();
            e.preventDefault();
          }
          return;
        }

        if (this.state === 'GAMEOVER') {
          if (key === '5' || key === 'Enter' || key === ' ' || key === 'SoftLeft') {
            this.startNewGame();
            e.preventDefault();
          } else if (key === 'Escape' || key === 'Backspace' || key === 'c' || key === 'C') {
            this.state = 'MENU';
            this.draw();
            e.preventDefault();
          }
          return;
        }

        switch (key) {
          case 'ArrowUp':
          case '2':
          case 'w':
          case 'W':
            this.setDirection(0, -1);
            e.preventDefault();
            break;
          case 'ArrowDown':
          case '8':
          case 's':
          case 'S':
            this.setDirection(0, 1);
            e.preventDefault();
            break;
          case 'ArrowLeft':
          case '4':
          case 'a':
          case 'A':
            this.setDirection(-1, 0);
            e.preventDefault();
            break;
          case 'ArrowRight':
          case '6':
          case 'd':
          case 'D':
            this.setDirection(1, 0);
            e.preventDefault();
            break;
          case '5':
          case ' ':
          case 'p':
          case 'P':
            this.togglePause();
            e.preventDefault();
            break;
          case 'Escape':
          case 'Backspace':
          case 'c':
          case 'C':
            this.state = 'MENU';
            window.NokiaSound.click();
            this.draw();
            e.preventDefault();
            break;
        }
      });

      // Window resize
      window.addEventListener('resize', () => {
        this.initDisplay();
        this.draw();
      });

      // Interactive Canvas Touch & Click (Menu row clicking + Direct Speed activation)
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;

      const handleCanvasPointer = (clientX, clientY) => {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        if (this.state === 'MENU') {
          // Check which menu row was clicked
          // Row 0 (Play): y 64 - 88
          // Row 1 (Maze): y 92 - 116
          // Row 2 (Speed): y 120 - 144
          // Row 3 (High Scores): y 148 - 172
          if (clickY >= 60 && clickY < 90) {
            this.menuIndex = 0;
            this.startNewGame();
          } else if (clickY >= 90 && clickY < 118) {
            this.menuIndex = 1;
            this.cycleMaze();
          } else if (clickY >= 118 && clickY < 146) {
            this.menuIndex = 2;
            this.cycleSpeed(); // Instantly increments speed!
          } else if (clickY >= 146 && clickY < 178) {
            this.menuIndex = 3;
            if (this.ui.openScoresModal) this.ui.openScoresModal();
          } else {
            this.handleMenuSelect();
          }
          return;
        }

        if (this.state === 'GAMEOVER') {
          this.startNewGame();
          return;
        }

        if (this.state === 'PAUSED') {
          this.togglePause();
          return;
        }
      };

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = performance.now();
        }
      }, { passive: true });

      this.canvas.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 0) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        const minSwipe = 24;

        if (absX < minSwipe && absY < minSwipe) {
          // Tap on canvas!
          handleCanvasPointer(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
          return;
        }

        // Swipe Gestures
        if (absX > absY) {
          if (deltaX > 0) {
            this.setDirection(1, 0);
          } else {
            this.setDirection(-1, 0);
          }
        } else {
          if (deltaY > 0) {
            if (this.state === 'MENU') {
              this.menuIndex = (this.menuIndex + 1) % 4;
              window.NokiaSound.click();
              this.draw();
            } else {
              this.setDirection(0, 1);
            }
          } else {
            if (this.state === 'MENU') {
              this.menuIndex = (this.menuIndex - 1 + 4) % 4;
              window.NokiaSound.click();
              this.draw();
            } else {
              this.setDirection(0, -1);
            }
          }
        }
      }, { passive: true });

      // Mouse click fallback for desktop
      this.canvas.addEventListener('click', (e) => {
        handleCanvasPointer(e.clientX, e.clientY);
      });
    }
  }

  window.NokiaSnakeGame = SnakeGame;
  window.NOKIA_MAZES = MAZES;
  window.NOKIA_THEMES = THEMES;
  window.NOKIA_SPEEDS = SPEED_LEVELS;

})(window);
