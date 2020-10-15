class WavEncoder {
    private sampleRate: number;
    private numSamples: number;
    private dataViews: DataView[];

    constructor() {
        this.sampleRate = 16000;
        this.numSamples = 0;
        this.dataViews = [];
    }

    setSampleRate = (sampleRate: number) => {
        this.sampleRate = sampleRate;
    }

    encode = (buffer: Float32Array) => {
        const length = buffer.length;
        let view = new DataView(new ArrayBuffer(length * 2));
        let offset = 0;
        for (let i = 0; i < length; i++) {
            let x = buffer[i] * 0x7fff;
            view.setInt16(offset, x < 0 ? Math.max(x, -0x8000) : Math.min(x, 0x7fff), true);
            offset += 2;
        }
        this.dataViews.push(view);
        this.numSamples += length;
    }

    writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    reset = () => {
        this.numSamples = 0;
        this.dataViews = [];
    }

    // Prepend wav header
    finish = (): Promise<Blob> => {
        const dataSize = this.numSamples * 2;
        let view = new DataView(new ArrayBuffer(44));
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        this.writeString(view, 8, 'WAVE');
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, this.sampleRate, true);
        view.setUint32(28, this.sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataSize, true);
        this.dataViews.unshift(view);
        const blob = new Blob(this.dataViews, { type: 'audio/wav' });
        return Promise.resolve(blob);
    }
}

const encoder = new WavEncoder();

export const ctx: Worker = self as any;

const finish = async () => {
    const blob = await encoder.finish();
    encoder.reset();
    ctx.postMessage({
        command: 'finish',
        blob
    });
}

ctx.onmessage = (event) => {
    const data = event.data;
    if (data.command == 'encode') {
        encoder.encode(data.buffer)
    } else if (data.command == 'settings') {
        encoder.setSampleRate(data.sampleRate);
    } else {
        finish();
    }
}

export default ctx;