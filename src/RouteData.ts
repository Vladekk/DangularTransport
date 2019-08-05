/* tslint:disable */
// Stores the currently-being-typechecked object for error messages.
let obj: any = null;

export class RouteDataProxy {
    public readonly routes: RoutesEntityOrGeoProxy[];
    public readonly stations: StationsEntityProxy[];

    private constructor(d: any) {
        this.routes = d.routes;
        this.stations = d.stations;
    }

    public static Parse(d: string): RouteDataProxy {
        return RouteDataProxy.Create(JSON.parse(d));
    }

    public static Create(d: any, field: string = 'root'): RouteDataProxy {
        if (!field) {
            obj = d;
            field = 'root';
        }
        if (d === null || d === undefined) {
            throwNull2NonNull(field, d);
        } else if (typeof (d) !== 'object') {
            throwNotObject(field, d, false);
        } else if (Array.isArray(d)) {
            throwIsArray(field, d, false);
        }
        checkArray(d.routes, field + '.routes');
        if (d.routes) {
            for (let i = 0; i < d.routes.length; i++) {
                d.routes[i] = RoutesEntityOrGeoProxy.Create(d.routes[i], field + '.routes' + '[' + i + ']');
            }
        }
        if (d.routes === undefined) {
            d.routes = null;
        }
        checkArray(d.stations, field + '.stations');
        if (d.stations) {
            for (let i = 0; i < d.stations.length; i++) {
                d.stations[i] = StationsEntityProxy.Create(d.stations[i], field + '.stations' + '[' + i + ']');
            }
        }
        if (d.stations === undefined) {
            d.stations = null;
        }
        return new RouteDataProxy(d);
    }
}

export class RoutesEntityOrGeoProxy {
    public readonly lat: string;
    public readonly lng: string;

    private constructor(d: any) {
        this.lat = d.lat;
        this.lng = d.lng;
    }

    public static Parse(d: string): RoutesEntityOrGeoProxy {
        return RoutesEntityOrGeoProxy.Create(JSON.parse(d));
    }

    public static Create(d: any, field: string = 'root'): RoutesEntityOrGeoProxy {
        if (!field) {
            obj = d;
            field = 'root';
        }
        if (d === null || d === undefined) {
            throwNull2NonNull(field, d);
        } else if (typeof (d) !== 'object') {
            throwNotObject(field, d, false);
        } else if (Array.isArray(d)) {
            throwIsArray(field, d, false);
        }
        checkString(d.lat, false, field + '.lat');
        checkString(d.lng, false, field + '.lng');
        return new RoutesEntityOrGeoProxy(d);
    }
}

export class StationsEntityProxy {
    public readonly sid: string;
    public readonly number: string;
    public readonly name: string;
    public readonly decription: string;
    public readonly geo: RoutesEntityOrGeoProxy;
    public readonly wtlist: string[];
    public readonly htlist: string[];
    public readonly other: OtherEntityProxy[] | null;

    private constructor(d: any) {
        this.sid = d.sid;
        this.number = d.number;
        this.name = d.name;
        this.decription = d.decription;
        this.geo = d.geo;
        this.wtlist = d.wtlist;
        this.htlist = d.htlist;
        this.other = d.other;
    }

    public static Parse(d: string): StationsEntityProxy {
        return StationsEntityProxy.Create(JSON.parse(d));
    }

