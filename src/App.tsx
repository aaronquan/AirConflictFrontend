import React from 'react';
import axios from 'axios';
import './css/App.css';
import { render } from '@testing-library/react';

import SvgMapCanvas, {MapCanvasProps} from './components/svgMap';
import Map from './containers/map';

type AppState = {
  mapCanvasState:MapCanvasProps,
  mouseDown:boolean
}

class App extends React.Component<{}, AppState>{
  constructor(props:{}){
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
        height: window.innerHeight
      },
      mouseDown:false
    }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
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
  render(){
    return (
      <div className="App" >
        <header className="App-header">
          <SvgMapCanvas {...this.state.mapCanvasState}/>
        </header>
      </div>
    );
  }
}

export default App;
