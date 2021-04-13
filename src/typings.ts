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
    headers?: string[];
    headerProvider?: (header: string) => string;
    useKeysAsHeaders?: boolean;
}
