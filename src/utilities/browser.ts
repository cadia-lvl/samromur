export const isIOS = (): boolean => {
    return /iPod|iPhone|iPad/i.test(window.navigator.userAgent);
}

export function isMobileSafari(): boolean {
    return (
        isIOS() &&
        !window.navigator.standalone &&
        /AppleWebKit/i.test(window.navigator.userAgent) &&
        !/Chrome|Focus|CriOS|OPiOS|OPT\/|FxiOS|EdgiOS|mercury/i.test(
            window.navigator.userAgent
        )
    );
}

export function getUserAgent(): string {
    return navigator.userAgent;
}