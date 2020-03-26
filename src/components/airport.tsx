import React from 'react';
import {BoundingBox, Coordinate, coordinateInsideBound} from '../scripts/coordinateHelpers';
import {Popover, Card} from '@material-ui/core';

export type AirportProps = {
    name: string,
    city: string,
    country: string,
    icao: string,
    latitude: number,
    longitude: number,
    altitude: number,
    timezone: string,

    viewBound:BoundingBox,
    zoomLevel:number,

    onSelection:(ap:AirportProps) => void,
    onDeselection:() => void
}

type AirportState = {
    circleFill:string
}

type CircleAttributes = {
    cx: number,
    cy: number,
    r: number
}

export class Airport extends React.Component<AirportProps, AirportState>{
    constructor(props:AirportProps){
        super(props);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.state = {
            circleFill: 'white',
        }
    }
    displayAirport(){
        let coord:Coordinate = {
            longitude: this.props.longitude,
            latitude: this.props.latitude
        }
        let toRender:JSX.Element;
        if(coordinateInsideBound(coord, this.props.viewBound)){
            toRender = <circle 
                            onMouseEnter={this.handleMouseEnter}  onMouseLeave={this.handleMouseLeave}
                            cx={this.props.longitude} cy={this.props.latitude} r={this.circleRadius()} fill={this.state.circleFill}
                        />
        }else{
            toRender = <></>;
        }
        return toRender;
    }
    handleMouseEnter(){
        this.props.onSelection(this.props);
        this.setState({circleFill: 'grey'});
    }
    handleMouseLeave(){
        this.props.onDeselection();
        this.setState({circleFill: 'white'});
    }
    circleRadius(){
        return 3.5/this.props.zoomLevel;
    }
    render(){
        return (<>{this.displayAirport()}</>);
    }
}
/*
<circle 
    onMouseEnter={this.handleMouseEnter}  onMouseLeave={this.handleMouseLeave}
    cx={this.props.longitude} cy={this.props.latitude} r={this.circleRadius()} fill={this.state.circleFill}
/>
*/