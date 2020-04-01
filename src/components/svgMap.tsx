import React from 'react';
import ReactDOM from 'react-dom';
import Map from '../containers/map';
import {AirportProps} from './airport';
import {Airports} from '../containers/airports';
import {MapOverlay} from './mapOver';
import {AirportPopup} from './airportPopup';


import {BoundingBox, Coordinate,  longitudeDifference} from '../scripts/coordinateHelpers';
import {floatGT} from '../scripts/floatError';

import '../css/map.css';

/*export type BoundingBox = {
    min_longitude: number,
    max_longitude: number,
    min_latitude: number,
    max_latitude: number,
}*/

type Point = {
    x:number,
    y:number
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
    bound: BoundingBox, //bound of full map to render given coordinates
    width: number,
    height: number,
}

type MapCanvasState = {
    transform:Transform,
    initialZoom:number,
    mouse:Point,
    rawMouse:Point,
    mapViewBounds:BoundingBox,
    mouseDown:boolean,
    selectedAirport:AirportProps|undefined
    //mouse:DOMPoint,
    //matrix:DOMMatrix
}

//important!!!
//to do map that splits into 2 from 180 -180 

class SvgMapCanvas extends React.Component<MapCanvasProps, MapCanvasState>{
    private svgRef:React.RefObject<SVGSVGElement>;
    private transformRef:React.RefObject<SVGSVGElement>;
    //private initialZoom:number;
    constructor(props:MapCanvasProps){
        super(props, {transform: getTransformation(props)});
        this.svgRef = React.createRef<SVGSVGElement>();
        this.transformRef = React.createRef<SVGSVGElement>();
        let transformation = getTransformation(props);
        this.state = {
            transform:transformation,
            initialZoom:transformation.scale.x,
            mouse: {x:0, y:0},
            rawMouse: {x:0, y:0},
            mouseDown: false,
            mapViewBounds: props.bound,
            selectedAirport: undefined
        };
        //this.initialZoom = transformation.scale.x;
        //function bindings
        this.handleMove = this.handleMove.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleDown = this.handleDown.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.selectAirport = this.selectAirport.bind(this);
        this.deselectAirport = this.deselectAirport.bind(this);
    }
    getMapViewBounds(transformation?:Transform){
        //no transformation
        let bounds:BoundingBox;
        //let matrix:DOMMatrix = this.transformRef.current!.getCTM()!.inverse();
        let matrix:DOMMatrix;
        if (transformation){
            matrix = new DOMMatrix();
            matrix.scaleSelf(transformation.scale.x, transformation.scale.y);
            matrix.translateSelf(transformation.translate.x, transformation.translate.y);
            matrix.invertSelf();
        }else{
            matrix = this.transformRef.current!.getCTM()!.inverse();
            //matrix = new DOMMatrix();
            //matrix.scaleSelf(this.state.transform.scale.x, this.state.transform.scale.y);
            //matrix.translateSelf(this.state.transform.translate.x, this.state.transform.translate.y);
            //matrix.invertSelf();
        }
        let pt1:DOMPoint = new DOMPoint(0, 0);
            let topLeft:DOMPoint = pt1.matrixTransform(matrix);
            let min_lon = topLeft.x;
            let max_lat = topLeft.y;
            let pt2:DOMPoint = new DOMPoint(this.props.width, this.props.height);
            let botRight:DOMPoint = pt2.matrixTransform(matrix);
            let max_lon = botRight.x;
            let min_lat = botRight.y;
            bounds = {
                min_longitude: min_lon,
                min_latitude: min_lat,
                max_longitude: max_lon,
                max_latitude: max_lat
            }
        return bounds;
    }
    getMatrix(){
        return new DOMMatrix([
            this.state.transform.scale.x, this.state.transform.scale.x, 
            this.state.transform.scale.y, this.state.transform.scale.y,
            this.state.transform.translate.x, this.state.transform.translate.y
        ]);
    }
    updateMousePoint(e:React.MouseEvent){
        const node = this.svgRef.current!;
        const tf = this.transformRef.current!;
        let pt:DOMPoint = node.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        let newPoint:Point = pt.matrixTransform(tf.getScreenCTM()!.inverse());
        return newPoint;
    }
    componentDidMount(){
        let viewBound:BoundingBox = this.getMapViewBounds();
        this.setState({mapViewBounds: viewBound});
        //console.log(viewBound);
        //console.log(this.state.transform);
    }
    componentDidUpdate(prevProps:MapCanvasProps){
        if(this.props.bound !== prevProps.bound){
            let transformation  = getTransformation(this.props);
            let viewBound:BoundingBox = this.getMapViewBounds(transformation);
            this.setState({transform:transformation, mapViewBounds: viewBound, initialZoom:transformation.scale.x});
            console.log(transformation);
            console.log(viewBound);
        }
    }
    handleMove(e:React.MouseEvent){
        let lastPoint:Point = this.state.mouse;
        const node = this.svgRef.current!;
        const tf = this.transformRef.current!;
        let pt:DOMPoint = node.createSVGPoint();
        pt.x = e.clientX; pt.y = e.clientY;
        let newPoint:Point = pt.matrixTransform(tf.getScreenCTM()!.inverse());
        let rawMouse = {
            x:e.clientX,
            y:e.clientY
        }
        if(this.state.mouseDown){
            //panning the map with mouse
            let translateShift = {
                x: newPoint.x - lastPoint.x,
                y: newPoint.y - lastPoint.y
            }
            if(this.state.mapViewBounds.min_longitude - translateShift.x < this.props.bound.min_longitude){
                translateShift.x = this.state.mapViewBounds.min_longitude - this.props.bound.min_longitude;
            }else if(this.state.mapViewBounds.max_longitude - translateShift.x > this.props.bound.max_longitude){
                translateShift.x = this.state.mapViewBounds.max_longitude - this.props.bound.max_longitude;
            }
            if(this.state.mapViewBounds.min_latitude - translateShift.y < this.props.bound.min_latitude){
                translateShift.y = this.state.mapViewBounds.min_latitude - this.props.bound.min_latitude;
            }else if(this.state.mapViewBounds.max_latitude - translateShift.y > this.props.bound.max_latitude){
                translateShift.y = this.state.mapViewBounds.max_latitude - this.props.bound.max_latitude;
            }
            let newTransformation:Transform = {
                scale: this.state.transform.scale,
                rotate: this.state.transform.rotate,
                translate: {
                    x: this.state.transform.translate.x+translateShift.x, 
                    y: this.state.transform.translate.y+translateShift.y
                }
            }
            newPoint.x -= translateShift.x; newPoint.y -= translateShift.y;
            let newViewBounds:BoundingBox = {
                min_longitude: this.state.mapViewBounds.min_longitude - translateShift.x,
                max_longitude: this.state.mapViewBounds.max_longitude - translateShift.x,
                min_latitude: this.state.mapViewBounds.min_latitude - translateShift.y,
                max_latitude: this.state.mapViewBounds.max_latitude - translateShift.y
            }
            this.setState({transform: newTransformation, mouse:newPoint, rawMouse:rawMouse, mapViewBounds: newViewBounds});
        }else{
            this.setState({mouse: newPoint, rawMouse:rawMouse});
        }
    }
    handleUp(e:React.MouseEvent){
        this.setState({mouseDown:false});
    }
    handleDown(e:React.MouseEvent){
        this.setState({mouseDown:true});
    }
    handleLeave(e:React.MouseEvent){
        this.setState({mouseDown:false});
    }
    handleWheel(e:React.WheelEvent){
        //zoom in / out by zoomScale
        let maxZoom:number = 150;
        let zoomScale:number = 1.1;
        let newZoom = this.state.transform.scale.x;
        let lonDifference = longitudeDifference(this.state.mapViewBounds.max_longitude, this.state.mapViewBounds.min_longitude);
        let latDifference = this.state.mapViewBounds.max_latitude - this.state.mapViewBounds.min_latitude;
        // mouse position on map from 0 - 1 for width and height
        let mouseScalar = {
            x: (this.state.mouse.x-this.state.mapViewBounds.min_longitude)/lonDifference,
            y: 1-(this.state.mouse.y-this.state.mapViewBounds.min_latitude)/latDifference
        }
        let lonScaleDifference = lonDifference - lonDifference/zoomScale;
        let latScaleDifference = latDifference - latDifference/zoomScale;
        let translateShift = {
            x: 0,
            y: 0
        }
        if(e.deltaY > 0){ //zoom out
            //if(this.state.transform.scale.x > this.initialZoom){ // old : float may not carry correct values after zoom
            if(floatGT(this.state.transform.scale.x, this.state.initialZoom)){
                newZoom /= zoomScale;

                //translate shift is not exactly correct since scaleDifference changes on zoom out
                //translate should adjust to keep mouse in same the position
                translateShift.x = lonScaleDifference*mouseScalar.x*zoomScale;
                translateShift.y = -latScaleDifference*mouseScalar.y*zoomScale;

                // re-adjust for going over bounds on zoom out
                
                if(this.state.mapViewBounds.min_longitude - translateShift.x < this.props.bound.min_longitude){
                    translateShift.x = this.state.mapViewBounds.min_longitude - this.props.bound.min_longitude;
                }else if(this.state.mapViewBounds.max_longitude + lonScaleDifference - translateShift.x > this.props.bound.max_longitude){
                    translateShift.x = this.state.mapViewBounds.max_longitude + lonScaleDifference - this.props.bound.max_longitude;
                }
                if(this.state.mapViewBounds.min_latitude - latScaleDifference - translateShift.y < this.props.bound.min_latitude){
                    translateShift.y = this.state.mapViewBounds.min_latitude - latScaleDifference - this.props.bound.min_latitude;
                }else if(this.state.mapViewBounds.max_latitude - translateShift.y > this.props.bound.max_latitude){
                    translateShift.y = this.state.mapViewBounds.max_latitude - this.props.bound.max_latitude;
                }
            }
        }
        else if(e.deltaY < 0){ // zoom in
            if(this.state.transform.scale.x < maxZoom){
                newZoom *= zoomScale;
                translateShift.x = -lonScaleDifference*mouseScalar.x;
                translateShift.y = latScaleDifference*mouseScalar.y;
            }
        }
        let newTransformation:Transform = {
            scale: {x: newZoom, y: -newZoom},
            rotate: this.state.transform.rotate,
            translate: {x: this.state.transform.translate.x+translateShift.x, y:this.state.transform.translate.y+translateShift.y}
        }
        let newMouse:Point = this.updateMousePoint(e);
        /*let newViewBounds:BoundingBox = {
            min_longitude: this.state.mapViewBounds.min_longitude - translateShift.x,
            max_longitude: this.state.mapViewBounds.max_longitude - translateShift.x,
            min_latitude: this.state.mapViewBounds.min_latitude - translateShift.y,
            max_latitude: this.state.mapViewBounds.max_latitude - translateShift.y
        }*/
        this.setState({transform: newTransformation, mouse: newMouse, mapViewBounds: this.getMapViewBounds(newTransformation)});
    }
    selectAirport(airport:AirportProps){
        this.setState({selectedAirport: airport});
    }
    deselectAirport(){
        this.setState({selectedAirport: undefined});
    }
    render(){
        return (
        <div className='Map'>
            <svg
            ref={this.svgRef} 
            width={this.props.width} height={this.props.height} 
            onMouseMove={this.handleMove}
            onMouseDown={this.handleDown}
            onMouseUp={this.handleUp}
            onMouseLeave={this.handleLeave}
            onWheel={this.handleWheel}
            >
                <g ref={this.transformRef} transform={transformString(this.state.transform)}>
                    <Map maxBound={this.props.bound} viewBound={this.state.mapViewBounds} zoomLevel={this.state.transform.scale.x}/>
                    <Airports 
                        onSelection={this.selectAirport} onDeselection={this.deselectAirport}
                        maxBound={this.props.bound} viewBound={this.state.mapViewBounds} zoomLevel={this.state.transform.scale.x}
                    />
                </g>
            </svg>
            <MapOverlay mouse={this.state.mouse} zoomLevel={this.state.transform.scale.x} selectedAirport={this.state.selectedAirport}/>
            <AirportPopup width={this.props.width} height={this.props.height}
            mouse={this.state.mouse} rawMouse={this.state.rawMouse} selectedAirport={this.state.selectedAirport}/>
        </div>);
    }
    /*<div className='Overlay'>
        <div>{this.state.mouse.x.toFixed(2)} {this.state.mouse.y.toFixed(2)}</div>
        <div>{this.state.transform.scale.x}</div> 
        <div>{this.state.selectedAirport}</div>
    </div>*/
}

