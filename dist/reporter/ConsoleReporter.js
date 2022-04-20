"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleReporter = void 0;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Produces indented, colored (and thereby highly readable) logs to console.
 */
class ConsoleReporter {
    constructor() {
        this.log = {
            rig: {
                info: (msg) => this.logRow(0, chalk_1.default.blue(msg)),
                error: (msg) => this.logRow(0, chalk_1.default.red(msg)),
                success: (msg) => this.logRow(0, chalk_1.default.blue(msg)),
            },
            test: {
                info: (msg) => this.logRow(1, chalk_1.default.white(msg)),
                error: (msg) => this.logRow(1, chalk_1.default.red(msg)),
                success: (msg) => this.logRow(1, chalk_1.default.green(msg)),
            },
            testStep: {
                info: (msg) => this.logRow(2, chalk_1.default.gray(msg)),
                error: (msg) => this.logRow(2, chalk_1.default.red(msg)),
                success: (msg) => this.logRow(2, chalk_1.default.green(msg)),
            },
        };
    }
    logRow(indent, msg) {
        console.log(`${' '.repeat(indent * 2)}${msg}`);
    }
}
exports.ConsoleReporter = ConsoleReporter;
