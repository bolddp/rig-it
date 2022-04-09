"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const chalk_1 = __importDefault(require("chalk"));
class ConsoleLogger {
    getIndent(indent) {
        return ' '.repeat(indent * 2);
    }
    log(indent, msg) {
        console.log(`${this.getIndent(indent)}${msg}`);
    }
    white(indent, msg) {
        this.log(indent, chalk_1.default.white(msg));
    }
    blue(indent, msg) {
        this.log(indent, chalk_1.default.blue(msg));
    }
    green(indent, msg) {
        this.log(indent, chalk_1.default.green(msg));
    }
    red(indent, msg) {
        this.log(indent, chalk_1.default.red(msg));
    }
    gray(indent, msg) {
        this.log(indent, chalk_1.default.gray(msg));
    }
}
exports.ConsoleLogger = ConsoleLogger;
