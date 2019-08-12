import CloudflareWorkerGlobalScope, {CloudflareDefaultCacheStorage, CloudflareWorkerKV} from 'types-cloudflare-worker';
// @ts-ignore
import Router from '../lib/router.js';
import * as packageJson from '../package.json';
import DataService from './dataService';
import {IGetClosestRunsArgs} from './getClosestRuns';
import {IGetAllRoutesArgs} from './IGetAllRoutesArgs';
import {SimpleLogService} from './simpleLogService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
    private corsHeaders = {
        // TODO: modify for production
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, cf-connecting-ip,x-ijt ',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Origin': 'localhost',
        // 'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400',
        'Allow': 'GET, HEAD, POST, OPTIONS',
        'X-App-Version': ''
    };


    // @ts-ignore
    constructor(private cache: CloudflareDefaultCacheStorage, private logService: SimpleLogService, private dataService: DataService) {

    }

    // @ts-ignore
    public async GetClosestRuns(routeNumber: string) {
        await this.dataService.FetchData(routeNumber);
        const since = new Date();
        const runs = this.dataService.GetClosestRuns(since);
        this.corsHeaders['X-App-Version'] = packageJson.version;
        // throw new Error(JSON.stringify(runs))
        return new Response(JSON.stringify(runs), {headers: this.corsHeaders});

    }

    public async routeRequest(request: any) {
        //    const headers = new Map<string, string>(request.headers);
        const router = new Router();
        this.logService.Log('Routing incoming request');
        // tslint:disable-next-line:no-console

        if (request.method === 'OPTIONS') {            
            return new Response(null, {headers: this.corsHeaders});
        }

        // Replace with the approriate paths and handlers
        router.post('.*/api/GetClosestRuns', async () => {
            const body = await request.json() as IGetClosestRunsArgs;
            this.logService.Log(`Received body`);
            this.logService.Log(body);
            return this.GetClosestRuns(body.BusNumber);
        });

        // Replace with the approriate paths and handlers
        router.post('.*/api/GetAllRoutes', async () => {
            const body = await request.json() as IGetAllRoutesArgs;
            this.logService.Log(`GetAllRoutes method received args`);
            this.logService.Log(body);
            this.logService.Log('Sending response ');
            const routes = Array.from(this.GetAllRoutes());
            this.logService.Log(routes);

            return new Response(JSON.stringify(routes), {headers: this.corsHeaders});
        });

        const resp = await router.route(request);
        return resp;
    }

    private GetAllRoutes() {
        return this.dataService.GetAllSchedules();
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
