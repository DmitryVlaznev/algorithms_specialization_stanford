const fs = require("fs");
const readline = require("readline");

class InversionsCounter {
    constructor() {
        this.data = [];
        this.auxiliaryArray = [];
        this.inversions = 0n;
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
            crlfDelay: Infinity,
        });

        for await (const line of rl) {
            this.data.push(parseInt(line, 10));
        }
    }

    /**
     * Count inversions.
     *
     * @returns {BigInt} A number of inversions.
     */
    count() {
        let inversions = 0n;

        const l = this.data.length;
        if (l < 2) {
            return inversions;
        }

        this.auxiliaryArray = this.data.slice();
        for (let part = 1; part < l; part = part + part) {
            for (let start = 0; start < l; start += part + part) {
                const mid = start + part - 1;
                inversions += this._merge(start, mid + 1, Math.min(start + part + part - 1, l - 1));
            }
        }
        this.inversions = inversions;
        return inversions;
    }

    /**
     * Merge sorted halves and count inversions.
     *
     * @param {number} start Zero-based index at which the left part is
     * began.
     * @param {number} mid Zero-based index at which the right part is
     * began.
     * @param {number} end Zero-based index at which the right part is
     * end.
     *
     * @returns {number} A number of inversions in the merging parts.
     */
    _merge(start, mid, end) {
        let inversions = 0n;
        if (mid >= this.data.length) {
            return inversions;
        }
        for (let i = start; i <= end; i++) {
            this.auxiliaryArray[i] = this.data[i];
        }

        let l = start;
        let r = mid;
        for (let i = start; i <= end; i++) {
            if (l === mid) {
                this.data[i] = this.auxiliaryArray[r++];
            } else if (r > end) {
                this.data[i] = this.auxiliaryArray[l++];
            } else if (this.auxiliaryArray[r] < this.auxiliaryArray[l]) {
                this.data[i] = this.auxiliaryArray[r++];
                inversions += BigInt(mid - l);
            } else {
                this.data[i] = this.auxiliaryArray[l++];
            }
        }
        return inversions;
    }
}

// const filename = "small_3.txt";
const filename = "IntegerArray.txt";

(async () => {
    console.log("----------------------------------------------------");
    console.log(`STARTED for "${filename}"`);
    console.log("----------------------------------------------------");

    const counter = new InversionsCounter();
    console.log(`Reading a file...`);
    await counter.init(filename);
    console.log(`${counter.data.length} processed.`);
    console.log(`Counting...`);
    console.log("----------------------------------------------------");
    console.log(`The number of inversions is ${counter.count()}.`);
    console.log("----------------------------------------------------");
})()