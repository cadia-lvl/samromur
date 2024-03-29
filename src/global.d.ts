declare global {
    var MediaRecorder: any;
    var webkit: any;

    interface Navigator {
        webkitGetUserMedia: any;
        mozGetUserMedia: any;
        standalone?: boolean;
    }

    interface Window {
        [key: string]: any;
    }
}

declare module '*.md';

export {};
