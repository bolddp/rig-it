import { TestLogger } from '../logger/TestLogger';
import { TestReporter } from '../reporter/TestReporter';
import { TestRigRunContext } from './TestRigRunContext';
import { TeardownEntry } from './TeardownEntry';
import { CompositeLogger } from '../logger/CompositeLogger';
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
    run(fnc: (ctx: TestRigRunContext) => Promise<any>): Promise<void>;
    addRigFailureTeardown(entry: TeardownEntry): void;
    addRigSuccessTeardown(entry: TeardownEntry): void;
    removeRigFailureTeardown(id: string): void;
    removeRigSuccessTeardown(id: string): void;
    performSuccessTeardown(): Promise<void>;
    performFailureTeardown(): Promise<void>;
}
export interface TestRigConfig {
    loggers?: TestLogger[];
    name?: string;
    reporter?: TestReporter;
}
