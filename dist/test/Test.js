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
                removeFailureTeardown: (id) => {
                    const count = this.config.rig.removeRigFailureTeardown(id);
                    this.config.logger.printGray(TestLogger_1.Indent.TestContent, `Removed ${count} failure teardown for test ${id}`);
                },
                removeSuccessTeardown: (id) => {
                    const count = this.config.rig.removeRigSuccessTeardown(id);
                    this.config.logger.printGray(TestLogger_1.Indent.TestContent, `Removed ${count} success teardown for test ${id}`);
                },
            };
            this.config.logger.printWhite(TestLogger_1.Indent.TestHeader, `Test: ${request.id}`);
            if (request.assert && request.assertError) {
                throw new Error(`Invalid setup for test ${request.id}: either assert() or assertError() can be set but not both`);
            }
            yield ((_a = request.arrange) === null || _a === void 0 ? void 0 : _a.call(request, ctx));
            const response = yield request.act(ctx);
            (_c = (_b = this.config.logger).reportTestResponse) === null || _c === void 0 ? void 0 : _c.call(_b, {
                testRigName: (_d = this.config.rig.getConfig()) === null || _d === void 0 ? void 0 : _d.name,
                testId: request.id,
                response,
            });
            const testStepResponseContext = Object.assign(Object.assign({}, ctx), { response });
            if (response.isOk) {
                if (!request.assertError) {
                    // Expected and got success
                    // Adding teardown entry before the assertion to get proper teardown
                    this.addTeardownEntries({ request, testStepResponseContext });
                    try {
                        yield ((_e = request.assert) === null || _e === void 0 ? void 0 : _e.call(request, testStepResponseContext));
                        (_f = this.config.logger) === null || _f === void 0 ? void 0 : _f.printGreen(TestLogger_1.Indent.TestContent, 'Test succeeded');
                    }
                    catch (error) {
                        throw new Error(`Assertion failed! ${error.message.replace(/[\r\n]/g, ', ')}`);
                    }
                }
                else {
                    // Expected failure, got success
                    // this.config.logger?.red(Indent.TestContent, 'Test succeeded when expected to fail');
                    throw new Error('Unexpected success');
                }
            }
            else {
                if (!request.assertError) {
                    // Expected success, but the test failed
                    // this.config.logger?.red(Indent.TestContent, 'Test failed');
                    throw new Error('Unexpected failure');
                }
                else {
                    // Expected and got failure
                    (_g = this.config.logger) === null || _g === void 0 ? void 0 : _g.printGreen(TestLogger_1.Indent.TestContent, 'Test failed, which was expected');
                    this.addTeardownEntries({ request, testStepResponseContext });
                    yield ((_h = request.assertError) === null || _h === void 0 ? void 0 : _h.call(request, testStepResponseContext));
                }
            }
            return response.data;
        });
    }
    addTeardownEntries(entry) {
        if (entry.request.rigSuccessTeardown) {
            this.config.rig.addRigSuccessTeardown(entry);
        }
        if (entry.request.rigFailureTeardown) {
            this.config.rig.addRigFailureTeardown(entry);
        }
    }
}
exports.Test = Test;
