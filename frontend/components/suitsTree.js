import 'rc-tree/assets/index.css';

import rp from 'request-promise';
import React from 'react';
import Tree, { TreeNode } from 'rc-tree';
import {ee} from './common';
import config from './../../globalConfig';

Array.prototype.remove = function(value){
    this.forEach((item,i)=>{
        if(item === value){
            this.splice(i,1);
        }
    })
};

let getNewTreeData = function(treeData, curKey, curId, child){
    const loop = (data) => {
        data.forEach((item)=>{
            if (curKey.indexOf(item.key) === 0) {
                if (item.children) {
                    loop(item.children);
                } else if(curId === item.id){
                    item.children = child;
                }
            }
        });
    };
    loop(treeData);
};

let getAlreadyLoadedChildren = function(treeData,curKey,curId){
    let arr = [];
    const loop = (data) => {
        data.forEach((item)=>{
            if (curKey.indexOf(item.key) === 0) {
                if (item.children) {
                    console.log(item);
                    if (curId === item.id) {
                        arr.push(item.children);
                    } else {
                        return loop(item.children)
                    }
                }else if(!item.children && curId === item.id){}
            }
        });
        return arr;
    };
    return loop(treeData);
};

let generateTreeNodes = function(treeNode){
    let options = {
        uri: config.frontend.baseUrl+':'+config.frontend.port+'/connector/getSuitChildrenData',
        method: 'POST',
        body: {suiteId: treeNode.props.id},
        json: true
    };
    return rp(options)
        .then(function (data) {
            data.forEach((item,i)=>{
                item.key = treeNode.props.eventKey+'-'+i;
            });
            return data;
        });
};

let SuitsTree = React.createClass({

    getInitialState() {
        return {
            treeData: [],
            ids: []
        };
    },

    componentDidMount() {
        this.setState({
            treeData: [
                { id: '4189', title: 'ImageRight Current Release', key:'0-0' }
            ],
        });
    },

    onCheckHandler: function(checkedKeys,e){
        let _this = this;
        let ids = _this.state.ids;
        if(ids.includes(e.node.props.id)){
            ids.remove(e.node.props.id)
        }else{
            ids.push(e.node.props.id);
        }
        _this.setState({
            ids:ids,
        });
        return ee.emit('ids.add',_this.state.ids);
    },

    onLoadData: function(treeNode){
        let _this = this;
        return Promise.resolve()
            .then(function () {
                let children = getAlreadyLoadedChildren(_this.state.treeData,treeNode.props.eventKey,treeNode.props.id);
                if(children && children.length>0){
                    return children;
                }else{
                    return generateTreeNodes(treeNode);
                }
                // return generateTreeNodes(treeNode);
            })
            .then(function (childData) {
                const treeData = [..._this.state.treeData];
                getNewTreeData(treeData,treeNode.props.eventKey,treeNode.props.id,childData);
                _this.setState({
                    treeData
                });
            })
    },

    render: function(){

        const loop = (data) => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode title={item.title} id={item.id} key={item.key}>{loop(item.children)}</TreeNode>
                    );
                }else{
                    return (
                        <TreeNode title={item.title} id={item.id} key={item.key}/>
                    );
                }
            });
        };

        const treeNodes = loop(this.state.treeData);

        return (
            <div id="tree">
                <Tree
                    className="file_tree" showLine checkable
                    loadData={this.onLoadData}
                    onCheck={this.onCheckHandler}
                >
                    {treeNodes}
                </Tree>
            </div>
        )
    }
});

module.exports = SuitsTree;
