import {Options} from "./typings";
import {ConfigDefaults, CsvConfigConsts} from "./consts";
import {isFloat, objectAssign} from "./utils";

export class ExportToCsv {

    private _data: any[];
    private _options: Options;
    private _csv = "";

    get options(): Options {
        return this._options;
    }

    set options(options: Options) {
        this._options = objectAssign({}, ConfigDefaults, options);
    }

    constructor(options?: Options) {
        let config = options || {};

        this._options = objectAssign({}, ConfigDefaults, config);

        if (
            this._options.useKeysAsHeaders
            && this._options.headers
            && this._options.headers.length > 0
        ) {
            console.warn('Option to use object keys as headers was set, but headers were still passed!');
        }
    }

    /**
     * Generate and Download Csv
     */
    generateCsv(jsonData: any, shouldReturnCsv: boolean = false): void | any {

        // Make sure to reset csv data on each run
        this._csv = '';

        this._parseData(jsonData);

        if (this._options.useBom) {
            this._csv += CsvConfigConsts.BOM;
        }

        if (this._options.showTitle) {
            this._csv += this._options.title + '\r\n\n';
        }

        this.addHeaders();
        this.addBody();

        if (this._csv == '') {
            console.log("Invalid data");
            return;
        }

        // When the consumer asks for the data, exit the function
        // by returning the CSV data built at this point
        if (shouldReturnCsv) {
            return this._csv;
        }

        // Create CSV blob to download if requesting in the browser and the
        // consumer doesn't set the shouldReturnCsv param
        const FileType = this._options.useTextFile ? 'plain' : 'csv';
        const fileExtension = this._options.useTextFile ? '.txt' : '.csv';
        let blob = new Blob([this._csv], {"type": "text/" + FileType + ";charset=utf8;"});

        if (navigator.msSaveBlob) {
            let filename = this._options.filename.replace(/ /g, "_") + fileExtension;
            navigator.msSaveBlob(blob, filename);
        } else {
            const attachmentType = this._options.useTextFile ? 'text' : 'csv';
            let uri = 'data:attachment/' + attachmentType + ';charset=utf-8,' + encodeURI(this._csv);
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);

            link.setAttribute('visibility', 'hidden');
            link.download = this._options.filename.replace(/ /g, "_") + fileExtension;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Create Headers
     */
    private addHeaders(): void {
        if (!this._options.showLabels && !this._options.useKeysAsHeaders) {
            return;
        }

        const headersKeys: string[] = this.getKeys()

        if (headersKeys.length > 0) {
            let row = "";
            for (let keyPos = 0; keyPos < headersKeys.length; keyPos++) {
                row += this._options.headerProvider(headersKeys[keyPos]) + this._options.fieldSeparator;
            }

            row = row.slice(0, -1);
            this._csv += row + CsvConfigConsts.EOL;
        }
    }

    /**
     * Create Body
     */
    private addBody() {
        const keys = this.getKeys();
        for (let i = 0; i < this._data.length; i++) {
            let row = '';
            for (let keyPos = 0; keyPos < keys.length; keyPos++) {
                const key = keys[keyPos];
                row += this._formatData(this._data[i][key]) + this._options.fieldSeparator;
            }

            row = row.slice(0, -1);
            this._csv += row + CsvConfigConsts.EOL;
        }
    }

    /**
     * Format Data
     * @param {any} data
     */
    private _formatData(data: any) {
        if (!data) {
            return this._options.valueFallback;
        }

        if (this._options.decimalSeparator === 'locale' && isFloat(data)) {
            return data.toLocaleString();
        }

        if (this._options.decimalSeparator !== '.' && isFloat(data)) {
            return data.toString().replace('.', this._options.decimalSeparator);
        }

        if (typeof data === 'string') {
            data = data.replace(/"/g, '""');
            if (this._options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
                data = this._options.quoteStrings + data + this._options.quoteStrings;
            }
            return data;
        }

        if (typeof data === 'boolean') {
            return data ? 'TRUE' : 'FALSE';
        }
        return data;
    }

    /**
     * Parse the collection given to it
     *
     * @private
     * @param {*} jsonData
     * @returns {any[]}
     * @memberof ExportToCsv
     */
    private _parseData(jsonData: any): any[] {
        this._data = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

        return this._data;
    }

    private getKeys() {
        return this._options.useKeysAsHeaders ? Object.keys(this._data[0]): this._options.headers;
    }
}
