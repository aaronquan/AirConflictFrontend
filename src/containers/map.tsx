import React from 'react';
import { AxiosResponse } from 'axios';
import {singleRequest, requestChain, requestAllPages, requestAllPagesFastReturn} from '../scripts/requests';

import {MapShape, MapShapeProps} from '../components/mapShape';
import {BoundingBox, boundIntersection} from '../scripts/coordinateHelpers';

type MapProps = {
    maxBound:BoundingBox,
    viewBound:BoundingBox,
    zoomLevel:number
}

type MapState = {
    mapData: MapShapeProps[];
}

export class Map extends React.Component<MapProps, MapState>{
    constructor(props:MapProps){
        super(props);
        this.state = {mapData: []};
    }
    componentDidMount(){
        this.requestData();
    }
    componentDidUpdate(prevProps:MapProps){
        if(this.props.maxBound != prevProps.maxBound){
            //console.log('hello');
            this.requestData();
        }
    }
    requestData(){
        this.setState({mapData: []});
        let updateState = (r:AxiosResponse<any>) => {
            this.setState((state) => {
                console.log(r.data.results);
                return {mapData: state.mapData.concat(r.data.results)};
            })
        }
        //requestChain(`http://localhost:62080/api/maparea/`, updateState, {params: {...this.props}}); //old axios call (check time diff)
        //requestAllPages(`http://airconflictapi.herokuapp.com/api/map/`, updateState);
        requestAllPagesFastReturn(`http://airconflictapi.herokuapp.com/api/maparea/`, updateState, {params: {...this.props.maxBound}});
        //requestAllPagesFastReturn(`http://airconflictapi.herokuapp.com/api/map/`, updateState);
    }
    render(){
        return (
        <>{this.state.mapData.map((shape:MapShapeProps) =>
            <MapShape key={shape.admin} {...shape} viewBound={this.props.viewBound}/>)
        }</>
        );
    }
}

export default Map;