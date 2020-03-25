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
        width: 1200,
        height: 700
      },
      mouseDown:false
    }
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
