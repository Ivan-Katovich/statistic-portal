import React from 'react';
import { Circle } from 'rc-progress'

export let PercentageView = React.createClass({
    render: function(){
        let percentage = this.props.data;
        return (
            <div className="result_view">
                <p className="percentage_text">
                    <strong>Coverage: {percentage}%</strong>
                </p>
                <Circle
                    className="percent_circle"
                    percent={percentage}
                    strokeWidth="4"
                    trailWidth="4"
                />
            </div>
        );
    }
});

// module.exports = PercentageView;