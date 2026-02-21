/*
Side Quest 4 — Custom Levels + Grid System (p5.js)

Tiles:
0 = floor
1 = wall
2 = start
3 = exit (locked until all coins collected)
4 = coin
*/

const TS = 32;

// --- LEVEL DATA (custom-designed) ---
const LEVELS = [
  // Level 1: “Warm-up loop”
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 1, 0, 0, 0, 0, 4, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  // Level 2: “Zig-zag corridors”
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 4, 1],
    [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],

  // Level 3: “Keyhole chamber”
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 1, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

let levelIndex = 0;
let grid = [];
let playerR = 1,
  playerC = 1;

let coinsLeft = 0;
let steps = 0;

function setup() {
  loadLevel(0);
  textFont("sans-serif");
  textSize(14);
}

function loadLevel(i) {
  levelIndex = (i + LEVELS.length) % LEVELS.length;

  // Deep copy so we can edit tiles (collect coins, etc.)
  grid = LEVELS[levelIndex].map((row) => row.slice());

  // Find start + count coins
  coinsLeft = 0;
  steps = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 2) {
        playerR = r;
        playerC = c;
        grid[r][c] = 0; // start becomes floor after spawn
      }
      if (grid[r][c] === 4) coinsLeft++;
    }
  }

  const w = grid[0].length * TS;
  const h = grid.length * TS;
  createCanvas(w, h);
}

function draw() {
  background(235);

  drawGrid();
  drawPlayer();
  drawHUD();
}

function drawGrid() {
  noStroke();
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const x = c * TS;
      const y = r * TS;
      const tile = grid[r][c];

      if (tile === 1) {
        fill(35);
        rect(x, y, TS, TS);
      } else {
        fill(245);
        rect(x, y, TS, TS);

        // subtle grid lines
        stroke(220);
        noFill();
        rect(x, y, TS, TS);
        noStroke();
      }

      // coin
      if (tile === 4) {
        fill(255, 200, 0);
        circle(x + TS * 0.5, y + TS * 0.5, TS * 0.45);
      }

      // exit (locked until all coins collected)
      if (tile === 3) {
        if (coinsLeft === 0) fill(80, 200, 120);
        else fill(160);
        rect(x + 5, y + 5, TS - 10, TS - 10, 6);
      }
    }
  }
}

function drawPlayer() {
  fill(255, 80, 80);
  const px = playerC * TS + TS / 2;
  const py = playerR * TS + TS / 2;
  circle(px, py, TS * 0.6);

  // little “eye” so it has direction/character
  fill(255);
  circle(px + TS * 0.12, py - TS * 0.08, TS * 0.18);
  fill(0);
  circle(px + TS * 0.15, py - TS * 0.08, TS * 0.08);
}

function drawHUD() {
  // top-left info box
  fill(255);
  stroke(200);
  rect(8, 8, 320, 64, 10);
  noStroke();
  fill(0);
  text(
    `Level: ${levelIndex + 1}/${LEVELS.length}   Steps: ${steps}\n` +
      `Coins left: ${coinsLeft}   Exit: ${coinsLeft === 0 ? "OPEN" : "LOCKED"}\n` +
      `Move: WASD/Arrows  |  R: Restart  |  N: Next Level`,
    18,
    28,
  );
}

function keyPressed() {
  if (key === "r" || key === "R") loadLevel(levelIndex);
  if (key === "n" || key === "N") loadLevel(levelIndex + 1);

  if (keyCode === LEFT_ARROW || key === "a" || key === "A") tryMove(0, -1);
  if (keyCode === RIGHT_ARROW || key === "d" || key === "D") tryMove(0, 1);
  if (keyCode === UP_ARROW || key === "w" || key === "W") tryMove(-1, 0);
  if (keyCode === DOWN_ARROW || key === "s" || key === "S") tryMove(1, 0);
}

function tryMove(dr, dc) {
  const nr = playerR + dr;
  const nc = playerC + dc;

  // bounds
  if (nr < 0 || nr >= grid.length) return;
  if (nc < 0 || nc >= grid[0].length) return;

  // wall
  if (grid[nr][nc] === 1) return;

  // exit logic
  if (grid[nr][nc] === 3 && coinsLeft > 0) return;

  // coin pickup
  if (grid[nr][nc] === 4) {
    coinsLeft--;
    grid[nr][nc] = 0;
  }

  // move
  playerR = nr;
  playerC = nc;
  steps++;

  // if you step onto open exit, go next level
  if (grid[nr][nc] === 3 && coinsLeft === 0) {
    loadLevel(levelIndex + 1);
  }
}
