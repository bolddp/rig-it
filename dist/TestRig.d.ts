import { TestReporter } from './TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export declare class TestRig {
    private config;
    constructor(config: TestRigConfig);
    run(fnc: (ctx: TestRigRunContext) => Promise<any>): Promise<any>;
}
export interface TestRigConfig {
    reporter?: TestReporter;
}
