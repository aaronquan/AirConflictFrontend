import React from 'react';
import {Coordinate} from '../scripts/coordinateHelpers';
import {AirportProps, Airport} from './airport';

type Point = {
    x:number,
    y:number
}

type OverlayProps = {
    mouse:Point,
    zoomLevel:number,
    selectedAirport:AirportProps|undefined
}

export class MapOverlay extends React.Component<OverlayProps>{
    constructor(props:OverlayProps){
        super(props);
    }
    //displayAirport(){
    //    if(selectedAirport)
    //}
    render(){
        return(<div className='Overlay'>
            <div>{this.props.mouse.x.toFixed(2)} {this.props.mouse.y.toFixed(2)}</div>
            <div>{this.props.zoomLevel}</div> 
            <div>{this.props.selectedAirport?.name}</div>
            </div>
        );
    }
}