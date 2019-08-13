/* tslint:disable:object-literal-sort-keys */
import * as dateFns from 'date-fns'
import {CloudflareDefaultCacheStorage} from 'types-cloudflare-worker';
import {IRoute} from '../../DT-UI/src/app/IRoute';
import {Route} from '../../DT-UI/src/app/Route';
import {IDictionary} from './IDictionary';
import {ISimpleLogService} from './ISimpleLogService';
import {RouteDataProxy} from './RouteData';


export default class DataService {


    private _fromEndHolidayTimes: Date[];
    private _fromCenterHolidayTimes: Date[];
    private _fromCenterTimes: Date[];
    private _fromEndTimes: Date[];

    private allSchedules: IDictionary<string> = {
        '1': 'http://www.satiksme.daugavpils.lv/autobuss-nr-1-autoosta-regionala-slimnica-celinieku-ciemats',
        '2': 'http://www.satiksme.daugavpils.lv/autobuss-nr-2-garazas-autoosta',
        '3': 'http://www.satiksme.daugavpils.lv/autobuss-nr-3-autoosta-kooperativs',
        '4': 'http://www.satiksme.daugavpils.lv/autobuss-nr-4-autoosta-cietoksnis-mezciems-autoosta',
        '5': 'http://www.satiksme.daugavpils.lv/autobuss-nr-5-autoosta-mezciems-cietoksnis-autoosta',
        '6': 'http://www.satiksme.daugavpils.lv/autobuss-nr-6-autoosta-niderkuni',
        '7': 'http://www.satiksme.daugavpils.lv/autobuss-nr-7-autoosta-kalkuni',
        '8': 'http://www.satiksme.daugavpils.lv/autobuss-nr-8-autoosta-judovka',
        '9': 'http://www.satiksme.daugavpils.lv/autobuss-nr-9-autoosta-kirsu-iela',
        '10': 'http://www.satiksme.daugavpils.lv/autobuss-nr-10-autoosta-rugeli',
        '11': 'http://www.satiksme.daugavpils.lv/autobuss-nr-11-jaunforstadte-slimnica',
        '12': 'http://www.satiksme.daugavpils.lv/autobuss-nr-12-autoosta-krizi',
        '13': 'http://www.satiksme.daugavpils.lv/autobuss-nr-13-autoosta-mezciema-arodskola',
        '14': 'http://www.satiksme.daugavpils.lv/autobuss-nr-14-autoosta-cietoksnis-kimija-autoosta',
        '15': 'http://www.satiksme.daugavpils.lv/autobuss-nr-15-autoosta-liginiski-autoosta',
        '16': 'http://www.satiksme.daugavpils.lv/autobuss-nr-16-autoosta-piena-kombin%C4%81ta-ciemats-autoosta',
        '17': 'http://www.satiksme.daugavpils.lv/autobuss-nr-17-autoosta-stacijas-jaunforstadte',
        '18': 'http://www.satiksme.daugavpils.lv/autobuss-nr-18-viduspogulanka-autoosta',
        '19': 'http://www.satiksme.daugavpils.lv/autobuss-nr-19-jaunforstadte-kimiku-ciemats-jaunbuve-jaunforstadte-ciolkovska',
        '20': 'http://www.satiksme.daugavpils.lv/autobuss-nr-20-jaunforstadte-jaunbuve-kimiku-jaunforstadte-no-ciolkovska',
        '21': 'http://www.satiksme.daugavpils.lv/autobuss-nr-21-autobusu-parks-daugavpils-ao-jaunforstadte',
        '22': 'http://www.satiksme.daugavpils.lv/autobuss-nr-22-autobusu-parks-krizi',
        '23': 'http://www.satiksme.daugavpils.lv/autobuss-nr-23-rugeli-regionala-slimnica',
        '24': 'http://www.satiksme.daugavpils.lv/autobuss-nr-24-autoosta-jaunbuve-kimiku-ciemats-jaunforstadte-cietoksnis-autoosta',
        '26': 'http://www.satiksme.daugavpils.lv/autobuss-nr-26-autoosta-%C4%B7imi%C4%B7u-ciemats-jaunfor%C5%A1tadte-autoosta',
        '3B': 'http://www.satiksme.daugavpils.lv/autobuss-nr-3b-autoosta-ziegler-masinbuve',
        '3C': 'http://www.satiksme.daugavpils.lv/autobuss-nr-3c-autoosta-ziglier-masinbuve',
        '7B': 'http://www.satiksme.daugavpils.lv/autobuss-nr-7b-autoosta-micurinietis',
        '10A': 'http://www.satiksme.daugavpils.lv/autobuss-nr-10a-autoosta-rugeli',
        '13A': 'http://www.satiksme.daugavpils.lv/autobuss-nr-13a-autoosta-cietoksnis',
        '17A': 'http://www.satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte',
        '20A2': 'http://www.satiksme.daugavpils.lv/autobuss-nr-20a2-jaunforstadte-kimiku-ciemats-slimnica',
        '20A': 'http://www.satiksme.daugavpils.lv/autobuss-nr-20a-jaunforstadte-jaunbuve',
        '20B': 'http://www.satiksme.daugavpils.lv/autobuss-nr-20b-jaunforstadte-smiltenes-jaunbuve-kimiku-ciemats'
    };


