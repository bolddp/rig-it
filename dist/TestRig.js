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
exports.TestRig = void 0;
const TestConnector_1 = require("./TestConnector");
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
class TestRig {
    constructor(config) {
        this.config = config;
    }
    run(fnc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fnc({
                rig: this,
                reporter: this.config.reporter,
                createConnector: (config) => {
                    return new TestConnector_1.TestConnector(this, config);
                },
                test: (request) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d;
                    yield ((_a = request.setup) === null || _a === void 0 ? void 0 : _a.call(request));
                    const rsp = yield request.execute();
                    yield ((_b = request.assert) === null || _b === void 0 ? void 0 : _b.call(request, rsp));
                    yield ((_c = request.assertError) === null || _c === void 0 ? void 0 : _c.call(request, rsp));
                    yield ((_d = request.teardown) === null || _d === void 0 ? void 0 : _d.call(request, rsp));
                }),
            });
        });
    }
}
exports.TestRig = TestRig;
//# sourceMappingURL=TestRig.js.map