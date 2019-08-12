import CloudflareWorkerGlobalScope, {CloudflareDefaultCacheStorage, CloudflareWorkerKV} from 'types-cloudflare-worker';
// @ts-ignore
import Router from '../lib/router.js';
import * as packageJson from '../package.json';
import DataService from './dataService';
import {IGetClosestRunsArgs} from './getClosestRuns';
import {SimpleLogService} from './simpleLogService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
    private corsHeaders = {
        // TODO: modify for production
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
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
    public async GetClosestRuns(routeNumber: string | null) {
        await this.dataService.FetchData();
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

        if (request.method === 'OPTIONS') {
            //   throw new Error(JSON.stringify([...request.headers]));
            return new Response(null, {headers: this.corsHeaders});
        }

        // Replace with the approriate paths and handlers
        router.post('.*/api/GetClosestRuns', () => {
            const body = request.json() as IGetClosestRunsArgs;
            return this.GetClosestRuns(body.BusNumber);
        });

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

/*

let arr1=$('.saraksts-list .title a').toArray().map(a=>a.href);
undefined
 let arr2=$('.saraksts-list .mnumber').toArray().map(e=>$(e).text());

 let finArr=new Map();
for (let i=0;i<34;i++){
  finArr[arr2[i]]=arr1[i];
}

 */
