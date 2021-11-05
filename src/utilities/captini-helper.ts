export const isCaptini = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.pathname == '/captini';
    }
    return false;
};
