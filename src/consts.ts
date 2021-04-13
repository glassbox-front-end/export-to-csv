import {Options} from "./typings";

export class CsvConfigConsts {
    public static EOL = "\r\n";
    public static BOM = "\ufeff";
    public static DEFAULT_FIELD_SEPARATOR = ',';
    public static DEFAULT_DECIMAL_SEPARATOR = '.';
    public static DEFAULT_QUOTE = '"';
    public static DEFAULT_SHOW_TITLE = false;
    public static DEFAULT_TITLE = 'My Generated Report';
    public static DEFAULT_FILENAME = 'generated';
    public static DEFAULT_SHOW_LABELS = false;
    public static DEFAULT_USE_TEXT_FILE = false;
    public static DEFAULT_USE_BOM = true;
    public static DEFAULT_HEADER = {};
    public static DEFAULT_KEYS_AS_HEADERS = false;
    public static VALUE_FALLBACK = '';
}

export const ConfigDefaults: Options = {
    filename: CsvConfigConsts.DEFAULT_FILENAME,
    fieldSeparator: CsvConfigConsts.DEFAULT_FIELD_SEPARATOR,
    quoteStrings: CsvConfigConsts.DEFAULT_QUOTE,
    decimalSeparator: CsvConfigConsts.DEFAULT_DECIMAL_SEPARATOR,
    showLabels: CsvConfigConsts.DEFAULT_SHOW_LABELS,
    showTitle: CsvConfigConsts.DEFAULT_SHOW_TITLE,
    title: CsvConfigConsts.DEFAULT_TITLE,
    useTextFile: CsvConfigConsts.DEFAULT_USE_TEXT_FILE,
    useBom: CsvConfigConsts.DEFAULT_USE_BOM,
    headers: CsvConfigConsts.DEFAULT_HEADER,
    valueFallback: CsvConfigConsts.VALUE_FALLBACK,
};