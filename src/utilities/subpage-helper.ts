export const isCaptini = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.pathname == '/captini';
    }
    return false;
};

export const isL2 = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.pathname == '/l2';
    }
    return false;
};

export const isParallel = (): boolean => {
    if (typeof window !== 'undefined') {
        return window.location.pathname == '/parallel';
    }
    return false;
};
