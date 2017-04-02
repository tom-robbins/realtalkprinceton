import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts'
import { Found } from '../api/posts'
import { Roles } from 'meteor/alanning:roles'
import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class App extends Component {
  constructor(props) {
  super(props);

  this.state = {
    hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call('posts.insert', question);
    /*
    Posts.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
    */
    console.log(Meteor.user().roles)
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  handleSearch(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const query = ReactDOM.findDOMNode(this.refs.searchString).value.trim();

    Meteor.call('posts.search', query);
    /*
    Posts.insert({
      text,
      createdAt: new Date(), // current time
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
    */
    console.log(Meteor.user().roles)
    // Clear form
    ReactDOM.findDOMNode(this.refs.searchString).value = '';
  }

  /*
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  */

  renderPosts() {
    let filteredPosts = this.props.posts;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showHiddenButton = Roles.userIsInRole(Meteor.userId(), 'admin');

      return (
        <Post
          key={post._id}
          post={post}
          showHiddenButton={showHiddenButton}
        />
      );
    });
  }

  foundPosts() {
    let filteredPosts = this.props.found;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showHiddenButton = Roles.userIsInRole(Meteor.userId(), 'admin');

      return (
        <Post
          key={post._id}
          post={post}
          showHiddenButton={showHiddenButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Real Talk Princeton{/*({this.props.incompleteCount}) */}</h1>

          {/*
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Posts
          </label>
          */}

          <AccountsUIWrapper />
          { this.props.currentUser ?
            <form className="new-question" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Ask us anything!"
              />
            </form> : ''
          }
        </header>

        <form onSubmit={this.handleSearch.bind(this)}>
          <p>
            <input type = "text"
                 ref = "searchString" />
            <input type="submit" value="Search"/>
          </p>
        </form>
        <p>
          Searched for:
         </p>
        <ul>
          {this.foundPosts()}
        </ul>

        <p>
          Archives:
         </p>
        <ul>
          {this.renderPosts()}
        </ul>

      </div>
    );
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  found: PropTypes.array.isRequired,
  /* incompleteCount: PropTypes.number.isRequired, */
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');
  Meteor.subscribe('found');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    found: Found.find({}, { sort: { createdAt: -1 } }).fetch(),
    /* incompleteCount: Posts.find({ checked: { $ne: true } }).count(), */
    currentUser: Meteor.user(),
  };
}, App);
