import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts'
import { Roles } from 'meteor/alanning:roles'
import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
class App extends Component {
  //const query;
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

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  handleSearch(event) {
     event.preventDefault();

     // Find the text field via the React ref
     this.query = ReactDOM.findDOMNode(this.refs.searchString).value.trim();

     // Clear form
     ReactDOM.findDOMNode(this.refs.searchString).value = '';

     this.forceUpdate();
  }

  goContributors(event) {
    event.preventDefault();
    Router.go('/contributors');
  }

  // Shows all posts
  renderPosts() {
    let filteredPosts = this.props.posts;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      const answered = post.question != "";

      return (
        <Post
          key={post._id}
          post={post}
          isAdmin={isAdmin}
          answered = {answered}
        />
      );
    });
  }

  // Shows posts that were searched for
  renderFound() {
    let filteredPosts = this.props.posts;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      const answered = post.answer != "";

      var re = new RegExp(this.query, 'i');

      if (post.question.match(re) != null || this.query == undefined) {
        return (
          <Post
            key={post._id}
            post={post}
            isAdmin={isAdmin}
            answered = {answered}
          />
        );
      }
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Real Talk Princeton</h1>

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
        <button className="contributorsButton" onClick={this.goContributors.bind(this)}>Contributor Bios</button>

        <form onSubmit={this.handleSearch.bind(this)}>
          <p>
            <input type = "text"
                 ref = "searchString" />
            <input type="submit" value="Search"/>
          </p>
        </form>

        <ul>
          {this.renderFound()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
