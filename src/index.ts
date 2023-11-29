import '../static/stylesheet/index.css';
import AppIcon from '../static/img/appIcon.png';

import { ImageCache } from './imageCache';
import { GameState } from './gameState';
import { GarbageCan } from './garbageCan';
import { Lives } from './lives';
import { ObjectFactory } from './obstacleFactory';

let gameState: GameState;
let garbageBag: GarbageCan;
let obstacleFactory: ObjectFactory;
let lives: Lives;

let then: number;
let elapsed: number;

const font = new FontFace(
  'Rubik',
  'url(https://fonts.gstatic.com/s/rubik/v28/iJWZBXyIfDnIV5PNhY1KTN7Z-Yh-B4iFV0U1.woff2)',
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
    garbageBag.draw();
    obstacleFactory.draw();
    lives.draw(garbageBag.lives);
  }
}

function drawGameScreen(canvas: HTMLCanvasElement) {
  const container = document.getElementById('app');
  if (container !== null) {
    if (container?.clientWidth > 1024) {
      const onlyForMobile = document.createElement('div');
      onlyForMobile.className = 'desktop-message';
      const onlyForMobileImage = document.createElement('img');
      const onlyForMobileText = document.createElement('h1');
      onlyForMobileText.textContent = 'Only for mobile';
      onlyForMobileImage.src = AppIcon;
      onlyForMobile.appendChild(onlyForMobileImage);
      onlyForMobile.appendChild(onlyForMobileText);
      container.appendChild(onlyForMobile);
    } else {
      container.appendChild(canvas);
    }
  }
}

function setScore(ctx: CanvasRenderingContext2D) {
  ctx.font = '1rem Rubik';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${gameState.score}`, 15, 25);
  ctx.fillText(`High Score: ${gameState.highscore}`, 15, 45);
}

function lostLife() {
  obstacleFactory.reset();
}

function resetGame() {
  garbageBag.reset();
  obstacleFactory.reset();
  gameState.score = 0;
  gameState.highscore = parseInt(localStorage.getItem('highscore') ?? '0', 10);
}

async function mainLoop(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  frameTime?: number,
) {
  if (frameTime) {
    if (!then) {
      then = frameTime;
    }
    elapsed = (frameTime - then) / 1000;

    if (!gameState.isGameScreenDrawn) {
      drawGameScreen(canvas);
      gameState.isGameScreenDrawn = true;
    }

    const collisionType = garbageBag.checkCollision(obstacleFactory, gameState);
    if (collisionType === 'bomb') {
      lostLife();
      if (garbageBag.lives === 0) {
        saveHighscore();
        resetGame();
      }
    }

    update(Math.min(elapsed, 0.1));
    obstacleFactory.create();
    draw(canvas, ctx);
    setScore(ctx);

    then = frameTime;
    window.requestAnimationFrame((time) => mainLoop(canvas, ctx, time));
  } else {
    window.requestAnimationFrame((time) => mainLoop(canvas, ctx, time));
  }
}

async function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
  garbageBag = new GarbageCan(ctx as CanvasRenderingContext2D);
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
