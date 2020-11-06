import { error } from 'console';
import { AudioInfo, AudioError, RecordingError } from '../../../types/audio';

import WavEncoder from './encoder';

export default class Recorder {
    private microphone?: MediaStream;
    private audioContext!: AudioContext;
    private encoder: WavEncoder;

    // Recording
    private sourceNode!: MediaStreamAudioSourceNode;
    private processorNode!: ScriptProcessorNode;
    private sampleRate: number;

    // Analysis
    private analyserNode!: AnalyserNode;
    private jsNode!: ScriptProcessorNode;
    private volumeNode!: GainNode;
    private volumeCallback!: Function;
    private frequencyBins!: Uint8Array;
    private minRecordingMS: number;
    private maxRecordingMS: number;
    private minVolume: number;
    private maxVolume!: number;
    private startTime!: Date;

    // Public
    isRecordingSupported: boolean;
    isRecording!: boolean;

    constructor() {
        this.encoder = new WavEncoder();
        this.sampleRate = 16000; // Initial value
        this.minRecordingMS = 1000; // 1 second
        this.maxRecordingMS = 15000; // 15 seconds
        this.minVolume = 8; // Range: [0, 255]
        this.maxVolume = -1; //
        this.volumeCallback = this.updateVolume.bind(this);
        this.isRecordingSupported =
            this.isAudioRecordingSupported() && this.isMicrophoneSupported();
    }

    private updateVolume = (volume: number) => {
        const { maxVolume } = this;
        if (volume > maxVolume) {
            this.maxVolume = volume;
        }
    };

    // Check all the browser prefixes for microhpone support.
    private isMicrophoneSupported = (): boolean => {
        return !!(
            navigator.mediaDevices?.getUserMedia ||
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
        );
    };

    // Check if audio recording is supported
    private isAudioRecordingSupported = () =>
        typeof window.MediaRecorder !== 'undefined' &&
        !window.MediaRecorder.notSupported;

    /**
     * Checks the data of the analyser node to determine
     * if the maxVolume value needs to be updated and updates it if so.
     */
    private analyze = () => {
        this.analyserNode.getByteFrequencyData(this.frequencyBins);
        if (this.volumeCallback) {
            this.volumeCallback(
                this.frequencyBins.reduce((prev, current) => {
                    return prev > current ? prev : current;
                })
            );
        }
    };

    private isReady = (): boolean => !!this.microphone;

    private getMicrophone(): Promise<MediaStream> {
        return new Promise((resolve, reject) => {
            const options = {
                audio: true,
                channelCount: 1,
            };

            const deny = (error: MediaStreamError) =>
                reject(
                    ({
                        NotAllowedError: AudioError.NOT_ALLOWED,
                        NotFoundError: AudioError.NO_MIC,
                    } as { [errorName: string]: AudioError })[error.name] ||
                        error
                );

            if (navigator.mediaDevices?.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia(options)
                    .then(resolve, deny);
            } else if (navigator.getUserMedia) {
                navigator.getUserMedia(options, resolve, deny);
            } else if (navigator.webkitGetUserMedia) {
                navigator.webkitGetUserMedia(options, resolve, deny);
            } else if (navigator.mozGetUserMedia) {
                navigator.mozGetUserMedia(options, resolve, deny);
            } else {
                // Browser does not support getUserMedia
                reject(AudioError.NO_SUPPORT);
            }
        });
    }

    private start = (): Promise<void> => {
        if (!this.isReady()) {
            console.error('Cannot record audio before microhphone is ready.');
            return Promise.reject();
        }
        this.jsNode.onaudioprocess = this.analyze;

        this.processorNode.onaudioprocess = (ev: AudioProcessingEvent) => {
            this.encoder.postMessage({
                command: 'encode',
                buffer: ev.inputBuffer.getChannelData(0),
            });
        };

        return Promise.resolve();
    };

