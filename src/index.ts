import '../static/stylesheet/index.css';

import { ImageCache } from './imageCache';
import { GameState } from './gameState';
import { GarbageCan } from './garbageCan';
import { Lives } from './lives';
import { ObjectFactory } from './obstacleFactory';

let gameState: GameState;
let garbageCan: GarbageCan;
let obstacleFactory: ObjectFactory;
let lives: Lives;

let then: number;
let elapsed: number;

const font = new FontFace(
  'Rubik',
  'url(https://fonts.gstatic.com/s/archivo/v19/k3k6o8UDI-1M0wlSV9XAw6lQkqWY8Q82sJaRE-NWIDdgffTTNDNZ9xdp.woff2)',
  {
    weight: '400',
    style: 'normal',
    unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
);

async function saveHighscore() {
  const highscore = Math.max(gameState.score, gameState.highscore);
  localStorage.setItem('highscore', highscore.toString(10));
}

function update(secondsPassed: number = 1) {
  obstacleFactory.update(secondsPassed);
  obstacleFactory.deleteObjectOffScreen();
}

async function draw(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  if (ctx !== null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(ImageCache.getBackground(gameState.backgroundKey), 0, 0);
    garbageCan.draw();
    obstacleFactory.draw();
    lives.draw(garbageCan.lives);
  }
}

function drawMainMenu() {
  const container = document.getElementById('app');
  if (container !== null) {
    const { firstChild } = container;
    if (firstChild) {
      container.removeChild(firstChild);
    }

    const mainMenuContainer = document.createElement('div');
    mainMenuContainer.className = 'mainMenuContainer';

    const gameTitle = document.createElement('div');
    gameTitle.className = 'mainMenuTitle';
    gameTitle.innerHTML = 'Garbage Drop';
    const startButton = document.createElement('button');
    startButton.className = 'mainMenuButton';
    startButton.innerHTML = 'Start';
    startButton.addEventListener('click', () => {
      gameState.isInMenu = false;
      gameState.isGameRunning = true;
    });

    mainMenuContainer.appendChild(gameTitle);
    mainMenuContainer.appendChild(startButton);

    container.appendChild(mainMenuContainer);
  }
}

function drawGameScreen(canvas: HTMLCanvasElement) {
  const container = document.getElementById('app');
  if (container !== null) {
    const { firstChild } = container;
    if (firstChild) {
      container.removeChild(firstChild);
    }

    container.appendChild(canvas);
  }
}

function setScore(ctx: CanvasRenderingContext2D) {
  ctx.font = '4rem Archivo';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${gameState.score}`, 15, 50);
  ctx.fillText(`High Score: ${gameState.highscore}`, 15, 100);
}

function loseAHeart() {
  obstacleFactory.reset();
}

function resetGame() {
  garbageCan.reset();
  obstacleFactory.reset();
  gameState.score = 0;
  gameState.highscore = parseInt(localStorage.getItem('highscore') ?? '0', 10);

  gameState.reset();
}

async function mainLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  frameTime?: number,
) {
  if (gameState.isInMenu && !gameState.isGameMenuDrawn) {
    drawMainMenu();
    gameState.isGameMenuDrawn = true;
  } else if (gameState.isGameRunning) {
    if (frameTime) {
      if (!then) {
        then = frameTime;
      }
      elapsed = (frameTime - then) / 1000;

      if (!gameState.isGameScreenDrawn) {
        drawGameScreen(canvas);
        gameState.isGameScreenDrawn = true;
      }

      const collisionType = garbageCan.checkCollision(obstacleFactory, gameState);
      if (collisionType === 'bomb') {
        loseAHeart();
      }

      update(Math.min(elapsed, 0.1));
      obstacleFactory.create();
      draw(canvas, ctx);
      setScore(ctx);

      if (garbageCan.isDead()) {
        saveHighscore();
        resetGame();
      }

      then = frameTime;
    }
  }

  window.requestAnimationFrame((time) => mainLoop(canvas, ctx, time));
}

async function resizeCanvas(canvas: HTMLCanvasElement) {
  await ImageCache.loadAllImages(canvas);
}

function preventMotion(event: Event) {
  window.scrollTo(0, 0);
  event.preventDefault();
  event.stopPropagation();
}

async function init() {
  window.addEventListener('scroll', preventMotion, false);
  window.addEventListener('touchmove', preventMotion, false);

  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  (ctx as CanvasRenderingContext2D).imageSmoothingEnabled = false;

  window.addEventListener('resize', () => resizeCanvas(canvas), false);
  window.addEventListener('orientationchange', () => resizeCanvas(canvas), false);
  await resizeCanvas(canvas);

  return {
    canvas,
    ctx,
  };
}

async function startGame() {
  const {
    canvas,
    ctx,
  } = await init();

  gameState = new GameState();
  garbageCan = new GarbageCan(ctx as CanvasRenderingContext2D);
  obstacleFactory = new ObjectFactory(ctx as CanvasRenderingContext2D);
  lives = new Lives(ctx as CanvasRenderingContext2D);

  const loadedFont = await font.load();
  document.fonts.add(loadedFont);

  if (ctx !== null) {
    await mainLoop(canvas, ctx);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  startGame();
});