    // @ts-ignore
    constructor(private logService: ISimpleLogService, private cache: CloudflareDefaultCacheStorage,
                fromCenterTimes: Date[] = new Array<Date>(),
                fromEndTimes: Date[] = new Array<Date>(),
                fromCenterHolidayTimes: Date[] = new Array<Date>(),
                fromEndHolidayTimes: Date[] = new Array<Date>()) {
        this._fromCenterTimes = fromCenterTimes;
        this._fromEndTimes = fromEndTimes;
        this._fromCenterHolidayTimes = fromCenterHolidayTimes;
        this._fromEndHolidayTimes = fromEndHolidayTimes;

    }


    public GetCenterTime(): Date[] {
        return this._fromCenterTimes;
    }

    public GetEndTime(): Date[] {
        return this._fromEndTimes;
    }

    public async FetchData(routeNumber: string): Promise<void> {

//        const allSchedulesResp = await fetch(environment.AllSchedulesUrl, {cf: {cacheEverything: true}});
// to get this, run in chrome console
// function Test(){
// let arr1=$('.saraksts-list .title a').toArray().map(a=>a.href);
// let arr2=$('.saraksts-list .mnumber').toArray().map(e=>$(e).text());
//
//  let finArr=new Map();
// for (let i=0;i<34;i++){
//   finArr[arr2[i]]=arr1[i];
// }
// let str=JSON.stringify(finArr);
// console.log();
// }
//
// Test();

        // const allSchedulesMapStr = '{"1":"http://www.satiksme.daugavpils.lv/autobuss-nr-1-autoosta-regionala-slimnica-celinieku-ciemats","2":"http://www.satiksme.daugavpils.lv/autobuss-nr-2-garazas-autoosta","3":"http://www.satiksme.daugavpils.lv/autobuss-nr-3-autoosta-kooperativs","4":"http://www.satiksme.daugavpils.lv/autobuss-nr-4-autoosta-cietoksnis-mezciems-autoosta","5":"http://www.satiksme.daugavpils.lv/autobuss-nr-5-autoosta-mezciems-cietoksnis-autoosta","6":"http://www.satiksme.daugavpils.lv/autobuss-nr-6-autoosta-niderkuni","7":"http://www.satiksme.daugavpils.lv/autobuss-nr-7-autoosta-kalkuni","8":"http://www.satiksme.daugavpils.lv/autobuss-nr-8-autoosta-judovka","9":"http://www.satiksme.daugavpils.lv/autobuss-nr-9-autoosta-kirsu-iela","10":"http://www.satiksme.daugavpils.lv/autobuss-nr-10-autoosta-rugeli","11":"http://www.satiksme.daugavpils.lv/autobuss-nr-11-jaunforstadte-slimnica","12":"http://www.satiksme.daugavpils.lv/autobuss-nr-12-autoosta-krizi","13":"http://www.satiksme.daugavpils.lv/autobuss-nr-13-autoosta-mezciema-arodskola","14":"http://www.satiksme.daugavpils.lv/autobuss-nr-14-autoosta-cietoksnis-kimija-autoosta","15":"http://www.satiksme.daugavpils.lv/autobuss-nr-15-autoosta-liginiski-autoosta","16":"http://www.satiksme.daugavpils.lv/autobuss-nr-16-autoosta-piena-kombin%C4%81ta-ciemats-autoosta","17":"http://www.satiksme.daugavpils.lv/autobuss-nr-17-autoosta-stacijas-jaunforstadte","18":"http://www.satiksme.daugavpils.lv/autobuss-nr-18-viduspogulanka-autoosta","19":"http://www.satiksme.daugavpils.lv/autobuss-nr-19-jaunforstadte-kimiku-ciemats-jaunbuve-jaunforstadte-ciolkovska","20":"http://www.satiksme.daugavpils.lv/autobuss-nr-20-jaunforstadte-jaunbuve-kimiku-jaunforstadte-no-ciolkovska","21":"http://www.satiksme.daugavpils.lv/autobuss-nr-21-autobusu-parks-daugavpils-ao-jaunforstadte","22":"http://www.satiksme.daugavpils.lv/autobuss-nr-22-autobusu-parks-krizi","23":"http://www.satiksme.daugavpils.lv/autobuss-nr-23-rugeli-regionala-slimnica","24":"http://www.satiksme.daugavpils.lv/autobuss-nr-24-autoosta-jaunbuve-kimiku-ciemats-jaunforstadte-cietoksnis-autoosta","26":"http://www.satiksme.daugavpils.lv/autobuss-nr-26-autoosta-%C4%B7imi%C4%B7u-ciemats-jaunfor%C5%A1tadte-autoosta","3B":"http://www.satiksme.daugavpils.lv/autobuss-nr-3b-autoosta-ziegler-masinbuve","3C":"http://www.satiksme.daugavpils.lv/autobuss-nr-3c-autoosta-ziglier-masinbuve","7B":"http://www.satiksme.daugavpils.lv/autobuss-nr-7b-autoosta-micurinietis","10A":"http://www.satiksme.daugavpils.lv/autobuss-nr-10a-autoosta-rugeli","13A":"http://www.satiksme.daugavpils.lv/autobuss-nr-13a-autoosta-cietoksnis","17A":"http://www.satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte","20A2":"http://www.satiksme.daugavpils.lv/autobuss-nr-20a2-jaunforstadte-kimiku-ciemats-slimnica","20A":"http://www.satiksme.daugavpils.lv/autobuss-nr-20a-jaunforstadte-jaunbuve","20B":"http://www.satiksme.daugavpils.lv/autobuss-nr-20b-jaunforstadte-smiltenes-jaunbuve-kimiku-ciemats"}';
//        allSchedulesResp.text();

        const url = this.allSchedules[routeNumber.toUpperCase()] as string;
        const res = await fetch(
            url, {cf: {cacheEverything: true}}
        );
        const src = await res.text();
        // see ./test/testPageFor17A.html file to see how data looks inside it
        // we search for this pattern till jquery code starts (with $)
        // smthing like this:
        // var data = {
        //                                                 "routes": [{
        // etc
        // ..
        // $(document).ready
        const dataPattern = /(var data =[^$]+)/s;

        if (src != null) {
            const matches = dataPattern.exec(src);
            if (matches != null && matches.length !== 0) {
                this.logService.Log('Found match from html source for route schedule data');
                const data: object = JSON.parse(matches[0].replace('var data = ', ''));
                const rd = RouteDataProxy.Create(data);
                const centralStationSchedule = rd.stations[0];
                const endStationSchedule = rd.stations.reverse()[0];

                this._fromCenterTimes = centralStationSchedule.wtlist.map(this.ParseTime);
                this._fromEndTimes = endStationSchedule.wtlist.map(this.ParseTime);

                this._fromCenterHolidayTimes = centralStationSchedule.htlist.map(this.ParseTime);
                this._fromEndHolidayTimes = endStationSchedule.htlist.map(this.ParseTime);

                this.logService.Log(`Saved data, showing closest runs`);
                this.logService.Log(this.GetClosestRuns(this.ParseTime('04:00')));
            }
        } else {
            const error = new Error(`Cannot fetch source html from url ${url}`);
            this.logService.Log(error);
            throw error
        }

    }

