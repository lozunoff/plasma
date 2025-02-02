import ReactDOM from 'react-dom';

// TODO: https://github.com/salute-developers/plasma/issues/233
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { flushSync } = ReactDOM as any;

export const IS_REACT_18 = typeof flushSync === 'function';

export function safeFlushSync(fn: () => void): void {
    if (!IS_REACT_18) {
        return fn();
    }

    return flushSync(fn);
}
