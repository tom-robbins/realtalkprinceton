import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts'
import { Roles } from 'meteor/alanning:roles'
import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class Accounts extends Component {
  //const query;
  constructor(props) {
  super(props);

  this.state = {
    hideCompleted: false,
    };
  }

  goHome(event) {
    event.preventDefault();
    Router.go('/');
  }

  addAdmin(event) {
    event.preventDefault();
    var val = prompt("Username to be admin", "");
    Meteor.call('posts.addAdmin', val)
  }

  removeAdmin(event) {
    event.preventDefault();
    var val = prompt("Username to be lose admin", "");
    Meteor.call('posts.removeAdmin', val)
  }

  render() {
    if (Roles.userIsInRole( Meteor.userId(), 'superadmin' )) {
      return (
        <div className="container">
          <header>
            <h1 className="link" onClick={this.goHome.bind(this)}>Real Talk Princeton</h1>
          </header>
          <div>
            <button className="addAdmin" onClick={this.addAdmin.bind(this)}>Add Admin</button>
            <button className="removeAdmin" onClick={this.removeAdmin.bind(this)}>Remove Admin</button>
          </div>
        </div>
      );
    }
  }
}

Accounts.propTypes = {
  posts: PropTypes.array.isRequired,
  /* incompleteCount: PropTypes.number.isRequired, */
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    /* incompleteCount: Posts.find({ checked: { $ne: true } }).count(), */
    currentUser: Meteor.user(),
  };
}, Accounts);
