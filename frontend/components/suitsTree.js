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

let getCorrectCheckedNodes = function(checkedNodes){
    for(let i = 0;i<checkedNodes.length;){
        let change = true;
        for(let n = 0;n<checkedNodes.length;n+=1){
            // console.log(i+' ---- '+n);
            // console.log(checkedNodes[i].key+'  '+i+' ---- '+checkedNodes[n].key+'  '+n);
            if(checkedNodes[i].key !== checkedNodes[n].key){
                if((checkedNodes[i].key.indexOf(checkedNodes[n].key) === 0 || checkedNodes[n].key.indexOf(checkedNodes[i].key) === 0) &&
                    checkedNodes[n].key.split('-').length !== checkedNodes[i].key.split('-').length){
                    if(checkedNodes[n].key.length>checkedNodes[i].key.length){
                        // console.log('removed n '+checkedNodes[n].key);
                        checkedNodes.splice(n,1);
                        n=n-1;
                    }
                    if(checkedNodes[n].key.length<checkedNodes[i].key.length){
                        // console.log('removed i '+checkedNodes[i].key);
                        checkedNodes.splice(i,1);
                        change = false;
                    }
                }
            }
        }
        if(change){
            i+=1;
        }
    }

    return checkedNodes;
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
                { id: config.frontend.parentSuiteId, title: config.frontend.parentSuiteTitle, key:'0-0' }
            ],
        });
    },

    onCheckHandler: function(checkedKeys,e){
        let _this=this;
        Promise.resolve()
            .then(function () {
                return _this.setState({ids:[]});
            })
            .then(function () {
                let ids = _this.state.ids;
                let checkedNodes = getCorrectCheckedNodes(e.checkedNodes);
                checkedNodes.forEach((node)=>{
                    ids.push(node.props.id);
                });
                return ids;
            })
            .then(function (newIds) {
                return _this.setState({ids:newIds});
            })
            .then(function () {
                ee.emit('ids.add',_this.state.ids);
            })
        // if(ids.includes(e.node.props.id && e.checked)){
        //
        // }else if(ids.includes(e.node.props.id) && !e.checked){
        //     ids.remove(e.node.props.id)
        // }else if(!ids.includes(e.node.props.id) && e.checked){
        //     ids.push(e.node.props.id);
        // }else if(!ids.includes(e.node.props.id) && !e.checked){
        //
        // }
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
                let disableCb = item.id === '4189';
                if (item.children) {
                    return (
                        <TreeNode disableCheckbox={disableCb} title={item.title} id={item.id} key={item.key}>{loop(item.children)}</TreeNode>
                    );
                }else{
                    return (
                        <TreeNode disableCheckbox={disableCb} title={item.title} id={item.id} key={item.key}/>
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
