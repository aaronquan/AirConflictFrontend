import React from 'react';
import {BoundingBox, boundIntersection} from '../scripts/coordinateHelpers';

//type Coordinate = {
    
    //longitude: number,
    //latitude: number
//};
export type MapPart = {
    points:number[][], // points are a list of coordinate points [lon, lat]
    bounding_box:BoundingBox
}

export type MapShapeProps = {
    parts: MapPart[], // list of map parts
    soveriegnty: string,
    admin: string,
    continent: string,

    //min_longitude: number, // from old api call
    //min_latitude: number,
    //max_longitude: number,
    //max_latitude: number
    bounding_box: BoundingBox,

    viewBound:BoundingBox,
    zoomValue:number
};

export class MapShape extends React.Component<MapShapeProps>{
    constructor(props:MapShapeProps){
        super(props);
    }
    displayMapShape(part:MapPart, i:number){
        let toRender:JSX.Element;
        //filter parts that intersect with the view bound
        if (boundIntersection(part.bounding_box, this.props.viewBound)){
            toRender = <Shape key={i} coords={part.points} zoom={this.props.zoomValue}/>;
        }else{
            toRender = <Shape key={i} coords={[]} zoom={this.props.zoomValue}/>;
        }
        return toRender;
    }
    render(){
        return(<g>
            {this.props.parts.map((part:MapPart, i:number) =>
                this.displayMapShape(part, i)
                //<Shape key={i} coords={part.points} zoom={this.props.zoomValue}/>
            )}
            </g>);
    }
}

type ShapeProps = {
    coords: number[][],
    zoom: number
}

const Shape: React.FunctionComponent<ShapeProps> = ({coords,zoom}) => {
    return (<polygon points={coordinateString(coords)}/>);
    //return (<polygon points={coordinateString(trimCoordinatesByZoomLevel(coords, zoom))}/>);
}

function coordinateString(coords:number[][]){
    const coordStrings:string[] = coords.map((coord:number[]) => [String(coord[0]), String(coord[1])].join(','));
    return coordStrings.join(' ');
}

function trimCoordinatesByZoomLevel(coords:number[][], zoom:number){
    let skipLevel: number = 1;
    let newCoords:number[][] = [];
    for(let i=0;i<coords.length;i+=skipLevel){
        newCoords.push(coords[i]);
    }
    if(newCoords.length < 3){
        newCoords = [];
    }
    //console.log(newCoords);
    return newCoords;
}