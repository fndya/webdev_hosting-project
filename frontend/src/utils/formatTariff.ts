export function getCoreWord(count: number): string {
    if (count % 10 === 1 && count % 100 !== 11) {
        return "ядро";
    }

    if (
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
    ) {
        return "ядра";
    }

    return "ядер";
}