// import 'rc-tree/assets/index.css';

import rp from 'request-promise';
import React from 'react';
import SuitsTree from './suitsTree';
import config from './../../globalConfig';
import {ee} from './common';

let InputView = React.createClass({
    getInitialState: function() {
        return {
            suitIds: [],
            customLoading: false,
            coveragePercentage: 0,
            isInputEmpty: true,
            allTc: 0,
            selectedTc: 0,
            otherTc: 0,
        };
    },

    clearStore: function(){
        let options = {
            uri: config.frontend.baseUrl+':'+config.frontend.port+'/connector/cleanStore',
            method: 'POST'
        };
        rp(options)
            .then(function (res) {
                if(!res){
                    throw new Error('Store was not cleaned');
                }
            })
            .catch(function(err){
                throw new Error(err);
            });
    },

    componentDidMount: function() {
        let _this = this;
        let isAnyNodeChecked;
        ee.addListener('ids.add', function(item) {
            isAnyNodeChecked = item.length>0;
            _this.setState({
                suitIds: item,
                isInputEmpty: !isAnyNodeChecked,
            });
        });
    },
    componentWillUnmount: function() {
        ee.removeListener('ids.add');
    },

    onChangeHandler: function(e) {
        if (e.target.value.trim().length > 0) {
            this.setState({isInputEmpty: false})
        } else {
            this.setState({isInputEmpty: true})
        }
        this.setState({suitIds: e.target.value.split(',')})
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        let _this = this;
        let inputState = _this.state.suitIds || [config.frontend.defaultSuitId];
        console.log(inputState);
        let options = {
            uri: config.frontend.baseUrl+':'+config.frontend.port+'/connector/getTcData',
            method: 'POST',
            body: {suiteIds: inputState},
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
                _this.setState({
                    customLoading: false,
                    coveragePercentage: (res.selectedCount*100/res.tcCount).toFixed(2),
                    allTc: res.tcCount,
                    selectedTc: res.selectedCount,
                });
                ee.emit('percentage.add',_this.state);
            })
            .catch(function(err){
                console.log(err);
                _this.setState({
                    customLoading: false,
                });
                ee.emit('percentage.add',_this.state);
            })
    },

    onExpandTree: function(){

    },

    render: function() {
        return (
            <div className="input_view" data={this.state} ref="input_data">
                <div className="header">
                    <p className="header_text">
                        <strong>Select suit</strong>
                    </p>
                </div>
                <div className="field">
                    <b className="field_title">Enter suit IDs</b>
                    <input
                        // onLoad={this.clearStore}
                        className='suite_input'
                        value={this.state.suitIds}
                        onChange={this.onChangeHandler}
                    />
                </div>
                <SuitsTree />
                <button
                    className='add_btn'
                    disabled={this.state.isInputEmpty}
                    onClick={this.onBtnClickHandler}>
                    Show coverage
                </button>
                <button
                    className='reset_btn'
                    onClick={this.clearStore}>
                    Reset store
                </button>
            </div>
        );
    }
});

module.exports = InputView;