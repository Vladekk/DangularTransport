import CloudflareWorkerGlobalScope, {CloudflareWorkerKV} from 'types-cloudflare-worker';
import DataService from './dataService';
import {SimpleLogService} from './simpleLogService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
    private corsHeaders = {
        // TODO: modify for production
        'Access-Control-Allow-Headers': 'Content-Type, x-ijt',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'X-Debug': ''
    };


    constructor(private log: CloudflareWorkerKV) {
    }

    public async handle(headers: Map<string, string>) {


        const rayId = headers.get('cf-ray') as string;
        const logService = new SimpleLogService(this.log, rayId, headers);
        const ds = new DataService(logService);

        // let cache = caches.default
        await ds.FetchData();
        const since = new Date();
        const runs = ds.GetClosestRuns(since);
        this.corsHeaders['X-Debug'] = JSON.stringify(headers);
        return new Response(JSON.stringify(runs), {headers: this.corsHeaders});

    }
}

// fake stub to avoid typscript undeclared error
declare var logs: any;

self.addEventListener('fetch', (event: Event) => {
    const worker = new Worker(logs as CloudflareWorkerKV);
    const fetchEvent = event as FetchEvent;
    const headers = new Map<string, string>((event as any).request.headers);
    fetchEvent.respondWith(worker.handle(headers));

});

