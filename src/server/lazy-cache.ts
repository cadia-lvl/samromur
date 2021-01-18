type Fn<T, S> = (...args: S[]) => Promise<T>;

function isExpired(at: number, timeMs: number) {
    return Date.now() - at > timeMs;
}

export default function lazyCache<T, S>(f: Fn<T, S>, timeMs: number): Fn<T, S> {
    const caches: {
        [key: string]: { at: number; value: T };
    } = {};
    return async (...args) => {
        const key = JSON.stringify(args);

        let cached = caches[key];
        if (cached) {
            const { at, value } = cached;
            if (!isExpired(at, timeMs)) {
                return value;
            }
        }

        return new Promise(async (resolve) => {
            let a = {
                at: Date.now(),
                value: await f(...args),
            };
            caches[key] = a;
            resolve(a.value);
        });
    };
}
