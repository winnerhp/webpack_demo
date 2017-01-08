import './react_one.less';

import React,{ Component } from 'react';
import { render } from 'react-dom';

import Children from 'component/react-children/react-children';

class Parent extends Component {
    render() {
        return (
            <div className="a">
                <Children />
                <h3>parent</h3>
            </div>
        )
    }
}

render(<Parent />,document.getElementById('root'));