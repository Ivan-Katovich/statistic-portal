const React = require('react');
const Circle = require('rc-progress').Circle;
// const PercentageCircle = require('reactjs-percentage-circle');
// import PercentageCircleConstr from 'reactjs-percentage-circle';
// let PercentageCircle = new PercentageCircleConstr();

let PercentageView = React.createClass({
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
                {/*<PercentageCircle percent={percentage} color={"#3498db"} />*/}
            </div>
        );
    }
});

module.exports = PercentageView;