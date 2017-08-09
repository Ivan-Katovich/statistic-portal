import React from 'react';
import Loading from 'react-loading-spinner';

let Spinner = function(){
    return (<div className="defaultSpinner" />);
};

export let LoadingSpinner = React.createClass({
    render: function(){
        let customLoading = this.props.data;
        let loadingClass = customLoading ? 'loading_field' : 'loading_field none';
        return (
            <div className={loadingClass}>
                <div className="loading_spinner">
                    <Loading isLoading={true}
                        loadingClassName="loading"
                        spinner={Spinner}
                    />
                </div>
                <div className="loading_text">
                    <span>
                        Loading...
                    </span>
                </div>
            </div>
        );
    }
});
