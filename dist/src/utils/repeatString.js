"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repeatStr = (count, char) => {
    return [...Array(count)].reduce(c => c + char, '');
};
exports.default = repeatStr;
//# sourceMappingURL=repeatString.js.map