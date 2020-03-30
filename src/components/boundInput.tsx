import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {BoundingBox, validLatitude, validLongitude} from '../scripts/coordinateHelpers';

import '../css/App.css';

type BoundInputProps = {
    action:(boundingBox:BoundingBox) => void
}

type BoundInputState = {
    min_longitude:number|undefined,
    max_longitude:number|undefined,
    min_latitude:number|undefined,
    max_latitude:number|undefined,
    errorMessage:string
}

export class BoundInput extends React.Component<BoundInputProps, BoundInputState>{
    constructor(props:BoundInputProps){
        super(props);
        this.state = {
            min_longitude:undefined,
            max_longitude:undefined,
            min_latitude:undefined,
            max_latitude:undefined,
            errorMessage: ' '
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick(){
        if(this.state.min_longitude != undefined && this.state.max_longitude != undefined && 
            this.state.min_latitude != undefined && this.state.max_latitude != undefined){
            if(validLatitude(this.state.min_latitude) && validLatitude(this.state.max_latitude) &&
                validLongitude(this.state.min_longitude) && validLongitude(this.state.max_longitude)){
                if(this.state.min_longitude < this.state.max_longitude){
                    if(this.state.min_latitude < this.state.max_latitude){
                        let bbox:BoundingBox = {
                            min_longitude: this.state.min_longitude,
                            max_longitude: this.state.max_longitude,
                            min_latitude: this.state.min_latitude,
                            max_latitude: this.state.max_latitude,
                        }
                        this.props.action(bbox);
                        this.setState({errorMessage: ' '});
                    }else{
                        this.setState({errorMessage: 'Min Latitude must be less than Max Latitude'});
                    }
                }else{
                    this.setState({errorMessage: 'Min Longitude must be less than Max Longitude'});
                }
            }else{
                this.setState({errorMessage: 'Invalid parameters'});
            }
        }else{
            this.setState({errorMessage: 'Invalid parameters'});
            //this.setState({errorMessage: 'Must fill all parameters'});
        }
    }
    handleChange(e:React.ChangeEvent<HTMLInputElement>){
        const {id, value} = e.target;
        this.setState({[id]:parseInt(value)} as any);
    }
    render(){
        return (
        <div>
            <TextField
                id="min_longitude"
                label="Min Longitude"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
            />
            <TextField
                id="max_longitude"
                label="Max Longitude"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
            />
            <TextField
                id="min_latitude"
                label="Min Latitude"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
            />
            <TextField
                id="max_latitude"
                label="Max Latitude"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
            />
            <div className='Error'>{this.state.errorMessage}</div>
            <div><Button onClick={this.handleClick} variant="contained">Request</Button></div>
        </div>
        );
    }
}