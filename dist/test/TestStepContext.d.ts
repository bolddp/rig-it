import { TestResponse } from '../connector/TestResponse';
import { TestRig } from '../rig/TestRig';
import { Test } from './Test';
export interface TestStepContext {
    /**
     * The test rig that this test step belongs to.
     */
    rig: TestRig;
    /**
     * The test that this test step belongs to.
     */
    test: Test;
    /**
     * This function can be used to remove a success teardown function that was added by a previous test,
     * e.g. if this test performs the same cleanup action as the teardown would.
     * @param id the id of the test whose success teardown function should be removed
     */
    removeSuccessTeardown(id: string): void;
    /**
     * This function can be used to remove a failure teardown function that was added by a previous test,
     * e.g. if this test performs the same cleanup action as the teardown would.
     * @param id the id of the test whose failure teardown function should be removed
     */
    removeFailureTeardown(id: string): void;
}
export interface TestStepResponseContext extends TestStepContext {
    response?: TestResponse;
}
