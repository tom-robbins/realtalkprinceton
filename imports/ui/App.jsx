import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts'
import { Roles } from 'meteor/alanning:roles'
import Post from './Post.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';


var offset = 0; 
var perPage = 3; 
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

  handlePagination(event) {
     event.preventDefault();

     offset = 0;

     this.forceUpdate();
  }

  handlePaginationDown(event) {
     event.preventDefault();

     offset = 0;

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
    var count = 0; 
    var firstPost = offset*perPage; 
    var lastPost = firstPost+perPage; 
    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      const answered = post.answer != "";

      var re = new RegExp(this.query, 'i');

      if ((post.question.match(re) != null || this.query == undefined)) {
        count++; 
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
      <div className="container-fluid back-white stretch">
          <header>
            <h1 className="orange">Real Talk Princeton</h1> 
            <p className="orange">Real Talk Princeton is an established group 
            committed to answering questions about Princeton academics, student 
            life, and beyond.</p>
          </header>
        <div className="row match-my-cols stretch">
          <div className="col-md-4 col-sm-4 back-light-orange">
            <div className="sidebar">
              <div className="row">
                <div className="col-md-6 col-xs-6">
                  <p className="white">Now Viewing: </p>
                </div>
                <div className="col-md-6 col-xs-6">
                  <p className="white">all<br/>academic<br/>social life<br/>extracurricular</p>
                </div>
              </div>
              <div className="row"> 
                <div className="col-md-12">
                  <li>
                    <form className="search" onSubmit={this.handleSearch.bind(this)}>
                    <p>
                      <input type = "text"
                        ref = "searchString"
                        placeholder="search" />
                      <input type="submit" value="Search"/>
                    </p>
                  </form>
                  </li>
                  <li>
                    <p className="white link">Ask a Question</p>
                    { this.props.currentUser ?
                      <form className="new-question" onSubmit={this.handleSubmit.bind(this)} >
                      <textarea ref="textInput"></textarea>
                      <input type="submit"/>
                      </form> : ''
                    }
                  </li>
                  <li>
                    <button className="button white pseudo-link" onClick={this.goContributors.bind(this)}>About the admins</button>
                  </li>
                  <li>
                    <AccountsUIWrapper />
                  </li>
                  <p> <br/></p>
                </div>
              </div> 
            </div>
          </div>
          <div className="col-md-8 col-sm-8 back-orange">
            <ul>
              {this.renderFound()}
            </ul>
            <button className="button white pseudo-link fivemargin" onClick={this.handlePagination.bind(this)}>Prev</button>
            <button className="button white pseudo-link fivemargin" onClick={this.handlePagination.bind(this)}>Next</button>
          </div>
        </div>
      </div>
      ); 
  }
}

App.propTypes = {
  posts: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};


//CHANGE THIS FOR PAGINATION 
export default createContainer(() => {
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, { sort: { createdAt: -1 }}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
