import React from 'react';
import Map from '../containers/map';
import {Airports} from '../containers/airports';

export type BoundingBox = {
    min_longitude: number,
    max_longitude: number,
    min_latitude: number,
    max_latitude: number,
}

type Scale = {
    x: number,
    y: number
}

type Rotate = {
    a: number, // rotation <a> degrees
    x: number,
    y: number
}
type Translate = {
    x: number,
    y: number
}

type Transform = {
    scale:Scale,
    rotate:Rotate,
    translate:Translate
}

export type MapCanvasProps = {
    bounds: BoundingBox,
    width: number,
    height: number
}

type MapCanvasState = {
    transform:Transform
    svgRef:any
}

class SvgMapCanvas extends React.Component<MapCanvasProps, MapCanvasState>{
    constructor(props:MapCanvasProps){
        super(props, {transform: getTransformation(props)});
        this.state = {
            transform:getTransformation(props),
            svgRef: React.createRef()
        };
        console.log(this.state);
    }
    mouseMove(e:React.MouseEvent){
        // to solve after pagination sychronous problem. 
        //console.log(this.state.svgRef);
        /*
        let pt = this.state.svgRef.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        let cursorpt = pt.matrixTransform(this.state.svgRef.getScreenCTM().inverse());
        console.log(cursorpt);
        */
    }
    render(){
        return (<svg ref={this.state.svgRef} width={this.props.width} height={this.props.height} onMouseMove={this.mouseMove}>
            <g transform={transformString(this.state.transform)}><Map {...this.props.bounds}/><Airports /></g>
            </svg>);
    }
}

function getTransformation(cp:MapCanvasProps){
    let scaleFactor = cp.width/(cp.bounds.max_longitude-cp.bounds.min_longitude);
    let sc:Scale = {
        x: scaleFactor,
        y: -scaleFactor
    }
    let rt:Rotate = {
        a: 0,
        x: 0,
        y: 0
    }
    let tl:Translate = {
        x: -cp.bounds.min_longitude,
        y: -cp.bounds.max_latitude
    }
    let tf:Transform = {
        scale: sc,
        rotate: rt,
        translate: tl,
    };
    return tf;
}

function transformString(tf:Transform){
    let scaleStr:string = `scale(${tf.scale.x} ${tf.scale.y})`;
    let rotateStr:string = `rotate(${tf.rotate.a} ${tf.rotate.x} ${tf.rotate.y})`;
    let translateStr:string = `translate(${tf.translate.x} ${tf.translate.y})`;
    return `${scaleStr} ${rotateStr} ${translateStr}`;
}

export default SvgMapCanvas;