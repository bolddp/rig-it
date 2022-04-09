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
exports.Test = void 0;
const TestLogger_1 = require("../logger/TestLogger");
class Test {
    constructor(config) {
        this.config = config;
    }
    execute(request) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = {
                rig: this.config.rig,
                test: this,
            };
            this.config.logger.white(TestLogger_1.Indent.TestHeader, `Test: ${request.id}`);
            yield ((_a = request.arrange) === null || _a === void 0 ? void 0 : _a.call(request, ctx));
            const ts = Date.now();
            const response = yield request.act(ctx);
            const testStepResponseContext = Object.assign(Object.assign({}, ctx), { response });
            if (response.isOk) {
                if (!request.assertError) {
                    // Expected and got success
                    (_b = this.config.logger) === null || _b === void 0 ? void 0 : _b.green(TestLogger_1.Indent.TestContent, `Success : HTTP ${response.status} - ${JSON.stringify((_c = response.data) !== null && _c !== void 0 ? _c : '').length} bytes in ${Date.now() - ts} ms`);
                    // Adding teardown entry before the assertion to get proper teardown
                    this.addTeardownEntries({ request, testStepResponseContext });
                    try {
                        yield ((_d = request.assert) === null || _d === void 0 ? void 0 : _d.call(request, testStepResponseContext));
                    }
                    catch (error) {
                        (_e = this.config.logger) === null || _e === void 0 ? void 0 : _e.red(TestLogger_1.Indent.TestContent, `Assertion failed! ${error.message.replace(/[\r\n]/g, ', ')}`);
                        throw new Error('Assertion failed');
                    }
                }
                else {
                    // Expected failure, got success
                    (_f = this.config.logger) === null || _f === void 0 ? void 0 : _f.red(TestLogger_1.Indent.TestContent, `Unexpected success : HTTP ${response.status} - ${JSON.stringify((_g = response.data) !== null && _g !== void 0 ? _g : '').length} bytes in ${Date.now() - ts} ms`);
                    throw new Error('Unexpected success');
                }
            }
            else {
                if (!request.assertError) {
                    // Expected success, but the test failed
                    (_h = this.config.logger) === null || _h === void 0 ? void 0 : _h.red(TestLogger_1.Indent.TestContent, `Unexpected failure : HTTP ${response.status} - ${JSON.stringify((_j = response.data) !== null && _j !== void 0 ? _j : '').length} bytes in ${Date.now() - ts} ms`);
                    throw new Error('Unexpected failure');
                }
                else {
                    // Expected and got failure
                    (_k = this.config.logger) === null || _k === void 0 ? void 0 : _k.green(TestLogger_1.Indent.TestContent, `Expected failure : HTTP ${response.status} - ${JSON.stringify((_l = response.data) !== null && _l !== void 0 ? _l : '').length} bytes in ${Date.now() - ts} ms`);
                    this.addTeardownEntries({ request, testStepResponseContext });
                    yield ((_m = request.assertError) === null || _m === void 0 ? void 0 : _m.call(request, testStepResponseContext));
                }
            }
        });
    }
    addTeardownEntries(entry) {
        if (entry.request.onRigSuccessTeardown) {
            this.config.rig.addRigSuccessTeardown(entry);
        }
        if (entry.request.onRigFailureTeardown) {
            this.config.rig.addRigFailureTeardown(entry);
        }
    }
}
exports.Test = Test;
