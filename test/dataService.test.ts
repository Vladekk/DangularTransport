import fs from 'fs';
import DataService from '../src/dataService';

describe('dataService', () => {
    const testData = fs.readFileSync('./test/testPageFor17A.html');

    test('parseTest', async () => {
        fetchMock.mockResponseOnce(testData.toString());

        const ds = new DataService();
        await ds.FetchData();

        expect(ds.GetCenterTime()[0].getHours()).toBe(5);
        expect(ds.GetCenterTime()[0].getMinutes()).toBe(46);
        expect(ds.GetEndTime()[0].getHours()).toBe(6);
        expect(ds.GetEndTime()[0].getMinutes()).toBe(4);

    });

    test('filterTest', async () => {
        fetchMock.mockResponseOnce(testData.toString());

        const ds = new DataService();
        await ds.FetchData();
        const since = new Date();
        since.setHours(6, 0, 0, 0);

        const [centerRuns, endRuns] = ds.GetClosestRuns(since);
        expect(centerRuns[0].getHours()).toBe(6);
        expect(centerRuns[0].getMinutes()).toBe(0);
        expect(endRuns[0].getHours()).toBe(6);
        expect(endRuns[0].getMinutes()).toBe(4);

    });

});
