"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeReporter = void 0;
class CompositeReporter {
    reporters;
    constructor(reporters) {
        this.reporters = reporters ?? [];
    }
    async setup() {
        this.reporters.forEach((logger) => {
            logger.setup?.();
        });
    }
    log = {
        rig: {
            info: (msg) => this.reporters.forEach((r) => r.log?.rig?.info?.(msg)),
            success: (msg) => this.reporters.forEach((r) => r.log?.rig?.success?.(msg)),
            error: (msg) => this.reporters.forEach((r) => r.log?.rig?.error?.(msg)),
        },
        test: {
            info: (msg) => this.reporters.forEach((r) => r.log?.test?.info?.(msg)),
            success: (msg) => this.reporters.forEach((r) => r.log?.test?.success?.(msg)),
            error: (msg) => this.reporters.forEach((r) => r.log?.test?.error?.(msg)),
        },
        testStep: {
            info: (msg) => this.reporters.forEach((r) => r.log?.testStep?.info?.(msg)),
            success: (msg) => this.reporters.forEach((r) => r.log?.testStep?.success?.(msg)),
            error: (msg) => this.reporters.forEach((r) => r.log?.testStep?.error?.(msg)),
        },
    };
    async reportTestResponse(testId, response) {
        for (const logger of this.reporters) {
            await logger.reportTestResponse?.(testId, response);
        }
    }
    async finish(result) {
        this.reporters.forEach((logger) => {
            logger.finish?.(result);
        });
    }
}
exports.CompositeReporter = CompositeReporter;
