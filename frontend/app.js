// require('./css/app.css');
// require('react-loading-spinner/src/css/index.css');
// require('reactjs-percentage-circle/src/style.css');
import './css/app.css';
import 'react-loading-spinner/src/css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import InputView from './components/inputView';
import { PercentageView } from './components/percentageView';
import { LoadingSpinner } from './components/loadingSpinner';

// let ee = require('./components/common').ee;
import {ee} from './components/common'

let App = React.createClass({

    getInitialState: function() {
        return {
            customLoading: false,
            coveragePercentage: 0,
            allTc: 0,
            selectedTc: 0
        };
    },

    componentDidMount: function() {
        let _this = this;
        ee.addListener('percentage.add', function(item) {
            _this.setState({
                customLoading: item.customLoading,
                coveragePercentage: item.coveragePercentage,
                allTc: item.allTc,
                selectedTc: item.selectedTc,
            });
        });
    },
    componentWillUnmount: function() {
        ee.removeListener('percentage.add');
    },

    render: function() {
        return (
            <div className="app">
                <InputView />
                <LoadingSpinner data={this.state.customLoading} />
                <PercentageView data={this.state} />
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);