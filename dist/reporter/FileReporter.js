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
exports.FileReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Test reporter that logs to file. This includes the responses from the tests, if
 * the FileReporterConfig.testResponseFileNameResolver property is set.
 *
 * If the path of a file that is about to be written by the reporter doesn't exist,
 * the reporter will try to create it.
 */
class FileReporter {
    constructor(config) {
        this.logRows = [];
        this.log = {
            rig: {
                info: (msg) => this.logRow(0, msg),
                error: (msg) => this.logRow(0, msg),
                success: (msg) => this.logRow(0, msg),
            },
            test: {
                info: (msg) => this.logRow(1, msg),
                error: (msg) => this.logRow(1, msg),
                success: (msg) => this.logRow(1, msg),
            },
            testStep: {
                info: (msg) => this.logRow(2, msg),
                error: (msg) => this.logRow(2, msg),
                success: (msg) => this.logRow(2, msg),
            },
        };
        this.config = config;
    }
    reportTestResponse(testId, response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = (_b = (_a = this.config).testResponseFileNameResolver) === null || _b === void 0 ? void 0 : _b.call(_a, testId);
            if (fileName) {
                yield this.writeFile({
                    fileName,
                    fileContents: JSON.stringify(response, null, 2),
                });
            }
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileName = this.config.logsFileName;
            if (fileName) {
                yield this.writeFile({
                    fileName,
                    fileContents: this.logRows.join('\r\n'),
                });
            }
        });
    }
    logRow(indent, msg) {
        this.logRows.push(`${' '.repeat(indent * 2)}${msg}`);
    }
    writeFile(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.dirname(params.fileName);
            fs.mkdirSync(filePath, { recursive: true });
            fs.writeFileSync(params.fileName, params.fileContents);
        });
    }
}
exports.FileReporter = FileReporter;
