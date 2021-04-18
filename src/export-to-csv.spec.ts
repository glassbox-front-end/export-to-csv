import {ExportToCsv} from './export-to-csv';
import {Options} from "./typings";

export enum Keys {
    Name = 'name',
    Age = 'age',
    Average = 'average',
    Approved = 'approved',
    Description = 'description'
}

export const mockData = [
    {
        name: "Test 1",
        age: 13,
        average: 8.2,
        approved: true,
        description: "Test 1 description"
    },
    {
        name: 'Test 2',
        age: 11,
        average: 8.2,
        approved: true,
        description: "Test 2 description"
    },
    {
        name: 'Test 4',
        age: 10,
        average: 8.2,
        approved: true,
        description: "Test 3 description"
    },
];

const missingDataMock = [
    {
        name: 'Test 4',
        average: 8.2,
        approved: true,
        description: "Test 3 description"
    }
]


export const mockKeys = [
    ...Object.values(Keys)
]


describe('ExportToCsv', () => {
    it('should create a comma seperated string', () => {
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            keys: mockKeys
        }

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);
        expect(string).toBeTruthy(typeof string === 'string');
    });

    it('should initiate download through spawned browser', () => {
        if (!window) {
            pending('it should only initiate download when run in browser context');
        }
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            keys: mockKeys
        }

        const exportToCsvInstance = new ExportToCsv(options);
        exportToCsvInstance.generateCsv(mockData);
    });
});

describe('ExportToCsv As A Text File', () => {
    it('should create a comma seperated string', () => {
        const options: Options = {
            title: "Test Csv 1",
            useTextFile: true,
            useBom: true,
            keys: mockKeys
        };

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);
        expect(string).toBeTruthy(typeof string === 'string');
    });

    it('should initiate download through spawned browser', () => {
        if (!window) {
            pending('it should only initiate download when run in browser context');
        }
        const options: Options = {
            filename: "Test Csv 3",
            useTextFile: true,
            useBom: true,
            keys: mockKeys
        };

        const exportToCsvInstance = new ExportToCsv(options);
        exportToCsvInstance.generateCsv(mockData);
    });

    it('should have headers for all columns - even if its missing', () => {
        const options: Options = {
            filename: "Test Csv 3",
            useTextFile: true,
            useBom: true,
            keys: mockKeys
        };
        const exportToCsvInstance = new ExportToCsv(options);
        const csv = exportToCsvInstance.generateCsv(missingDataMock, true);
        expect(csv.split(',').length).toBe(Object.keys(mockKeys).length);
    });
});