import CloudflareWorkerGlobalScope, {CloudflareWorkerKV} from 'types-cloudflare-worker';
import DataService from './dataService';

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

        const ds = new DataService();

        // noinspection ES6MissingAwait
        this.log.put(`${headers.get('cf-ray')}`, `Incoming request headers \n ${JSON.stringify([...headers])}`);
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
