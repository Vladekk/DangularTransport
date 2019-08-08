import {ISimpleLogService} from './ISimpleLogService';

export class NullLogService implements ISimpleLogService {
    // @ts-ignore
    // tslint:disable-next-line:no-empty
    public Log(obj: any): void {
    }
}
