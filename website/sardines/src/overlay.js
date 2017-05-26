import React from 'react';

class Overlay extends React.Component {
    render() {
        const d = <div className="loading"><img src="loading.gif" alt="Loading ..." className="loadingGif" /></div>;
        
        return (
            <div className="loadingScreen">{this.props.visible && d}</div>
        );
    }
}

export default Overlay;
