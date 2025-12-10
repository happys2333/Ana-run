import Entity from './Entity';
import { CONSTANTS } from '../Constant.js';

export default class Player extends Entity {
    constructor() {
        super(
            CONSTANTS.PLAYER_DEFAULT_X,
            CONSTANTS.GROUND_Y,
            40,
            60,
            '#6395ec'
        );
        this.vy = 0;
        this.isGrounded = true;
    }

    update() {

        if (!this.isGrounded) {
            this.vy += CONSTANTS.GRAVITY;
            this.y += this.vy;
        }


        if (this.y >= CONSTANTS.GROUND_Y) {
            this.y = CONSTANTS.GROUND_Y;
            this.vy = 0;
            this.isGrounded = true;
        }


        if (this.x < CONSTANTS.PLAYER_DEFAULT_X) {
            this.x += CONSTANTS.RECOVERY_SPEED;
        } else if (this.x > CONSTANTS.PLAYER_DEFAULT_X) {
            this.x = CONSTANTS.PLAYER_DEFAULT_X;
        }
    }

    jump() {
        if (this.isGrounded) {
            this.vy = CONSTANTS.JUMP_FORCE;
            this.isGrounded = false;
        }
    }


    dashBack() {
        if (this.x > 50) {
            this.x -= 150;
        }
    }


    knockback() {
        this.x -= 50;
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x + 25, this.y + 10, 10, 10);
    }
}