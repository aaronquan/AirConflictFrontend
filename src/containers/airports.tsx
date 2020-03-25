import React from 'react';
import { AxiosResponse } from 'axios';
import {singleRequest, requestChain, requestAllPages, requestAllPagesFastReturn} from '../scripts/requests';

import {BoundingBox, Coordinate, coordinateInsideBound} from '../scripts/coordinateHelpers'

import {AirportProps, Airport} from '../components/airport';


type AirportsProps = {
    maxBound:BoundingBox,
    viewBound:BoundingBox,
    zoomLevel:number,
    onSelection:(ap:AirportProps) => void,
    onDeselection:() => void
}

type AirportsState = {
    airports: AirportProps[];
}

export class Airports extends React.Component<AirportsProps, AirportsState>{
    constructor(props:AirportsProps){
        super(props);
        this.state = {airports: []};
        this.onSelection = this.onSelection.bind(this);
        this.onDeselection = this.onDeselection.bind(this);
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
    onSelection(ap:AirportProps){
        this.props.onSelection(ap);
    }
    onDeselection(){
        this.props.onDeselection();
    }
    render(){
        return (<>{this.state.airports.map((airport:AirportProps) => 
                    <Airport 
                        onSelection={this.onSelection} onDeselection={this.onDeselection}
                        key={airport.icao} {...airport} zoomLevel={this.props.zoomLevel}
                    />
                )}</>);
    }
};