import React from 'react';

import { Button, ButtonGroup} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import '../css/button.css';

export type ButtonProps = {
    name:string,
    //value:string,
    //onSelection?:(s?:string) => void
}

type ToggleButtonGroupProps = {
    buttons: ButtonProps[],
    onSelection: (i?:number) => void
}

type ToggleButtonGroupState = {
    selectedButton:number|undefined,
    buttonsActiveState:boolean[]
}

export class ToggleButtonGroup extends React.Component<ToggleButtonGroupProps, ToggleButtonGroupState>{
    constructor(props:ToggleButtonGroupProps){
        super(props);
        let buttonsActiveState = [];
        for(let i=0; i<this.props.buttons.length; i++){
            buttonsActiveState.push(false);
        }
        this.state = {
            selectedButton:undefined,
            buttonsActiveState:buttonsActiveState
        }
        this.handleButton = this.handleButton.bind(this);
    }
    handleButton(i:number){
        if(this.state.selectedButton != undefined){
            if(i == this.state.selectedButton){
                this.props.onSelection(undefined);
                this.state.buttonsActiveState[i] = false;
                this.setState({selectedButton:undefined});
            }else{
                this.props.onSelection(i);
                this.state.buttonsActiveState[this.state.selectedButton] = false;
                this.state.buttonsActiveState[i] = true;
                this.setState({selectedButton:i});
            }
        }
        else{
            this.props.onSelection(i);
            this.state.buttonsActiveState[i] = true;
            this.setState({selectedButton:i});
        }
    }
    //swap for custom togglebutton group
    render(){
        return(
            <ButtonGroup color="secondary">
                {this.props.buttons.map((button:ButtonProps, i:number) =>
                    <ToggleButton key={i} {...button} onSelection={this.handleButton} active={this.state.buttonsActiveState[i]} id={i}/>
                )}
            </ButtonGroup>
        );
    }
}

type ToggleButtonProps = {
    name:string,
    onSelection:(i:number) => void
    //value:string,
    id:number, //pass this back rather than value???
    active:boolean
}

class ToggleButton extends React.Component<ToggleButtonProps>{
    constructor(props:ToggleButtonProps){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    setActive(bool:boolean){
        this.setState({active:bool});
    }
    handleClick(e:React.MouseEvent<HTMLButtonElement, MouseEvent>){
        this.props.onSelection(this.props.id);
    }
    render(){
        return(
            <Button color="secondary" onClick={this.handleClick}>
                {this.props.name}<UpDownArrow active={this.props.active}/>
            </Button>
        );
    }
}

type ArrowState = {
    active:boolean
}

const UpDownArrow: React.FunctionComponent<ArrowState> = ({active}) => {
    let arrow:JSX.Element;
    if(active){
        arrow = <ArrowDropDownIcon/>
    }else{
        arrow = <ArrowDropUpIcon/>
    }
    return (arrow);
}