import { TestResponse } from '../connector/TestResponse';
import { TestRig } from '../rig/TestRig';
import { Test } from './Test';
export interface TestStepContext {
    rig: TestRig;
    test: Test;
}
export interface TestStepResponseContext extends TestStepContext {
    response?: TestResponse;
}
