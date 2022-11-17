"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.HtmlReporter = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class HtmlReporter {
    constructor(config) {
        this.lines = [];
        this.log = {
            rig: {
                info: (msg) => this.htmlLog(0, blueColor, msg),
                error: (msg) => this.htmlLog(0, redColor, msg),
                success: (msg) => this.htmlLog(0, blueColor, msg),
            },
            test: {
                info: (msg) => this.htmlLog(1, whiteColor, msg),
                error: (msg) => this.htmlLog(1, redColor, msg),
                success: (msg) => this.htmlLog(1, greenColor, msg),
            },
            testStep: {
                info: (msg) => this.htmlLog(2, grayColor, msg),
                error: (msg) => this.htmlLog(2, redColor, msg),
                success: (msg) => this.htmlLog(2, greenColor, msg),
            },
        };
        this.config = config;
    }
    htmlLog(indent, color, msg) {
        this.lines.push(`<p style="color: ${color}">${'&nbsp;'.repeat(indent * indentSize)}${msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')}</p>`);
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            const style = `<style>
    p { margin: 0 }
    </style>`;
            const body = `${style}<body style="background-color: #000000; font-family: sans-serif">${this.lines.join('')}</body>`;
            const filePath = path.dirname(this.config.fileName);
            fs.mkdirSync(filePath, { recursive: true });
            fs.writeFileSync(this.config.fileName, body);
        });
    }
}
exports.HtmlReporter = HtmlReporter;
const whiteColor = '#ffffff';
const blueColor = '#1e90ff';
const greenColor = '#00ff00';
const redColor = '#ff0000';
const grayColor = '#999999';
const indentSize = 4;
