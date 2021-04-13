import {Options} from "./typings";
import {ConfigDefaults, CsvConfigConsts} from "./consts";
import {isFloat, objectAssign} from "./utils";

export class ExportToCsv {

    private _data: any[];
    private _options: Options;

    get options(): Options {
        return this._options;
    }

    set options(options: Options) {
        this._options = objectAssign({}, ConfigDefaults, options);
    }

    constructor(options?: Options) {
        this.options = options || {};
    }

    generateCsv(jsonData: any, shouldReturnCsv: boolean = false): void | any {
        let csv = ''

        this.parseData(jsonData);

        if (this.options.useBom) {
            csv += CsvConfigConsts.BOM;
        }

        if (this.options.showTitle) {
            csv += this.options.title + '\r\n\n';
        }

        csv += this.getHeaders();
        csv += this.getBody();

        if (csv == '') {
            console.log("Invalid data");
            return;
        }

        if (shouldReturnCsv) {
            return csv;
        }

        this.downloadCsv(csv);
    }

    private getHeaders(): string {
        let headers = '';

        if (!this.options.showLabels) {
            return;
        }

        this.options.keys.forEach(key => {
            headers += this.options.headers[key] + this.options.fieldSeparator;
        });

        headers = headers.slice(0, -1) + CsvConfigConsts.EOL;

        return headers;
    }

    private getBody(): string {
        let body = '';

        const keys = this.options.keys;
        for (let i = 0; i < this._data.length; i++) {
            let row = '';
            for (let keyPos = 0; keyPos < keys.length; keyPos++) {
                const key = keys[keyPos];
                row += this.formatData(this._data[i][key]) + this.options.fieldSeparator;
            }

            row = row.slice(0, -1);
            body += row + CsvConfigConsts.EOL;
        }

        return body;
    }

    private formatData(data: any) {
        if (!data) {
            return this.options.valueFallback;
        }

        if (this.options.decimalSeparator === 'locale' && isFloat(data)) {
            return data.toLocaleString();
        }

        if (this.options.decimalSeparator !== '.' && isFloat(data)) {
            return data.toString().replace('.', this.options.decimalSeparator);
        }

        if (typeof data === 'string') {
            data = data.replace(/"/g, '""');
            if (this.options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
                data = this.options.quoteStrings + data + this.options.quoteStrings;
            }
            return data;
        }

        if (typeof data === 'boolean') {
            return data ? 'TRUE' : 'FALSE';
        }
        return data;
    }

    private parseData(jsonData: any): any[] {
        this._data = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

        return this._data;
    }

    private downloadCsv(csv: string) {
        const FileType = this.options.useTextFile ? 'plain' : 'csv';
        const fileExtension = this.options.useTextFile ? '.txt' : '.csv';
        let blob = new Blob([csv], {"type": "text/" + FileType + ";charset=utf8;"});

        if (navigator.msSaveBlob) {
            let filename = this.options.filename.replace(/ /g, "_") + fileExtension;
            navigator.msSaveBlob(blob, filename);
            return;
        }

        const attachmentType = this.options.useTextFile ? 'text' : 'csv';
        let uri = 'data:attachment/' + attachmentType + ';charset=utf-8,' + encodeURI(csv);
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);

        link.setAttribute('visibility', 'hidden');
        link.download = this.options.filename.replace(/ /g, "_") + fileExtension;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
}