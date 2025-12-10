import Player from '../entities/Player';
import Wall from '../entities/Wall';
import Venture from '../entities/Venture';
import Doomfist from '../entities/Doomfist';
import { CONSTANTS, GAME_STATE } from '../Constant.js';

export default class GameEngine {
    constructor(canvas, updateUICallback) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.updateUI = updateUICallback; // 回调函数，用于把分数传回Vue

        this.player = null;
        this.enemies = [];

        this.score = 0;
        this.doomfistMeter = 0; // 追击进度条
        this.state = GAME_STATE.START;
        this.frameCount = 0;
        this.animationId = null;
    }

    init() {
        this.player = new Player();
        this.enemies = [];
        this.score = 0;
        this.doomfistMeter = 0;
        this.frameCount = 0;
        this.state = GAME_STATE.PLAYING;

        this.loop();
    }

    spawnEnemies() {
        // 随分数增加难度
        const spawnRate = Math.max(60, 150 - Math.floor(this.score / 100));

        if (this.frameCount % spawnRate === 0) {
            const rand = Math.random();
            if (rand < 0.4) {
                this.enemies.push(new Wall());
            } else if (rand < 0.7) {
                this.enemies.push(new Venture());
            } else {
                // 铁拳锁定玩家当前脚下位置，注意修正宽度中心
                this.enemies.push(new Doomfist(this.player.x - 30));
            }
        }
    }

    update() {
        if (this.state !== GAME_STATE.PLAYING) return;

        this.frameCount++;
        this.score += 0.1;

        // 1. 更新玩家
        this.player.update();

        // 2. 更新铁拳追击条 (自然衰减)
        if (this.doomfistMeter > 0) this.doomfistMeter -= 0.05;
        if (this.doomfistMeter >= 100) {
            this.gameOver('被身后的铁拳抓住了！');
            return;
        }

        // 3. 更新所有敌人并检测碰撞
        this.spawnEnemies();

        this.enemies.forEach(enemy => {
            enemy.update();

            const collision = enemy.checkCollision(this.player);
            if (collision.hit) {
                if (collision.damageType === 'kill') {
                    this.gameOver(collision.reason);
                } else if (collision.damageType === 'push') {
                    this.player.knockback();
                    this.doomfistMeter += 30; // 惩罚
                }
            }
        });

        // 4. 清理垃圾
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);

        // 5. 更新 Vue UI
        this.updateUI({
            score: Math.floor(this.score),
            doomMeter: this.doomfistMeter,
            state: this.state
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 画地板
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, CONSTANTS.GROUND_Y + 60, this.canvas.width, 100);

        // 画所有敌人 (注意：先画敌人，特别是在地上的标记，再画人)
        this.enemies.forEach(e => e.draw(this.ctx));

        // 画玩家
        this.player.draw(this.ctx);
    }

    loop() {
        if (this.state !== GAME_STATE.PLAYING) return;
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.loop());
    }

    handleInput(type) {
        if (this.state !== GAME_STATE.PLAYING) return;

        if (type === 'jump') this.player.jump();
        if (type === 'dash') this.player.dashBack();
    }

    gameOver(reason) {
        this.state = GAME_STATE.GAMEOVER;
        cancelAnimationFrame(this.animationId);
        this.updateUI({
            state: this.state,
            deathReason: reason
        });
    }
}