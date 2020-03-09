import React from 'react';

//type Coordinate = {
    
    //longitude: number,
    //latitude: number
//};

export type MapShapeProps = {
    points: number[][][], // list of shapes, shapes are a list of coordinate points [lon, lat]
    soveriegnty: string,
    admin: string,
    continent: string,
    min_longitude: number,
    min_latitude: number,
    max_longitude: number,
    max_latitude: number
};

export class MapShape extends React.Component<MapShapeProps>{
    constructor(props:MapShapeProps){
        super(props);
    }
    render(){
        return(<g>{this.props.points.map((shape:number[][], i:number) => <Shape key={i} coords={shape}/>)}</g>);
    }
}

type ShapeProps = {
    coords: number[][]
}

const Shape: React.FunctionComponent<ShapeProps> = ({coords}) => {
    return (<polygon points={coordinateString(coords)}/>);
}

function coordinateString(coords:number[][]){
    const coordStrings:string[] = coords.map((coord:number[]) => [String(coord[0]), String(coord[1])].join(','));
    return coordStrings.join(' ');
}