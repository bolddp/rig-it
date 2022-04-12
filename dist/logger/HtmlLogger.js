"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlLogger = void 0;
const whiteColor = '#ffffff';
const blueColor = '#1e90ff';
const greenColor = '#00ff00';
const redColor = '#ff0000';
const grayColor = '#999999';
const indentSize = 4;
class HtmlLogger {
    constructor(callback) {
        this.lines = [];
        this.callback = callback;
    }
    htmlLog(indent, color, msg) {
        this.lines.push(`<p style="color: ${color}">${'&nbsp;'.repeat(indent * indentSize)}${msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')}</p>`);
    }
    printWhite(indent, msg) {
        this.htmlLog(indent, whiteColor, msg);
    }
    printBlue(indent, msg) {
        this.htmlLog(indent, blueColor, msg);
    }
    printGreen(indent, msg) {
        this.htmlLog(indent, greenColor, msg);
    }
    printRed(indent, msg) {
        this.htmlLog(indent, redColor, msg);
    }
    printGray(indent, msg) {
        this.htmlLog(indent, grayColor, msg);
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            const style = `<style>
    p { margin: 0 }
    </style>`;
            const body = `${style}<body style="background-color: #000000; font-family: sans-serif">${this.lines.join('')}</body>`;
            yield this.callback(body);
        });
    }
}
exports.HtmlLogger = HtmlLogger;
