export interface Options {
    filename?: string;
    fieldSeparator?: string;
    quoteStrings?: string;
    decimalSeparator?: string;
    showLabels?: boolean;
    showTitle?: boolean;
    title?: string;
    useTextFile?: boolean,
    useBom?: boolean;
    valueFallback?: string;
    headers?: Record<string, string>;
    keys: string[]; //Keys is the connection between the headers and the data, also this will be the columns order
}