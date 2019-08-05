import * as dateFns from 'date-fns';
import fs from 'fs';
import DataService from '../src/dataService';

describe('dataService', () => {
    const testData = fs.readFileSync('./test/testPageFor17A.html');

    test('parseTest', async () => {
        fetchMock.mockResponseOnce(testData.toString());

        const ds = new DataService();
        await ds.FetchData();
        expect(ds.GetCenterTime()[0].toJSON()).toBe('2019-08-05T02:46:00.000Z');
        expect(ds.GetEndTime()[0].toJSON()).toBe('2019-08-05T03:04:00.000Z');

    });

    test('filterTest', async () => {
        fetchMock.mockResponseOnce(testData.toString());

        const ds = new DataService();
        await ds.FetchData();
        const [centerRuns, endRuns] = ds.GetClosestRuns(dateFns.parseISO('2019-08-05T06:00:00.000Z'));
        expect(centerRuns[0].toJSON()).toBe('2019-08-05T06:09:00.000Z');
        expect(endRuns[0].toJSON()).toBe('2019-08-05T06:19:00.000Z');

    });

});
