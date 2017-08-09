const rp = require('request-promise');
const React = require('react');
const config = require('./../../globalConfig');
let ee = require('./common').ee;
// const PercentageCircle = require('react-native-percentage-circle');

// window.ee = new EventEmitter();

let InputView = React.createClass({
    getInitialState: function() {
        return {
            suitId: '',
            customLoading: false,
            coveragePercentage: 0,
        };
    },
    onChangeHandler: function(e) {
        // let inputData =  ReactDOM.findDOMNode(this.refs.input_data).props.data;
        // console.log(inputData);
        this.setState({suitId: e.target.value})
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        let _this = this;
        let inputState = _this.state.suitId || config.frontend.defaultSuitId;
        console.log(inputState);
        let options = {
            uri: config.frontend.baseUrl+':'+config.frontend.port+'/connector/getTcData',
            method: 'POST',
            body: {suiteId: inputState},
            json: true
        };
        _this.setState({
            customLoading: true
        });
        // console.log(_this.state);
        ee.emit('percentage.add',_this.state);
        Promise.resolve()
            .then(function () {
                return _this.setState({
                    customLoading: true
                });
            })
            .then(function () {
                console.log(_this.state);
                return ee.emit('percentage.add',_this.state);
            })
            .then(function () {
                return rp(options);
            })
            .then(function (res) {
                console.log(_this.state);
                _this.setState({
                    customLoading: false,
                    coveragePercentage: (res.selectedCount*100/res.tcCount).toFixed(2)
                });
                ee.emit('percentage.add',_this.state);
            })
            .catch(function(err){
                console.log(err);
            })
    },
    render: function() {
        return (
            <div className="input_view" data={this.state} ref="input_data">
                <input
                    className='test_input'
                    value={this.state.suitId}
                    onChange={this.onChangeHandler}
                    placeholder='add suit id'
                />
                <button className='add_btn' onClick={this.onBtnClickHandler}>Show coverage</button>
            </div>
        );
    }
});

module.exports = InputView;