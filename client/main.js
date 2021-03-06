import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';
import Accounts from '../imports/ui/Accounts.jsx';
import Login from '../imports/ui/Login.jsx';

if (Meteor.isClient) {
    Router.plugin('reywood:iron-router-ga');
}

Meteor.startup(() => {
	Router.configure({		
     	trackPageView: true		
 	});

	Router.route('/', function () {
  		render(<App />, document.getElementById('render-target'));
  		//this.next();
	});

	Router.route('/accounts', function () {
  		render(<Accounts />, document.getElementById('render-target'));
	});

	Router.route('/post/:_id', function() {
		render(<App />, document.getElementById('render-target'));
		//this.next();
	});

	Router.route('/login', function() {
		render(<Login />, document.getElementById('render-target'));
	});

});
