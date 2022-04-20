import { OptionalTestReporterLoggers, TestReporter } from './TestReporter';
/**
 * Produces indented, colored (and thereby highly readable) logs to console.
 */
export declare class ConsoleReporter implements TestReporter {
    log: OptionalTestReporterLoggers;
    private logRow;
}
