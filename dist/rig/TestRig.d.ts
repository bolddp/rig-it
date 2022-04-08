import { TestReporter } from '../reporter/TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export declare class TestRig {
    private config?;
    constructor(config?: TestRigConfig);
    private createConnector;
    private test;
    run(fnc: (ctx: TestRigRunContext) => Promise<any>): Promise<void>;
}
export interface TestRigConfig {
    name?: string;
    reporter?: TestReporter;
}
