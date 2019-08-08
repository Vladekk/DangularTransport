import {addMilliseconds} from 'date-fns';
import {CloudflareWorkerKV} from 'types-cloudflare-worker';
import {ISimpleLogService} from './ISimpleLogService';

export class SimpleLogService implements ISimpleLogService {
    private timer: number = 0;

    constructor(private log: CloudflareWorkerKV, private rayId: string, headers: Map<string, string>) {
        this.Log(`Starting loggger, DT version ${1}}`);
        this.Log([...headers]);
        // setInterval(() => this.timer++, 1);
    }

    public Log(obj: any) {
        this.timer++;
        const now = addMilliseconds(new Date(), this.timer);
        // noinspection JSIgnoredPromiseFromCall
        this.log.put(`${this.rayId} ${now.toISOString()}`, JSON.stringify(obj, null, 2));
    }
}
