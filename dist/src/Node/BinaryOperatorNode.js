"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeBase_1 = __importDefault(require("./NodeBase"));
class BinaryOperatorNode extends NodeBase_1.default {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.posStart = this.left.posStart;
        this.posEnd = this.right.posEnd;
    }
    toString() {
        return `(${this.left},${this.operator},${this.right})`;
    }
}
exports.default = BinaryOperatorNode;
//# sourceMappingURL=BinaryOperatorNode.js.map