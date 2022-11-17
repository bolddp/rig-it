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
class Test {
    constructor(config) {
        this.config = config;
    }
    execute(request) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __awaiter(this, void 0, void 0, function* () {
            const ctx = {
                logger: {
                    info: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                    success: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.success) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                    error: (msg) => { var _a, _b, _c; return (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, msg); },
                },
                removeFailureTeardown: (id) => {
                    var _a, _b, _c;
                    const count = this.config.rig.removeRigFailureTeardown(id);
                    (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, `Removed ${count} failure teardown for test ${id}`);
                },
                removeSuccessTeardown: (id) => {
                    var _a, _b, _c;
                    const count = this.config.rig.removeRigSuccessTeardown(id);
                    (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.testStep) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, `Removed ${count} success teardown for test ${id}`);
                },
            };
            (_c = (_b = (_a = this.config.reporter.log) === null || _a === void 0 ? void 0 : _a.test) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.call(_b, `Test: ${request.id}`);
            if (request.assert && request.assertError) {
                throw new Error(`Invalid setup for test ${request.id}: either assert() or assertError() can be set but not both`);
            }
            yield ((_d = request.arrange) === null || _d === void 0 ? void 0 : _d.call(request, ctx));
            const response = yield request.act(ctx);
            (_f = (_e = this.config.reporter).reportTestResponse) === null || _f === void 0 ? void 0 : _f.call(_e, request.id, response);
            const testStepResponseContext = Object.assign(Object.assign({}, ctx), { response });
            if (response.isOk) {
                if (!request.assertError) {
                    // Expected and got success
                    // Adding teardown entry before the assertion to get proper teardown
                    this.addTeardownEntries({ request, testStepResponseContext });
                    try {
                        yield ((_g = request.assert) === null || _g === void 0 ? void 0 : _g.call(request, testStepResponseContext));
                        (_l = (_k = (_j = (_h = this.config.reporter) === null || _h === void 0 ? void 0 : _h.log) === null || _j === void 0 ? void 0 : _j.testStep) === null || _k === void 0 ? void 0 : _k.success) === null || _l === void 0 ? void 0 : _l.call(_k, 'Test succeeded');
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
                    (_q = (_p = (_o = (_m = this.config.reporter) === null || _m === void 0 ? void 0 : _m.log) === null || _o === void 0 ? void 0 : _o.testStep) === null || _p === void 0 ? void 0 : _p.success) === null || _q === void 0 ? void 0 : _q.call(_p, 'Test failed, which was expected');
                    this.addTeardownEntries({ request, testStepResponseContext });
                    yield ((_r = request.assertError) === null || _r === void 0 ? void 0 : _r.call(request, testStepResponseContext));
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
