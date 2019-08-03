import fs from 'fs';
import DataService from '../src/dataService';

describe('dataService', () => {
  const testData = fs.readFileSync('./test/testPageFor17A.html');

  test('test1', async () => {
    fetchMock.mockResponseOnce(testData.toString());

    const ds = new DataService();
    const data = ds.FetchData();
    const d = await data;
    expect(d).toBe(testData);
  });
});
