declare class ConsoleLogger {
    private indent;
    constructor(indent: number);
    log(msg: string): void;
    info(msg: string): void;
    success(msg: string): void;
    failure(msg: string): void;
}
export declare class TestRigLogger extends ConsoleLogger {
    constructor();
}
export declare class TestLogger extends ConsoleLogger {
    constructor();
}
export declare class TestConnectorLogger extends ConsoleLogger {
    constructor();
    request(msg: string): void;
}
export {};
