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
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
