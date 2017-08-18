import React from 'react';
import { Circle } from 'rc-progress';

export let PercentageView = React.createClass({
    render: function(){
        let percentage = this.props.data.coveragePercentage;
        let allTc = this.props.data.allTc;
        let selectedTc = this.props.data.selectedTc;
        let smilePath;
        let smileClass;
        (function(){
            switch(true){
                case selectedTc === 0 || percentage === 0:
                    smilePath = "http://i66.tinypic.com/nodjbl.jpg";
                    smileClass = 'none';
                    break;
                case percentage<=25:
                    smilePath = "http://i66.tinypic.com/nodjbl.jpg";
                    smileClass = '';
                    break;
                case percentage>25 && percentage<=40:
                    smilePath = "http://i65.tinypic.com/j14jk7.jpg";
                    smileClass = '';
                    break;
                case percentage>40 && percentage<=55:
                    smilePath = "http://i68.tinypic.com/mkvths.jpg";
                    smileClass = '';
                    break;
                case percentage>55 && percentage<=75:
                    smilePath = "http://i63.tinypic.com/ae4npd.jpg";
                    smileClass = '';
                    break;
                case percentage>75:
                    smilePath = "http://i67.tinypic.com/301hycg.jpg";
                    smileClass = '';
                    break;
            }
        })();
        return (
            <div className="result_view">
                <div className="header">
                    <p className="header_text">
                        <strong>Results</strong>
                    </p>
                </div>
                <div id="circle_board">
                    <p className="percentage_text">
                        <strong>Coverage: {percentage}%</strong>
                    </p>
                    <Circle
                        className="percent_circle"
                        percent={percentage}
                        strokeWidth="2"
                        trailWidth="2"
                        // trailColor="#1B06FF"
                        // strokeColor="#007DDC"
                    />
                </div>
                <div id="statistic_board">
                    <div className={smileClass} id="smile">
                        <img src={smilePath}/>
                    </div>
                    <table>
                        <tbody>
                        <tr>
                            <td className="description_td">
                                <b className="field_title">All:</b>
                            </td>
                            <td className="color_td">
                                <div id="all" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="field_title">{allTc}</b>
                            </td>
                        </tr>
                        <tr>
                            <td className="description_td">
                                <b className="field_title">Automation:</b>
                            </td>
                            <td className="color_td">
                                <div id="auto" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="field_title">{selectedTc}</b>
                            </td>
                        </tr>
                        <tr>
                            <td className="description_td">
                                <b className="field_title">Functional:</b>
                            </td>
                            <td className="color_td">
                                <div id="manual" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="field_title">{allTc-selectedTc}</b>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});
