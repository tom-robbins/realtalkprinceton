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
    addAdminInput: false, 
    removeAdminInput: false
    };
  }

  goHome(event) {
    event.preventDefault();
    Router.go('/');
  }

  addAdmin(event) {
    event.preventDefault();

    const admin = ReactDOM.findDOMNode(this.refs.addInput).value.trim();
    // Clear form
    ReactDOM.findDOMNode(this.refs.addInput).value = '';
    ReactDOM.findDOMNode(this.refs.addInput).placeholder = 'Admin has been added. Add another';

    this.forceUpdate();
    Meteor.call('posts.addAdmin', admin)
  }

  removeAdmin(event) {
    event.preventDefault();

    const admin = ReactDOM.findDOMNode(this.refs.removeInput).value.trim();
    // Clear form
    ReactDOM.findDOMNode(this.refs.removeInput).value = '';
    ReactDOM.findDOMNode(this.refs.removeInput).placeholder = 'Admin has been removed. Remove another';

    this.forceUpdate();
    Meteor.call('posts.removeAdmin', admin)
  }

  /*updatePageBio(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const newBio = ReactDOM.findDOMNode(this.refs.contributorBio).value.trim();

    Meteor.users.update(Meteor.userId(), {
      $set: {
        profile: newBio
      }
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.contributorBio).value = '';

    this.forceUpdate();
  }*/

  render() {
    if (Roles.userIsInRole( Meteor.userId(), 'superadmin' )) {
    return (
      <div className="container">
        <header>
          <h1 className="link" onClick={this.goHome.bind(this)}>Real Talk Princeton</h1>
        </header>
        <div className="row">
          <div className="col-md-6 col-sm-6">
            <form className="new-question admin_edit" onSubmit={this.addAdmin.bind(this)}>
              <input className="back-very-light-orange" type="text" placeholder="Add an Admin" ref="addInput"/>
              <input type="submit" value="Add this Admin"/>
            </form>
            <form className="new-question admin_edit" onSubmit={this.removeAdmin.bind(this)}>
              <input className="back-very-light-orange" type="text" placeholder="Remove an Admin" ref="removeInput"/>
              <input type="submit" value="Delete this Admin"/>
            </form>
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
    {/*<div className="center"><br/>
      <h3>Access Denied :(</h3>
    </div>*/}
    )
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
