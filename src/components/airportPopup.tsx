import React from 'react';

import {Popover, Card} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import {AirportProps} from './airport';

import '../css/map.css';

type Point = {
    x:number,
    y:number
}

type CustomPosition = {
    left?:number,
    right?:number,
    bottom?:number,
    top?:number
}

type PopupProps = {
    width:number,
    height:number,
    selectedAirport:AirportProps|undefined,
    mouse:Point,
    rawMouse:Point
}

type PopupState = {
    //cardPosition:Point,
    cardPosition:CustomPosition
}

export class AirportPopup extends React.Component<PopupProps, PopupState>{
    constructor(props:PopupProps){
        super(props);
        this.state = {
            cardPosition: {}
        }
    }
    cardPositioning(){
        //let cp:Point = {x:0,y:0};
        let positioning:CustomPosition = {};
        let padding:number = 5;
        if(this.props.rawMouse.x > this.props.width/2){
            positioning.right = this.props.width-this.props.rawMouse.x+padding; // card on left of mouse
        }else{
            positioning.left = this.props.rawMouse.x+padding; // card on right of mouse
        }
        if(this.props.rawMouse.y > this.props.height/2){
            positioning.bottom = this.props.height-this.props.rawMouse.y+padding; // card on bottom of mouse
        }else{
            positioning.top = this.props.rawMouse.y+padding; // card on top of mouse
        }
        //this.setState({cardPosition: positioning});
        return positioning;
    }
    displayAirportCard(){ // not in use
        //this.cardCoordinates();
        let toRender:JSX.Element;
        if(this.props.selectedAirport){
            toRender = <Box className='Absolute' {...this.cardPositioning()}><Card>{this.props.selectedAirport?.name}</Card></Box>;
        }else{
            toRender = <></>
        }
        return toRender;
    }
    render(){
        //return (<>{this.displayAirportCard()}</>);
        return(
        <Box className='Absolute' {...this.cardPositioning()}>
            <Card>{this.props.selectedAirport?.name}</Card>
        </Box>
        )
    }
    //<Box className='Absolute' left={this.state.cardPosition.x} top={this.state.cardPosition.y}><Card>{this.props.selectedAirport?.name}</Card></Box>
}