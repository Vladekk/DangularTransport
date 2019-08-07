import CloudflareWorkerGlobalScope from 'types-cloudflare-worker';
import DataService from './dataService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
    private corsHeaders = {
        // TODO: modify for production
        'Access-Control-Allow-Headers': 'Content-Type, x-ijt',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Origin': '*'
    };

    public async handle() {
        const ds = new DataService();
        await ds.FetchData();
        const since = new Date();
        const runs = ds.GetClosestRuns(since);
        return new Response(JSON.stringify(runs), {headers: this.corsHeaders});
    }
}

self.addEventListener('fetch', (event: Event) => {
    const worker = new Worker();
    const fetchEvent = event as FetchEvent;
    fetchEvent.respondWith(worker.handle());
});
