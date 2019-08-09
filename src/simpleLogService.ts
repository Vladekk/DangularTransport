import {addMilliseconds} from 'date-fns';
import {CloudflareWorkerKV} from 'types-cloudflare-worker';
import * as packageJson from '../package.json'
import {ISimpleLogService} from './ISimpleLogService';

export class SimpleLogService implements ISimpleLogService {
    private timer: number = 0;

    constructor(private log: CloudflareWorkerKV, private rayId: string, headers: Map<string, string>) {
        this.Log(`Starting loggger, DT version ${packageJson.version}}`);
        this.Log([...headers]);

        // setInterval(() => this.timer++, 1);
    }

    public Log(obj: any) {
        this.timer++;
        const now = addMilliseconds(new Date(), this.timer);
        // noinspection JSIgnoredPromiseFromCall
        const value = JSON.stringify(obj, null, 2);
        this.log.put(`${this.rayId} ${now.toISOString()}`, value);
    }
}
