export type BoundingBox = {
    min_longitude: number,
    max_longitude: number,
    min_latitude: number,
    max_latitude: number,
}

export type Coordinate = {
    longitude:number,
    latitude:number,
}

export type Point = {
    x:number,
    y:number
}

export function longitudeDifference(max_lon:number, min_lon:number){
    let result:number;
    if(max_lon < min_lon){
        result = 360 + max_lon - min_lon;
    }else{
        result = max_lon - min_lon;
    }
    return result;
}

// stable bound has min_lon < max_lon
export function boundIntersection(stableBound:BoundingBox, bound:BoundingBox){
    let ret:boolean;
    if(bound.max_longitude > bound.min_longitude){
        ret = stableBound.min_longitude < bound.max_longitude && stableBound.max_longitude > bound.min_longitude && 
        stableBound.min_latitude < bound.max_latitude && stableBound.max_latitude > bound.min_latitude
    }else if(bound.max_longitude < bound.min_longitude){
        ret = (stableBound.min_longitude > bound.max_longitude || stableBound.max_longitude > bound.min_longitude) && 
        stableBound.min_latitude < bound.max_latitude && stableBound.max_latitude > bound.min_latitude
    }else{
        ret = false;
    }
    return ret;
}

export function coordinateInsideBound(coord:Coordinate, bound:BoundingBox){
    let ret:boolean;
    let insideLat:boolean = coord.latitude > bound.min_latitude && coord.latitude < bound.max_latitude;
    let insideLon:boolean;
    if(bound.max_longitude > bound.min_longitude){
        insideLon = coord.longitude > bound.min_longitude && coord.longitude < bound.max_longitude;
        ret = insideLon && insideLat;
    }else if(bound.max_longitude < bound.min_longitude){
        insideLon = coord.longitude > bound.min_longitude && coord.longitude < 180 ||
                    coord.longitude > -180 && coord.longitude < bound.max_longitude;
        ret = insideLon && insideLat;
    }else{
        ret = false;
    }
    return ret;
}