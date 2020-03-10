import React from 'react';
import { AxiosResponse } from 'axios';
import {singleRequest, requestChain, requestAllPages, requestAllPagesFastReturn} from '../scripts/requests';

import {AirportProps, Airport} from '../components/airport';

type AirportsState = {
    airports: AirportProps[];
}

export class Airports extends React.Component<{}, AirportsState>{
    constructor(props:{}){
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
        requestAllPagesFastReturn(`http://airconflictapi.herokuapp.com/api/airport/`, updateState);
    }
    render(){
        return (<>{this.state.airports.map((airport:AirportProps, i:number) => <Airport key={airport.icao} {...airport}/>)}</>);
    }
};