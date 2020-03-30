import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {TextBox} from './components/textInfoBox';
import {BoundInput} from './components/boundInput';

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
<BoundInput/>
</div>;

const buttons = [{button:{name: 'Bounds'}, component:boundsComponent},
                {button:{name: 'Info'}, component:infoComponent}];
*/

ReactDOM.render(<App/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
