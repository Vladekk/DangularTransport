import CloudflareWorkerGlobalScope from 'types-cloudflare-worker';
import DataService from './dataService';

declare var self: CloudflareWorkerGlobalScope;

export class Worker {
  public async handle() {
    const ds = new DataService();
    const data = ds.FetchData();
    const d = await data;

    return new Response(d);
  }
}

self.addEventListener('fetch', (event: Event) => {
  const worker = new Worker();
  const fetchEvent = event as FetchEvent;
  fetchEvent.respondWith(worker.handle());
});
