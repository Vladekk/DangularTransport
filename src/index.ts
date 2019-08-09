import CloudflareWorkerGlobalScope, {CloudflareDefaultCacheStorage, CloudflareWorkerKV} from 'types-cloudflare-worker';
// @ts-ignore
import Router from '../lib/router.js';
import * as packageJson from '../package.json';
import DataService from './dataService';
import {SimpleLogService} from './simpleLogService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
    private corsHeaders = {
        // TODO: modify for production
        'Access-Control-Allow-Headers': 'Content-Type, x-ijt',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'X-App-Version': ''
    };


    // @ts-ignore
    constructor(private cache: CloudflareDefaultCacheStorage, private logService: SimpleLogService, private dataService: DataService) {

    }

    public async GetClosestRuns() {
        await this.dataService.FetchData();
        const since = new Date();
        const runs = this.dataService.GetClosestRuns(since);
        this.corsHeaders['X-App-Version'] = packageJson.version;
        return new Response(JSON.stringify(runs), {headers: this.corsHeaders});

    }

    public async routeRequest(request: any) {
        //    const headers = new Map<string, string>(request.headers);
        const router = new Router();
        this.logService.Log('Routing incoming request');
        // Replace with the approriate paths and handlers
        router.get('.*/api/GetClosestRuns', () => this.GetClosestRuns());
        // r.get('.*/foo', req => handler(req))
        // r.post('.*/foo.*', req => handler(req))
        // r.get('/demos/router/foo', req => fetch(req)) // return the response from the origin
        //
        //   router.get('/', () => new Response('Hello worker!')); // return a default message for the root route

        const resp = await router.route(request);
        return resp
    }

}

// fake stub to avoid typscript undeclared error
declare var logs: any;

self.addEventListener('fetch', (event: Event) => {
    const cache = self.caches.default;
    const request = (event as any).request;

    const headers: Map<string, string> = new Map<string, string>(request.headers);
    const rayId = headers.get('cf-ray') as string;

    const logService = new SimpleLogService(logs as CloudflareWorkerKV, rayId, headers);
    const dataService = new DataService(logService, cache);
    const worker = new Worker(cache, logService, dataService);
    const fetchEvent = event as FetchEvent;

    fetchEvent.respondWith(worker.routeRequest(request));

});

