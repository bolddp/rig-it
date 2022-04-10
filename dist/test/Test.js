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
        var _a, _b, _c, _d, _e, _f, _g, _h;
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
                    (_b = this.config.logger) === null || _b === void 0 ? void 0 : _b.green(TestLogger_1.Indent.TestContent, 'Test succeeded');
                    // Adding teardown entry before the assertion to get proper teardown
                    this.addTeardownEntries({ request, testStepResponseContext });
                    try {
                        yield ((_c = request.assert) === null || _c === void 0 ? void 0 : _c.call(request, testStepResponseContext));
                    }
                    catch (error) {
                        (_d = this.config.logger) === null || _d === void 0 ? void 0 : _d.red(TestLogger_1.Indent.TestContent, `Assertion failed! ${error.message.replace(/[\r\n]/g, ', ')}`);
                        throw new Error('Assertion failed');
                    }
                }
                else {
                    // Expected failure, got success
                    (_e = this.config.logger) === null || _e === void 0 ? void 0 : _e.red(TestLogger_1.Indent.TestContent, 'Test succeeded when expected to fail');
                    throw new Error('Unexpected success');
                }
            }
            else {
                if (!request.assertError) {
                    // Expected success, but the test failed
                    (_f = this.config.logger) === null || _f === void 0 ? void 0 : _f.red(TestLogger_1.Indent.TestContent, 'Test failed');
                    throw new Error('Unexpected failure');
                }
                else {
                    // Expected and got failure
                    (_g = this.config.logger) === null || _g === void 0 ? void 0 : _g.green(TestLogger_1.Indent.TestContent, 'Test failed like expected');
                    this.addTeardownEntries({ request, testStepResponseContext });
                    yield ((_h = request.assertError) === null || _h === void 0 ? void 0 : _h.call(request, testStepResponseContext));
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
