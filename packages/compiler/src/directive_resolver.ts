export function findLast<T>(arr: T[], condition: (value: T) => boolean): T|null {
    for (let i = arr.length - 1; i >=0; i--) {
        if (condition(arr[i])) {
            return arr[i];
        }
    }
    return null;
}