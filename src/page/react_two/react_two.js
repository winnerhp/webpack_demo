import React,{ Component } from 'react';
import { render } from 'react-dom';

import Children from 'component/react-children/react-children';

class Parent extends Component {
    render() {
        return (
            <div>
                <Children />
                <h3>demo2</h3>
            </div>
        )
    }
}

render(<Parent />,document.getElementById('root'));