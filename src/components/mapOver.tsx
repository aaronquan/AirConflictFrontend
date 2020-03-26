import React from 'react';
import {Coordinate} from '../scripts/coordinateHelpers';
import {AirportProps, Airport} from './airport';
import {Popover, Card} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { positions } from '@material-ui/system';

type Point = {
    x:number,
    y:number
}

type OverlayProps = {
    mouse:Point,
    zoomLevel:number,
    selectedAirport:AirportProps|undefined,
}

export class MapOverlay extends React.Component<OverlayProps>{
    constructor(props:OverlayProps){
        super(props);
    }
    //displayAirport(){
    //    if(selectedAirport)
    //}
    render(){
        return(
        <div className='Overlay'>
            <div>{this.props.mouse.x.toFixed(2)} {this.props.mouse.y.toFixed(2)}</div>
            <div>{this.props.zoomLevel.toFixed(2)}</div> 
        </div>
        );
    }
}
/*<div>
    <Box top='140' left='150'>
        <Card>{this.props.selectedAirport?.name}</Card>
    </Box>
</div>*/