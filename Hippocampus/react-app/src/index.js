import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
//
// sessionStorage.setItem('isLoggedIn',"false");
// sessionStorage.setItem('userNameLoggedIn',"");
// sessionStorage.setItem('userIDLoggedIn',"");
// sessionStorage.setItem('userIsAdmin',"false");
//

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
