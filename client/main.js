import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import '../imports/startup/accounts-config.js';
import App from '../imports/ui/App.jsx';
import Accounts from '../imports/ui/Accounts.jsx';

Meteor.startup(() => {
	Router.route('/', function () {
  		render(<App />, document.getElementById('render-target'));
	});

	Router.route('/accounts', function () {
  		render(<Accounts />, document.getElementById('render-target'));
	});

	Router.route('/post/:_id', function() {
		render(<App />, document.getElementById('render-target'));
        //this.next();
	});
});
