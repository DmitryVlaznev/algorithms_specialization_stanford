const fs = require("fs");
const readline = require("readline");

class QuickSort {
    constructor() {
        this.data = [];
    }

    /**
     * Read a data array from a file.
     *
     * @param {string} filename
     */
    async init(filename) {
        const fileStream = fs.createReadStream(filename);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            this.data.push(parseInt(line, 10));
        }
    }

    /**
     * Count inversions.
     *
     * @returns {Object} A number of comparisons: {first: BigInt, last:
     * BigInt, median: BigInt}.
     */
    count() {
        const [left, right] = [0, this.data.length - 1];
        return {
            first: this._sort(this.data.slice(), left, right, "first"),
            last: this._sort(this.data.slice(), left, right, "last"),
            median: this._sort(this.data.slice(), left, right, "median")
        };
    }

    sorted(data) {
        for (let i = 1; i < data.length; i++) {
            if (data[i] < data[i - 1]) {
                console.log(`ERROR!!! i = ${i}, data[i] = ${data[i]}, data[i - 1] = ${data[i - 1]}`);
                return false;
            }
        }
        return true;
    }

    /**
     * Find the pivot index.
     *
     * @param {number} data Data to sort.
     * @param {number} left The left index of a subarray.
     * @param {number} right The right index of a subarray.
     * @param {string} type The pivot selection type:
     * "first"|"last"|median.
     * @returns {number} The pivot index.
     */
    _getPivotIndex(data, left, right, type) {
        switch (type) {
            case "first":
                return left;
            case "last":
                return right;
            case "median":
                const mid = left + Math.floor((right - left) / 2);
                const maxMin = [
                    Math.max(data[left], data[right], data[mid]),
                    Math.min(data[left], data[right], data[mid])
                ];
                if (!maxMin.includes(data[left])) {
                    return left;
                } else if (!maxMin.includes(data[right])) {
                    return right;
                }
                return mid;
        }
    }

    /**
     * Do quick sort.
     *
     * @param {number} data Data to sort.
     * @param {number} left The left index of a subarray.
     * @param {number} right The right index of a subarray.
     * @param {string} type The pivot selection type:
     * "first"|"last"|median.
     * @returns {number} The number of comparisons.
     */
    _sort(data, left, right, type) {
        let comparisons = right - left;
        let pivot = this._getPivotIndex(data, left, right, type);
        pivot = this._partition(data, left, right, pivot);

        if (pivot - 1 > left) {
            comparisons += this._sort(data, left, pivot - 1, type);
        }
        if (pivot + 1 < right) {
            comparisons += this._sort(data, pivot + 1, right, type);
        }
        return comparisons;
    }

    /**
     * Partition a subarray.
     *
     * @param {number} data Data to sort.
     * @param {number} left The left index of a subarray.
     * @param {number} right The right index of a subarray.
     * @param {number} pivot The pivot index.
     * @returns {number} The new pivot index.
     */
    _partition(data, left, right, pivot) {
        if (right - left < 1) {
            return pivot;
        }
        if (pivot != left) {
            [data[pivot], data[left]] = [data[left], data[pivot]];
        }

        let [i, j] = [left + 1, left + 1];
        while (j <= right) {
            if (data[left] > data[j]) {
                [data[j++], data[i++]] = [data[i], data[j]];
            } else {
                j++;
            }
        }
        [data[left], data[i - 1]] = [data[i - 1], data[left]];
        return i - 1;
    }
}

const filename = "QuickSort.txt";

(async () => {
    console.log("----------------------------------------------------");
    console.log(`STARTED for "${filename}"`);
    console.log("----------------------------------------------------");

    const counter = new QuickSort();
    console.log(`Reading a file...`);
    await counter.init(filename);
    console.log(`${counter.data.length} processed.`);
    console.log(`Counting...`);
    console.log("----------------------------------------------------");

    const res = counter.count()
    console.log(`The number of comparisons are:`);
    console.log(`    for the first pivot "${res.first}"`);
    console.log(`    for the last pivot "${res.last}"`);
    console.log(`    for the median pivot "${res.median}"`);
    console.log("----------------------------------------------------");
})();
