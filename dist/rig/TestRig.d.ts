import { TestLogger } from '../logger/TestLogger';
import { TestReporter } from '../reporter/TestReporter';
import { TeardownEntry } from './TeardownEntry';
import { CompositeLogger } from '../logger/CompositeLogger';
import { TestRigRunContext } from './TestRigRunContext';
export declare type TestRigRunFunction = (ctx: TestRigRunContext) => Promise<any>;
export interface TestRigConfig {
    loggers?: TestLogger[];
    name?: string;
    reporter?: TestReporter;
}
/**
 * The test rig keeps track of the execution of an integration test: running tests, keeping
 * track of any teardown necessary and producing test results.
 */
export declare class TestRig {
    private config?;
    private logger;
    private rigFailureTeardownEntries;
    private rigSuccessTeardownEntries;
    constructor(config?: TestRigConfig);
    createCompositeLogger(loggers?: TestLogger[]): CompositeLogger;
    run(fnc: TestRigRunFunction): Promise<void>;
    addRigFailureTeardown(entry: TeardownEntry): void;
    addRigSuccessTeardown(entry: TeardownEntry): void;
    removeRigFailureTeardown(id: string): number;
    removeRigSuccessTeardown(id: string): number;
    performSuccessTeardown(): Promise<void>;
    performFailureTeardown(): Promise<void>;
}
