/* -*- Mode: rjsx -*- */

/*******************************************
 * Copyright (2017)
 *  Marcus Dillavou <line72@line72.net>
 *  http://line72.net
 *
 * Sardines:
 *  https://github.com/line72/sardines
 *  https://sardines.line72.net
 *
 * Licensed Under the GPLv3
 *******************************************/

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
