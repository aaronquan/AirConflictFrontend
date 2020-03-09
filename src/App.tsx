import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

import SvgMapCanvas, {MapCanvasProps} from './components/svgMap';
import Map from './containers/map';

type AppState = {
  mapCanvasState:MapCanvasProps,
}

class App extends React.Component{
  state:AppState = {
    mapCanvasState: {
      bounds: {
        min_longitude: -20,
        max_longitude: 75,
        min_latitude: -20,
        max_latitude: 70,
      },
      /*bounds: {
        min_longitude: 108,
        max_longitude: 157,
        min_latitude: -44,
        max_latitude: -9,
      },*/
      width: 700,
      height: 700
    }
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <SvgMapCanvas {...this.state.mapCanvasState}/>
        </header>
      </div>
    );
  }
}

export default App;
