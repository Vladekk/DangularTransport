// import rp from 'request-promise';

export default class DataService {
  public async FetchData(): Promise<any> {
    const res = await fetch(
      'http://satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte',
    );
    const src = await res.text();
    const dataPattern = /(var data =[^$]+)/s;
    let data: any = null;
    if (src != null) {
      const matches = dataPattern.exec(src);
      if (matches != null && matches.length !== 0) {
        data = JSON.parse(matches[0].replace('var data = ', ''));
      }
    }

    return data;
    // return rp('http://satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte');
  }
}
