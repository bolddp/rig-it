import { TestLogger } from '../logger/TestLogger';
import { TestRig } from '../rig/TestRig';
import { TestRequest } from './TestRequest';
export declare class Test {
    private config;
    constructor(config: TestConfig);
    execute(request: TestRequest): Promise<void>;
    private addTeardownEntries;
}
export interface TestConfig {
    rig: TestRig;
    logger: TestLogger;
}
