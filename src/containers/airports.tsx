import React from 'react';
import { AxiosResponse } from 'axios';
import {singleRequest, requestChain, requestAllPages, requestAllPagesFastReturn} from '../scripts/requests';

import {BoundingBox, Coordinate, coordinateInsideBound} from '../scripts/coordinateHelpers'

import {AirportProps, Airport} from '../components/airport';


type AirportsProps = {
    maxBound:BoundingBox,
    viewBound:BoundingBox,
    zoomLevel:number
}

type AirportsState = {
    airports: AirportProps[];
}

export class Airports extends React.Component<AirportsProps, AirportsState>{
    constructor(props:AirportsProps){
        super(props);
        this.state = {airports: []};
    }
    componentDidMount(){
        let updateState = (r:AxiosResponse<any>) => {
            //console.log(r.data.results);
            this.setState((state) => {
                return {airports: state.airports.concat(r.data.results)};
            });
        }
        //let options = {params: {
        //    page_size: 100
        //}};
        //requestAllPages(`http://airconflictapi.herokuapp.com/api/airport/`, updateState);
        requestAllPagesFastReturn(`http://airconflictapi.herokuapp.com/api/airport/`, updateState, {params: {...this.props.maxBound}});
    }
    displayAirport(airport:AirportProps){
        let coord:Coordinate = {
            longitude: airport.longitude,
            latitude: airport.latitude
        }
        let toRender:JSX.Element;
        if(coordinateInsideBound(coord, this.props.viewBound)){
            toRender = <Airport key={airport.icao} {...airport} zoomLevel={this.props.zoomLevel}/>;
        }else{
            toRender = <></>;
        }
        return toRender;
    }
    render(){
        return (<>{this.state.airports.map((airport:AirportProps) => 
                    this.displayAirport(airport)
                    //<Airport key={airport.icao} {...airport} />
                )}</>);
    }
};