import * as dateFns from 'date-fns'
import {RouteDataProxy} from './RouteData';

export default class DataService {


    private _fromEndHolidayTimes: Date[];
    private _fromCenterHolidayTimes: Date[];
    private _fromCenterTimes: Date[];
    private _fromEndTimes: Date[];

    private htmlSourcePageUrl = 'http://satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte';

    constructor(fromCenterTimes: Date[] = new Array<Date>(),
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

    public async FetchData(): Promise<void> {

        const res = await fetch(
            this.htmlSourcePageUrl,
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
                const data: object = JSON.parse(matches[0].replace('var data = ', ''));
                const rd = RouteDataProxy.Create(data);
                const centralStationSchedule = rd.stations[0];
                const endStationSchedule = rd.stations.reverse()[0];
                this._fromCenterTimes = centralStationSchedule.wtlist.map(this.ParseTime);
                this._fromEndTimes = endStationSchedule.wtlist.map(this.ParseTime);

                this._fromCenterHolidayTimes = centralStationSchedule.htlist.map(this.ParseTime);
                this._fromEndHolidayTimes = endStationSchedule.htlist.map(this.ParseTime);
            }
        } else {
            throw new Error(`Cannot fetch source html from url ${this.htmlSourcePageUrl}`)
        }


        // return rp('http://satiksme.daugavpils.lv/autobuss-nr-17a-autoosta-csdd-jaunforstadte');
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