    private stop = (): Promise<AudioInfo> => {
        if (!this.isReady()) {
            console.error('Cannot stop audio before microphone is ready.');
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            this.processorNode.disconnect();
            this.sourceNode.disconnect();
            this.encoder.onmessage = async (event) => {
                const {
                    data: { blob },
                } = event;
                const url = URL.createObjectURL(blob);
                const duration = await this.getBlobDuration(url);
                resolve({
                    blob,
                    duration,
                    url,
                    sampleRate: this.sampleRate,
                });
            };
            this.encoder.postMessage({
                command: 'finish',
            });
        });
    };

    private getBlobDuration = async (url: string): Promise<number> => {
        return new Promise((resolve) => {
            const tempVideoEl = document.createElement('video');
            tempVideoEl.src = url;
            tempVideoEl.addEventListener('loadedmetadata', () => {
                resolve(tempVideoEl.duration as number);
            });
        });
    };

    /**
     * Initializes the recorder.
     */
    init = async (): Promise<void> => {
        if (this.isReady()) {
            return Promise.reject();
        }

        // Microphone and context
        this.microphone = await this.getMicrophone();
        this.sampleRate = this.microphone.getAudioTracks()[0].getSettings()
            .sampleRate as number;

        this.encoder.postMessage({
            command: 'settings',
            sampleRate: this.sampleRate,
        });

        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)({ sampleRate: this.sampleRate });

        // Input and analysis nodes
        this.sourceNode = this.audioContext.createMediaStreamSource(
            this.microphone
        );
        this.volumeNode = this.audioContext.createGain();
        this.analyserNode = this.audioContext.createAnalyser();

        // Make sure we're doing mono everywhere.
        this.sourceNode.channelCount = 1;
        this.volumeNode.channelCount = 1;
        this.analyserNode.channelCount = 1;

        // Recording node
        this.processorNode = this.sourceNode.context.createScriptProcessor(
            2048,
            1,
            1
        );

        // Set up the analyzer node, and allocate an array for its data
        // FFT size 64 gives us 32 bins. But those bins hold frequencies up to
        // 22kHz or more, and we only care about lower frequencies which is where
        // most human voice lies, so we use fewer bins.
        this.analyserNode.fftSize = 128;
        this.analyserNode.smoothingTimeConstant = 0.96;
        this.frequencyBins = new Uint8Array(
            this.analyserNode.frequencyBinCount
        );

        // Setup jsNode for audio analysis callbacks.
        this.jsNode = this.audioContext.createScriptProcessor(256, 1, 1);
        this.jsNode.connect(this.audioContext.destination);

        // Release microphone to disable tab notification
        this.release();

        return Promise.resolve();
    };

    /**
     * Starts the recording process.
     */
    startRecording = async (): Promise<void> => {
        if (!this.isRecordingSupported) {
            return Promise.reject(AudioError.NO_SUPPORT);
        }
        if (!this.processorNode) {
            //To-do: Throw a predefined error.
            console.error('NO_PROCESSOR_NODE');
            return Promise.reject('NO_PROCESSOR_NODE');
        }
        this.processorNode.connect(this.audioContext.destination);
        if (!this.microphone) {
            this.microphone = await this.getMicrophone();
        }
        this.sourceNode = this.audioContext.createMediaStreamSource(
            this.microphone
        );
        this.sourceNode.channelCount = 1;
        this.sourceNode.connect(this.processorNode);
        this.sourceNode.connect(this.analyserNode);
        await this.start();
        this.isRecording = true;
        this.maxVolume = -1; //
        this.startTime = new Date();
        return Promise.resolve();
    };

    initMicrophone = async (): Promise<void> => {
        this.microphone = await this.getMicrophone();
    };

    stopRecording = async (): Promise<AudioInfo> => {
        this.isRecording = false;
        return this.stop().then((recording: AudioInfo) => {
            const recordingError = this.validateRecording();
            this.release();
            if (recordingError) {
                return Promise.reject(recordingError);
            } else {
                return Promise.resolve(recording);
            }
        });
    };

    validateRecording = (): RecordingError | null => {
        const {
            maxRecordingMS,
            maxVolume,
            minRecordingMS,
            minVolume,
            startTime,
        } = this;

        const duration =
            new Date().getTime() - (startTime ? startTime.getTime() : 0);
        if (duration < minRecordingMS) {
            return RecordingError.TOO_SHORT;
        }
        if (duration > maxRecordingMS) {
            return RecordingError.TOO_LONG;
        }
        if (maxVolume !== -1 && maxVolume < minVolume) {
            return RecordingError.TOO_QUIET;
        }
        return null;
    };

    release = () => {
        if (this.microphone) {
            for (const track of this.microphone.getTracks()) {
                track.stop();
            }
        }

        this.microphone = undefined;
    };
}
