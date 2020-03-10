import React from 'react';
import { AxiosResponse } from 'axios';
import {singleRequest, requestChain, requestAllPages, requestAllPagesFastReturn} from '../scripts/requests';

import {MapShape, MapShapeProps} from '../components/mapShape';
import {BoundingBox} from '../components/svgMap';

type MapState = {
    mapData: MapShapeProps[];
}

export class Map extends React.Component<BoundingBox, MapState>{
    constructor(props:BoundingBox){
        super(props);
        this.state = {mapData: []};
    }
    componentDidMount(){
        let updateState = (r:AxiosResponse<any>) => {
            this.setState((state) => {
                return {mapData: state.mapData.concat(r.data.results)};
            })
        }
        //requestChain(`http://localhost:62080/api/maparea/`, updateState, {params: {...this.props}}); //old axios call (check time diff)
        //requestAllPages(`http://airconflictapi.herokuapp.com/api/map/`, updateState);
        requestAllPagesFastReturn(`http://airconflictapi.herokuapp.com/api/map/`, updateState);
        //requestAllPages(`http://airconflictapi.herokuapp.com/api/maparea/`, updateState, {params: {...this.props}});
    }
    render(){
        return (<>{this.state.mapData.map((shape:MapShapeProps, i:number) => <MapShape key={shape.admin} {...shape}/>)}</>);
    }
}

export default Map;