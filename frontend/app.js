require('./css/app.css');
// import css from './frontend/css/app.css';

const rp = require('request-promise');
const React = require('react');
const ReactDOM = require('react-dom');

// window.ee = new EventEmitter();

let App = React.createClass({
    render: function() {
        return (
            <div className="app">
                Hello, I am statistic portal
                <AddSuitId />
            </div>
        );
    }
});

let AddSuitId = React.createClass({
    getInitialState: function() {
        return {
            myValue: ''
        };
    },
    onChangeHandler: function(e) {
        this.setState({myValue: e.target.value})
    },
    onBtnClickHandler: function() {
        let inputState = this.state.myValue || 29651;
        console.log(inputState);
        let options = {
            uri: 'http://localhost:3001/connector/getTcData',
            method: 'POST',
            body: {suiteId: inputState},
            json: true
        };
        rp(options)
            .then(function (res) {
                console.log(res);
                alert((res.selectedCount*100/res.tcCount).toFixed(2)+'%');
            })
            .catch(function(err){
                console.log(err);
            })
    },
    render: function() {
        return (
            <div>
                <input
                    className='test-input'
                    value={this.state.myValue}
                    onChange={this.onChangeHandler}
                    placeholder='add value'
                />
                <button className='add__btn' onClick={this.onBtnClickHandler}>Show alert</button>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);