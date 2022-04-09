import { TestRequest } from '../test/TestRequest';
import { TestStepResponseContext } from '../test/TestStepContext';
export interface TeardownEntry {
    request: TestRequest;
    testStepResponseContext: TestStepResponseContext;
}
