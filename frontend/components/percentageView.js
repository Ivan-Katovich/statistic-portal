import React from 'react';
import { Circle } from 'rc-progress';

export let PercentageView = React.createClass({
    render: function(){
        let percentage = this.props.data.coveragePercentage;
        let allTc = this.props.data.allTc;
        let selectedTc = this.props.data.selectedTc;
        let parameter = this.props.data.parameter;
        let smilePath;
        let smileClass;
        (function(){
            switch(true){
                case selectedTc === 0 || percentage === 0:
                    smilePath = "//c1.staticflickr.com/5/4361/36648396245_9460de2c9c.jpg";
                    if(allTc === 0){
                        smileClass = 'none';
                    }else{
                        smileClass = '';
                    }
                    break;
                case percentage<=25:
                    smilePath = "//c1.staticflickr.com/5/4361/36648396245_9460de2c9c.jpg";
                    smileClass = '';
                    break;
                case percentage>25 && percentage<=40:
                    smilePath = "//c1.staticflickr.com/5/4438/36648396375_36de6ded14.jpg";
                    smileClass = '';
                    break;
                case percentage>40 && percentage<=55:
                    smilePath = "//c1.staticflickr.com/5/4352/36648396695_38608f140d.jpg";
                    smileClass = '';
                    break;
                case percentage>55 && percentage<=75:
                    smilePath = "//c1.staticflickr.com/5/4373/36648396985_7b66d463b4.jpg";
                    smileClass = '';
                    break;
                case percentage>75:
                    smilePath = "//c1.staticflickr.com/5/4404/35839242773_2f1044f97e.jpg";
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
                        <strong>Result: {percentage}%</strong>
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
                                <b className="statistic_data">All:</b>
                            </td>
                            <td className="color_td">
                                <div id="all" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="statistic_data">{allTc}</b>
                            </td>
                        </tr>
                        <tr>
                            <td className="description_td">
                                <b className="statistic_data">{parameter}:</b>
                            </td>
                            <td className="color_td">
                                <div id="auto" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="statistic_data">{selectedTc}</b>
                            </td>
                        </tr>
                        <tr>
                            <td className="description_td">
                                <b className="statistic_data">Other:</b>
                            </td>
                            <td className="color_td">
                                <div id="manual" className="shape" />
                            </td>
                            <td className="amount_td">
                                <b className="statistic_data">{allTc-selectedTc}</b>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});
