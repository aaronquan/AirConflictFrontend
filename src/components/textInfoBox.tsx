import React from 'react';

type TextBoxProps = {
    text: string
}

export class TextBox extends React.Component<TextBoxProps>{
    constructor(props:TextBoxProps){
        super(props);
    }
    render(){
        return(<>{this.props.text}</>);
    }
}