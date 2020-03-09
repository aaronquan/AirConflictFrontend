import React from 'react';

export type AirportProps = {
    name: string,
    city: string,
    country: string,
    icao: string,
    latitude: number,
    longitude: number,
    altitude: number,
    timezone: string
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
    render(){
        return (<circle cx={this.props.longitude} cy={this.props.latitude} r='0.2' fill='white'/>);
    }
}