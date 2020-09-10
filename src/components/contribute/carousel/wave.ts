// To-do: throw credit
import { WheelColor } from '../../../types/contribute';
import { getRGBWheelColor } from '../../../utilities/color-utility';

const RATIO = 1;
const WIDTH = RATIO * 320;
const HEIGHT = RATIO * 100;
const IDLE_AMPLITUDE = 0.2;
const PLAY_AMPLITUDE = 0.6;

class Curve {
    baseAmplitude: number;
    private amplitude: number;
    color: number[];
    private ctx: CanvasRenderingContext2D;
    private openClass: number;
    private speed: number;
    private seed: number;
    private tick: number;
    constructor(args: {
        color: WheelColor;
        ctx: CanvasRenderingContext2D;
        speed: number;
        baseAmplitude: number;
    }) {
        this.color = getRGBWheelColor(args.color);
        this.ctx = args.ctx;
        this.speed = args.speed;
        this.baseAmplitude = args.baseAmplitude;
        this.tick = 0;
        this.amplitude = 0.3 + Math.random() * 0.7;
        this.seed = Math.random();
        this.openClass = (5 + Math.random() * 4) | 0;
    }

    respawn() {
        this.amplitude = 0.3 + Math.random() * 0.7;
        this.seed = Math.random();
        this.openClass = (5 + Math.random() * 4) | 0;
    }

    setColor = (color: WheelColor) => {
        this.color = getRGBWheelColor(color);
    }

    private equation(i: number) {
        const y =
            ((-1 *
                Math.abs(Math.sin(this.tick)) *
                this.baseAmplitude *
                this.amplitude *
                HEIGHT) /
                2) *
            (1 / (1 + this.openClass * i ** 2) ** 2);
        if (Math.abs(y) < 0.001) {
            this.respawn();
        }
        return y;
    }

    private _draw(direction: 1 | -1) {
        this.tick += this.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI));

        const ctx = this.ctx;
        ctx.beginPath();

        const xBase = WIDTH / 2 + (-WIDTH / 4 + this.seed * (WIDTH / 2));
        const yBase = HEIGHT / 2;

        let x;
        let y;
        let xInit = 0;

        let i = -3;
        while (i <= 3) {
            x = xBase + (i * WIDTH) / 4;
            y = yBase + direction * this.equation(i);
            xInit = xInit || x;
            ctx.lineTo(x, y);
            i += 0.01;
        }

        const h = Math.abs(this.equation(0));
        const gradient = ctx.createRadialGradient(
            xBase,
            yBase,
            h * 2,
            xBase,
            yBase,
            h * 0.3
        );
        gradient.addColorStop(0, `rgba(${this.color.join(',')},0.1)`);
        gradient.addColorStop(1, `rgba(${this.color.join(',')},0.05)`);

        ctx.fillStyle = gradient;

        ctx.lineTo(xInit, yBase);
        ctx.closePath();

        ctx.fill();
    }

    draw() {
        this._draw(-1);
        this._draw(1);
    }
}

export default class Wave {
    private amplitude = IDLE_AMPLITUDE;
    private ctx: CanvasRenderingContext2D;
    private curves: Curve[];
    private playing = false;
    private speed: number;

    constructor(canvas: HTMLCanvasElement, color: WheelColor) {
        this.speed = 0.08;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvas.style.width = `${WIDTH / RATIO}px`;
        canvas.style.height = `${HEIGHT / RATIO}px`;

        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.curves = Array.from(Array(3).keys()).map(() => new Curve({
            color: color,
            ctx: this.ctx,
            speed: this.speed,
            baseAmplitude: 2 * IDLE_AMPLITUDE,
        }));
        this.draw();
    }

    setColor = (color: WheelColor) => {
        for (const curve of this.curves) {
            curve.setColor(color);
        }
        this.play();
        setTimeout(() => this.pause(), 10);
    }

    private clear() {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.globalCompositeOperation = 'lighter';
    }

    private draw() {
        this.clear();

        const baseAmplitude =
            this.curves[0].baseAmplitude * 0.9 + this.amplitude * 0.1;
        for (const curve of this.curves) {
            curve.baseAmplitude = baseAmplitude;
            curve.draw();
        }

        if (this.playing || Math.abs(baseAmplitude - this.amplitude) > 0.01) {
            requestAnimationFrame(this.draw.bind(this));
        }
    }

    play() {
        this.amplitude = PLAY_AMPLITUDE;
        this.playing = true;
        this.draw();
    }

    pause() {
        this.playing = false;
        this.amplitude = IDLE_AMPLITUDE;
    }
}