    public static Create(d: any, field: string = 'root'): StationsEntityProxy {
        if (!field) {
            obj = d;
            field = 'root';
        }
        if (d === null || d === undefined) {
            throwNull2NonNull(field, d);
        } else if (typeof (d) !== 'object') {
            throwNotObject(field, d, false);
        } else if (Array.isArray(d)) {
            throwIsArray(field, d, false);
        }
        checkString(d.sid, false, field + '.sid');
        checkString(d.number, false, field + '.number');
        checkString(d.name, false, field + '.name');
        checkString(d.decription, false, field + '.decription');
        d.geo = RoutesEntityOrGeoProxy.Create(d.geo, field + '.geo');
        checkArray(d.wtlist, field + '.wtlist');
        if (d.wtlist) {
            for (let i = 0; i < d.wtlist.length; i++) {
                checkString(d.wtlist[i], false, field + '.wtlist' + '[' + i + ']');
            }
        }
        if (d.wtlist === undefined) {
            d.wtlist = null;
        }
        checkArray(d.htlist, field + '.htlist');
        if (d.htlist) {
            for (let i = 0; i < d.htlist.length; i++) {
                checkString(d.htlist[i], false, field + '.htlist' + '[' + i + ']');
            }
        }
        if (d.htlist === undefined) {
            d.htlist = null;
        }
        checkArray(d.other, field + '.other');
        if (d.other) {
            for (let i = 0; i < d.other.length; i++) {
                d.other[i] = OtherEntityProxy.Create(d.other[i], field + '.other' + '[' + i + ']');
            }
        }
        if (d.other === undefined) {
            d.other = null;
        }
        return new StationsEntityProxy(d);
    }
}

export class OtherEntityProxy {
    public readonly sid: string;
    public readonly number: string;
    public readonly name: string;
    public readonly link: string;
    public readonly owtlist: string[] | null;
    public readonly ohtlist: string[] | null;

    private constructor(d: any) {
        this.sid = d.sid;
        this.number = d.number;
        this.name = d.name;
        this.link = d.link;
        this.owtlist = d.owtlist;
        this.ohtlist = d.ohtlist;
    }

    public static Parse(d: string): OtherEntityProxy {
        return OtherEntityProxy.Create(JSON.parse(d));
    }

    public static Create(d: any, field: string = 'root'): OtherEntityProxy {
        if (!field) {
            obj = d;
            field = 'root';
        }
        if (d === null || d === undefined) {
            throwNull2NonNull(field, d);
        } else if (typeof (d) !== 'object') {
            throwNotObject(field, d, false);
        } else if (Array.isArray(d)) {
            throwIsArray(field, d, false);
        }
        checkString(d.sid, false, field + '.sid');
        checkString(d.number, false, field + '.number');
        checkString(d.name, false, field + '.name');
        checkString(d.link, false, field + '.link');
        checkArray(d.owtlist, field + '.owtlist');
        if (d.owtlist) {
            for (let i = 0; i < d.owtlist.length; i++) {
                checkString(d.owtlist[i], false, field + '.owtlist' + '[' + i + ']');
            }
        }
        if (d.owtlist === undefined) {
            d.owtlist = null;
        }
        checkArray(d.ohtlist, field + '.ohtlist');
        if (d.ohtlist) {
            for (let i = 0; i < d.ohtlist.length; i++) {
                checkString(d.ohtlist[i], false, field + '.ohtlist' + '[' + i + ']');
            }
        }
        if (d.ohtlist === undefined) {
            d.ohtlist = null;
        }
        return new OtherEntityProxy(d);
    }
}

function throwNull2NonNull(field: string, d: any): never {
    return errorHelper(field, d, 'non-nullable object', false);
}

function throwNotObject(field: string, d: any, nullable: boolean): never {
    return errorHelper(field, d, 'object', nullable);
}

function throwIsArray(field: string, d: any, nullable: boolean): never {
    return errorHelper(field, d, 'object', nullable);
}

function checkArray(d: any, field: string): void {
    if (!Array.isArray(d) && d !== null && d !== undefined) {
        errorHelper(field, d, 'array', true);
    }
}

function checkString(d: any, nullable: boolean, field: string): void {
    if (typeof (d) !== 'string' && (!nullable || (nullable && d !== null && d !== undefined))) {
        errorHelper(field, d, 'string', nullable);
    }
}

function errorHelper(field: string, d: any, type: string, nullable: boolean): never {
    if (nullable) {
        type += ', null, or undefined';
    }
    throw new TypeError('Expected ' + type + ' at ' + field + ' but found:\n' + JSON.stringify(d) + '\n\nFull object:\n' + JSON.stringify(obj));
}
