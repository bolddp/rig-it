import { TestReporter, OptionalTestReporterLoggers } from './TestReporter';
export declare class ConsoleReporter implements TestReporter {
    log: OptionalTestReporterLoggers;
    private logRow;
}
