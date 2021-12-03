"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ParseResult {
    constructor(error, node) {
        this.error = error;
        this.node = node;
        this.advance_count = 0;
    }
    register_advancement() {
        this.advance_count++;
    }
    register(result) {
        this.advance_count += result.advance_count;
        if (result.error) {
            this.error = result.error;
        }
        return result.node;
    }
    success(node) {
        this.node = node;
        return this;
    }
    failure(error) {
        if (!this.error || this.advance_count == 0)
            this.error = error;
        return this;
    }
    toString() {
        if (this.node) {
            return this.node.toString();
        }
        return this.node;
    }
}
exports.default = ParseResult;
//# sourceMappingURL=ParseResult.js.map