function getTransformation(cp:MapCanvasProps){
    let lonDifference:number = longitudeDifference(cp.bound.max_longitude, cp.bound.min_longitude);
    let latDifference:number = cp.bound.max_latitude-cp.bound.min_latitude;
    let scaleFactor:number;
    let translateX:number = 0;
    let translateY:number = 0;
    if(cp.height/latDifference < cp.width/lonDifference){
        scaleFactor = cp.width/lonDifference;
        translateY = (latDifference-(cp.height/scaleFactor))/2;
    }else{
        scaleFactor = cp.height/latDifference;
        translateX = (lonDifference-(cp.width/scaleFactor))/2;
    }
    //scaleFactor = cp.width/(cp.bounds.max_longitude-cp.bounds.min_longitude);
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
        x: -cp.bound.min_longitude-translateX,
        y: -cp.bound.max_latitude+translateY
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

function getMapViewBounds(pt:DOMPoint, matrix:DOMMatrix, width:number, height:number){
    pt.x = 0; pt.y = 0;
    let topLeft = pt.matrixTransform(matrix);
    let min_lon = topLeft.x;
    let max_lat = topLeft.y;
    pt.x = width; pt.y = height;
    let botRight = pt.matrixTransform(matrix);
    let max_lon = botRight.x;
    let min_lat = botRight.y;
    let bounds:BoundingBox = {
        min_longitude: min_lon,
        min_latitude: min_lat,
        max_longitude: max_lon,
        max_latitude: max_lat
    }
    return bounds;
}

export default SvgMapCanvas;