    public GetClosestRuns(since: Date): [Date[], Date[]] {

        let centerData: Date[];
        let endData: Date[];
        if (dateFns.isWeekend(since)) {
            centerData = this._fromEndHolidayTimes;
            endData = this._fromCenterHolidayTimes;
        } else {
            centerData = this._fromCenterTimes;
            endData = this._fromEndTimes;
        }
        const filteredCenterData = centerData.filter(time => time >= since);
        const filteredEndData = endData.filter(time => time >= since);

        return [filteredCenterData, filteredEndData];

    }

    public GetAllRoutes(): IRoute[] {
        return Object.entries(this.allSchedules).map(r => new Route({Number: r[0], Link: r[1]}));
    }

    private ParseTime(time: string): Date {
        function GetCurrentDateAndTreatAsUtc(): Date {
            const now = new Date();
            return dateFns.addMinutes(now, -now.getTimezoneOffset());
        }

        let result: Date = GetCurrentDateAndTreatAsUtc();
        // in source data, we have runs as string in form of hh:mm, like "10:14"
        const hoursAndMins = time.split(':')
            .map(str => parseInt(str, 10));
        result.setHours(hoursAndMins[0], hoursAndMins[1], 0, 0);
        // if it is night, but hour is less then 3, show data after midnight as next day
        if (hoursAndMins[0] < 3) {
            result = dateFns.addDays(result, 1);
        }
        return result;
    }
}
