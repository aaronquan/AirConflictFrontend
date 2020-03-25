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
    zoomLevel:number,

    onSelection:(ap:AirportProps) => void,
    onDeselection:() => void
}

type CircleAttributes = {
    cx: number,
    cy: number,
    r: number
}

export class Airport extends React.Component<AirportProps>{
    constructor(props:AirportProps){
        super(props);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
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
    handleMouseEnter(){
        this.props.onSelection(this.props);
    }
    handleMouseLeave(){
        this.props.onDeselection();
    }
    circleRadius(){
        return 3.5/this.props.zoomLevel;
    }
    render(){
        return (<circle 
                    onMouseEnter={this.handleMouseEnter}  onMouseLeave={this.handleMouseLeave}
                    cx={this.props.longitude} cy={this.props.latitude} r={this.circleRadius()} fill='white'
                />);
    }
}