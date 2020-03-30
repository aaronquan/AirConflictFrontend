import React from 'react';

import { Button, ButtonGroup, Box, Paper } from '@material-ui/core';
import { positions } from '@material-ui/system';
import {ToggleButtonGroup, ButtonProps} from '../containers/toggleButtonGroup';

export type ToggleButtonText = {
    button:ButtonProps,
    text?:string,
    component:JSX.Element
}

type Positioning = {
    top?:number,
    bottom?:number,
    right?:number,
    left?:number
}

export type ToggleButtonDropdownProps = {
    buttons:ToggleButtonText[],
    width:number,
    height?:number,
    componentPosition:Positioning,
    buttonsPosition:Positioning,
    buttonHeight:number
}

type ToggleButtonDropdownState = {
    text:string,
    currentElement:JSX.Element
}

export class ToggleButtonDropdown extends React.Component<ToggleButtonDropdownProps, ToggleButtonDropdownState>{
    constructor(props:ToggleButtonDropdownProps){
        super(props);
        this.state = {
            text: '',
            currentElement: <></>
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleButton = this.handleButton.bind(this);
    }
    buttonList(){
        return this.props.buttons.map((buttonText:ToggleButtonText) => {
            return buttonText.button;
        });
    }
    handleClick(e:React.MouseEvent){
        console.log(e.currentTarget!.textContent);
    }
    handleButton(index?:number){ //may need to pass back index not value
        if(index!=undefined){
            //this.setState({text: this.props.buttons[index].text});
            this.setState({currentElement: this.props.buttons[index].component})
        }else{
            //this.setState({text: ''});
            this.setState({currentElement: <></>});
        }
    }
    renderText(){

    }
    //swap for custom togglebutton group
    render(){
        return(
        <Box position='relative'>
            <Box position='absolute' {...this.props.buttonsPosition}>
                <ToggleButtonGroup onSelection={this.handleButton} buttons={this.buttonList()}/>
            </Box>
            <Box
             position='absolute' width={this.props.width} height={this.props.height} 
             {...this.props.componentPosition}>
                <Paper>
                    {this.state.currentElement}
                </Paper>
            </Box>
        </Box>
        );
    }
}