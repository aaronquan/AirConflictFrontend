import React from 'react';
import axios from 'axios';
import './css/App.css';
import { render } from '@testing-library/react';

import SvgMapCanvas, {MapCanvasProps} from './components/svgMap';
import Map from './containers/map';
import {ToggleButtonDropdown, ToggleButtonText} from './components/toggleButtonDropdown';
import {BoundInput} from './components/boundInput';

import {BoundingBox} from './scripts/coordinateHelpers';

/*
const infoComponent:JSX.Element = 
<div className='Info'>
    <div>
    This app is a airport map demo, displaying real earth and airport data from a custom REST API. 
    The app runs with the web framework React. SVG is used to render the map. 
    Adjust the bounding box of the map by opening the bound tab.
    </div>
    <br></br>
    <div>
        <b>Controls:</b>
        <ul>
            <li>Mouse drag to pan map</li>
            <li>Arrow keys to pan map</li>
            <li>Scroll wheel to zoom in and out</li>
            <li>z to zoom in and y to zoom out</li>
        </ul>
    </div>
</div>;

const boundsComponent:JSX.Element = 
<div className='Info'>
Adjust map bounds
<BoundInput action={this.updateMapBounds}/>
</div>;

const buttons = [{button:{name: 'Bounds'}, component:boundsComponent},
                {button:{name: 'Info'}, component:infoComponent}];
*/

type AppState = {
  mapCanvasState:MapCanvasProps,
  buttons:ToggleButtonText[]
}
type AppProps = {
  //buttons:ToggleButtonText[],
}



const toggleButtonDropdownConfig = {
  width:350,
  //height:500,
  componentPosition: {
    right:0,
    top:35
  },
  buttonsPosition: {
    right:0
  },
  buttonHeight:30
};

class App extends React.Component<AppProps, AppState>{
  private buttons:ToggleButtonText[];
  constructor(props:AppProps){
    super(props);
    this.state =  {
      mapCanvasState: {
        bound: {
          min_longitude: 108,
          max_longitude: 157,
          min_latitude: -44,
          max_latitude: -9,
        },
        /*bound: {
          min_longitude: -15,
          max_longitude: 45,
          min_latitude: -15,
          max_latitude: 45,
        },*/
        width: window.innerWidth, // temporary solution
        height: window.innerHeight,
      },
      buttons:[{button:{name: 'Bounds'}, component:this.boundsComponent()},
              {button:{name: 'Info'}, component:this.infoComponent()}]
    }
    this.buttons = [];
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.updateMapBounds = this.updateMapBounds.bind(this);
  }
  componentDidMount() {
    this.buttons = [{button:{name: 'Bounds'}, component:this.boundsComponent()},
    {button:{name: 'Info'}, component:this.infoComponent()}];
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  //TODO update svg map on resize of window
  updateWindowDimensions() {
    let bound = this.state.mapCanvasState.bound;
    this.setState({mapCanvasState:{bound:bound, width: window.innerWidth, height: window.innerHeight }});
  }
  updateMapBounds(bounds:BoundingBox){
    console.log('called');
    console.log(bounds);
    this.setState({mapCanvasState:{bound:bounds, width: window.innerWidth, height: window.innerHeight }});
  }
  infoComponent(){
    return(
    <div className='Info'>
      <div>
      This app is a airport map demo, displaying real earth and airport data from a custom REST API. 
      The app runs with the web framework React. SVG is used to render the map. 
      Adjust the bounding box of the map by opening the bound tab.
      </div>
      <br></br>
      <div>
        <b>Controls:</b>
        <ul>
          <li>Mouse drag to pan map</li>
          <li>Arrow keys to pan map</li>
          <li>Scroll wheel to zoom in and out</li>
          <li>z to zoom in and y to zoom out</li>
        </ul>
      </div>
    </div>
    );
  }
  boundsComponent(){
    return(
      <div className='Info'>
      Adjust map bounds
      <BoundInput action={this.updateMapBounds}/>
      </div>
    );
  }
  render(){
    return (
      <div className="App" >
        <header className="App-header">
          <SvgMapCanvas {...this.state.mapCanvasState}/>
          <div className='TopRight'>
            <ToggleButtonDropdown {...toggleButtonDropdownConfig} buttons={this.buttons}/>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
