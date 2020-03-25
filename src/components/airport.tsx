import React from 'react';
import {BoundingBox, Coordinate, coordinateInsideBound} from '../scripts/coordinateHelpers';

export type AirportProps = {
    name: string,
    city: string,
    country: string,
    icao: string,
    latitude: number,
    longitude: number,
    altitude: number,
    timezone: string,

    //viewBound:BoundingBox,
    zoomLevel:number
}

type CircleAttributes = {
    cx: number,
    cy: number,
    r: number
}

export class Airport extends React.Component<AirportProps>{
    constructor(props:AirportProps){
        super(props);
    }
    /*displayAirport(){
        let coord:Coordinate = {
            longitude: this.props.longitude,
            latitude: this.props.latitude
        }
        let toRender:JSX.Element;
        if(coordinateInsideBound(coord, this.props.viewBound)){
            toRender = <circle cx={this.props.longitude} cy={this.props.latitude} r='0.2' fill='white'/>
        }else{
            toRender = <></>;
        }
    }*/
    circleRadius(){
        return 3.5/this.props.zoomLevel;
    }
    render(){
        return (<circle cx={this.props.longitude} cy={this.props.latitude} r={this.circleRadius()} fill='white'/>);
    }
}