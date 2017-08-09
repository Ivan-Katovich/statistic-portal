require('./css/app.css');
require('react-loading-spinner/src/css/index.css');
require('reactjs-percentage-circle/src/style.css');
// import css from './frontend/css/app.css';

const React = require('react');
const ReactDOM = require('react-dom');
const InputView = require('./components/inputView');
const PercentageView = require('./components/percentageView');
const LoadingSpinner = require('./components/loadingSpinner');

let ee = require('./components/common').ee;

let App = React.createClass({

    getInitialState: function() {
        return {
            customLoading: false,
            coveragePercentage: 0,
        };
    },

    componentDidMount: function() {
        let _this = this;
        ee.addListener('percentage.add', function(item) {
            _this.setState({
                customLoading: item.customLoading,
                coveragePercentage: item.coveragePercentage,
            });
        });
    },
    componentWillUnmount: function() {
        ee.removeListener('percentage.add');
    },

    render: function() {
        return (
            <div className="app">
                <div>
                    <InputView />
                </div>
                <div>
                    <LoadingSpinner data={this.state.customLoading} />
                </div>
                <div>
                    <PercentageView data={this.state.coveragePercentage} />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);