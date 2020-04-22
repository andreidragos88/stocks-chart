export {
    isEmpty,
    appendLeadingZeroes
}

function isEmpty(obj: any) {
    return !Boolean(Object.keys(obj).length);
}

function appendLeadingZeroes(n: number): (string | number) {
    return n <= 9 ? `0${n}` : n;
}
