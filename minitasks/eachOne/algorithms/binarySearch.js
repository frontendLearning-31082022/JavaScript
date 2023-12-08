function binarySearch(arr, find_val, comparatorObject = null) {
    const comparatorObjectIntegers = {
        comparator: function (a, b) {
            if (a === b) return 0;
            return a > b ? 1 : -1;
        }
    }

    comparatorObject = comparatorObject ? comparatorObject :
        (function recogniseComparatorType() {
            if (!comparatorObject) {
                if (arr.every(x => (typeof x == 'number' && x % 1 == 0))) {
                    return comparatorObjectIntegers;
                } else {
                    throw new Error('not exist code');
                }
            }
        })();

    arr = arr.map((x, i) => { return { val: x, index: i } });
    const iSave = function (a, b) { return comparatorObject.comparator(a.val, b.val); };

    arr.sort(iSave);

    let f = 0; let t = arr.length - 1;
    while (f <= t) {
        const mid = Math.floor(f + (t - f) / 2);
        const cmp = comparatorObject.comparator(find_val, arr[mid].val);
        if (cmp == 0) return arr[mid].index;
        if (cmp == -1) t = mid - 1;
        if (cmp == 1) f = mid + 1;
    }
    return -1;
}

const data_input = [20, 100, 3, 2, 7, 123, 534, 21, 54, 82, 12];
const index = binarySearch(data_input, 7);
console.log(index);

