import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts'
import { Roles } from 'meteor/alanning:roles'
import Post from './Post.jsx';
import { Affix } from 'react-overlays'
import { StickyContainer, Sticky } from 'react-sticky';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

var pages = 1;
var perPage = 10;
var totalPosts;
var pagesLimit;
var max_chars = 500;

// App component - represents the whole app
class App extends Component {
  //const query;
  constructor(props) {
  super(props);
  this.handleScroll = this.handleScroll.bind(this);
  this.search = "";
  this.searchOn = 0;
  this.isAbout = 0;

  this.state = {
    hideCompleted: false,
    };
  }

  //from some random internet man
  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight) - 10;
    const windowBottom = windowHeight + window.pageYOffset;
    //console.log(pages);
    if (windowBottom >= docHeight && pages < pagesLimit && pages>-1) {
      pages++;
      this.update();
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  update() {
    console.log("force update");
    this.forceUpdate();
  }

  handleSubmit(event) {
    event.preventDefault();

    var snd = new Audio("audio.mp3");
    snd.play();
    snd.currentTime=0;

    // Find the text field via the React ref
    // console.log(ReactDOM.findDOMNode(this.refs.textInput).value.trim());
    const question = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.textInput2).value.trim();

    if (question.length > max_chars) {
      return;
    }
    else if (question != '' && email != '') {
      Meteor.call('posts.insert', question, email);

      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Thank you for your question! Ask another!';
      ReactDOM.findDOMNode(this.refs.textInput2).value = '';
    }
    else if (question != '') {
      Meteor.call('posts.insert', question, '');

      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Thank you for your question! Ask another!';
      ReactDOM.findDOMNode(this.refs.textInput2).value = '';

    }
    else {
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Enter some text here';
    }
  }

  searchAll(event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-all").style.fontWeight = "normal";

    this.tagQuery = "";
    this.query = "";
    this.tagSearch = 0;
    this.isSearch = 0;

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  searchAcademic(event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-academic").style.fontWeight = "normal";

    this.tagQuery = "academic";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  searchSocial(event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-social").style.fontWeight = "normal";

    this.tagQuery = "social life";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  searchExtra(event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-extracurricular").style.fontWeight = "normal";

    this.tagQuery = "extracurricular";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchOther(event) {
    event.preventDefault();

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-other").style.fontWeight = "normal";

    this.tagQuery = "other";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  searchUnanswered(event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();
    document.getElementById("current-unanswered").style.fontWeight = "normal";

    this.tagQuery = "unanswered";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchAdmin(admin, event) {
    event.preventDefault();
    pages = 1;

    if (location.pathname.split('/')[1] == "post") {
        Router.go('/');
    }

    this.toggleBold();

    this.tagQuery = "admin";
    this.query = admin
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  addBio(event) {
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
  }

  handleSearch(event) {
     event.preventDefault();
     pages = 1;

    // Find the text field via the React ref
    this.query = ReactDOM.findDOMNode(this.refs.searchString).value.trim();
    this.search = this.query;
    this.isSearch = 1;

    // Clear form
    ReactDOM.findDOMNode(this.refs.searchString).value = '';

    this.forceUpdate();
    window.scrollTo(0, 0);
  }

  handlePaginationUp(event) {
     event.preventDefault();

     pages++;
     this.forceUpdate();
  }

  handlePaginationDown(event) {
     event.preventDefault();

     pages--;

     this.forceUpdate();
  }

  toggleRender() {
    if (this.isAbout == 0) this.isAbout = 1;
    else this.isAbout = 0;
  }

  toggleBold() {
    document.getElementById("current-all").style.fontWeight = "100";
    document.getElementById("current-academic").style.fontWeight = "100";
    document.getElementById("current-social").style.fontWeight = "100";
    document.getElementById("current-extracurricular").style.fontWeight = "100";
    document.getElementById("current-other").style.fontWeight = "100";
    Roles.userIsInRole(Meteor.userId(), 'admin') ?
      document.getElementById("current-unanswered").style.fontWeight = "100" : '';
    document.getElementById("contributors").style.fontWeight = "100";
  }

  goContributors(event) {

    this.toggleBold();
    pages = -1;
    document.getElementById("contributors").style.fontWeight = "normal";

    event.preventDefault();
    this.toggleRender();
    this.forceUpdate();
    window.scrollTo(0, 0);
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

  // Contributor page
  renderContributors() {
    this.toggleRender();

    const admins = [];
    var bios = [];
    var placeholder;

    const adminList = Roles.getUsersInRole(['admin']).fetch();
    //var pageDescription = Roles.getUsersInRole(['superadmin']).fetch()[0].profile;

    for (var i=0;i<adminList.length;i++) {
      placeholder = (adminList[i].profile==undefined) ? '' : adminList[i].profile;
      admins[i] = adminList[i].username;
      bios[i] = placeholder;
    }

    return (
      <div className="col-md-10 col-sm-10 margin">
      {/*<br/>
      <p>{pageDescription}</p>*/}
        { Object.keys(admins).map((obj, i) =>
          <div className="black">
            <button className="highlight button inline response tiny" key = {300 - obj} onClick={this.searchAdmin.bind(this, admins[obj])}><b>{admins[obj]}</b></button>
            {bios[obj]}
          </div>
        )}

        { Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <form className="new-question" onSubmit={this.addBio.bind(this)}>
              <textarea className="outline" placeholder="Update your bio!" ref="contributorBio"></textarea>
              <input type="submit" value="Submit"/>
            </form>
        ) : ''}
    </div>
    );
  }

  matchAnswers(post, re) {
    for (i = 0; i < post.answer.length; i++) {
      if (post.answer[i].text.match(re))
      {
        return 1;
      }
      else if (post.answer[i].name.match(re))
      {
        return 1;
      }
    }

    return null
  }


  adminAnswered(admin, post) {
    for (i = 0; i < post.answer.length; i++) {
      if (post.answer[i].name == admin) {
        console.log('success');
        return true;
      }
    }
    return false;
  }

  // Shows posts that were searched for
  renderFound() {
    let filteredPosts = this.props.posts;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    totalPosts = 0;
    var rendered = 0;
    var lastPost = pages*perPage;

    return filteredPosts.map((post) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
      const answered = post.answer != "";

      var re = new RegExp(this.query, 'i');

      // Show a specific post if the url is for it
      if (location.pathname.split('/')[1] == "post") {
        if (post._id == location.pathname.split('/')[2]) {
          return (
            <Post
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              answered = {answered}
            />
            );
        }
      }
      else {
        totalPosts++;
        pagesLimit = Math.ceil(totalPosts/perPage);
        // Search through a specific tag
        if (this.tagSearch == 1) {
          if (this.tagQuery == "unanswered") {
            if (!answered) {
              return (
              <Post
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              answered = {answered}
              />
              );
            }
          }
          else if (answered && this.tagQuery == "admin") {
            if (this.adminAnswered(this.query, post)) {
              return (
              <Post
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              answered = {answered}
              />
              );
            }
          }
          if (post.tags.includes(this.tagQuery)) {
            if ((post.question.match(re) != null || this.query == undefined) && rendered<lastPost) {
              rendered++;
              return (
              <Post
                key={post._id}
                post={post}
                isAdmin={isAdmin}
                answered = {answered}
              />
              );
            }
          }
        }
        else {
          // Search through all
          if ((post.question.match(re) != null || this.matchAnswers(post, re) != null || this.query == undefined) && rendered<lastPost) {
            rendered++;
            return (
              <Post
                key={post._id}
                post={post}
                isAdmin={isAdmin}
                answered = {answered}
              />
            );
          }
        }
      }
    });
  }

  render() {

    return (
      <div className="container-fluid back-white stretch">
      <div>
        <div>
          </div>
        </div>
        <div className="row match-my-cols stretch">
          <div className="col-md-3 col-sm-3 back-light-orange">
            <div className="sidebar">
              <div className="row">
                <div className="col-md-12">
                <button className="white large title" onClick={this.searchAll.bind(this)}>Real Talk Princeton</button><br/><br/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6">
                  <p className="white">Now Viewing:</p>
                </div>
                <div className="col-md-6 col-xs-6">
                  <div><button className="button white pseudo-link" id="current-all" onClick={this.searchAll.bind(this)}>all</button> </div>
                  <div><button className="button white pseudo-link" id="current-academic" onClick={this.searchAcademic.bind(this)}>academic</button> </div>
                  <div><button className="button white pseudo-link" id="current-social" onClick={this.searchSocial.bind(this)}>social life</button> </div>
                  <div><button className="button white pseudo-link" id="current-extracurricular" onClick={this.searchExtra.bind(this)}>extracurricular</button> </div>
                  <div><button className="button white pseudo-link" id="current-other" onClick={this.searchOther.bind(this)}>other</button> </div>
                  { Roles.userIsInRole(Meteor.userId(), 'admin') ? ( <div><button className="button white pseudo-link" id="current-unanswered" onClick={this.searchUnanswered.bind(this)}>unanswered</button> </div> ) : ''}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                    <form className="tiny search" onSubmit={this.handleSearch.bind(this)}>
                      <p>
                        <input type = "text"
                          ref = "searchString"
                          placeholder="Search, e.g. eating clubs"/>
                          <input type="submit" value="Search"/>
                      </p>
                    </form>
                    { this.isSearch && this.search != '' ? (
                      <p className = "tiny center">
                        Current search: <input type="reset" value={this.search}/>
                      </p> ) : ''}
                      <form className="new-question search" onSubmit={this.handleSubmit.bind(this)}>
                        <textarea placeholder="Ask a question!" ref="textInput"></textarea>
                        <input type="text" placeholder="(Optional) Email for notification" ref="textInput2"/>
                        <input type="submit" value="Submit"/>
                      </form> <br/>
                    <button className="button white pseudo-link" id="contributors" onClick={this.goContributors.bind(this)}>About the Contributors</button>
                  <p> <br/></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-sm-9 white">
            <ul>
              { this.isAbout ? (this.renderFound()) : (this.renderContributors())}
            </ul>
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
  Meteor.subscribe('userList');
  Meteor.subscribe('posts');

  return {
    posts: Posts.find({}, {sort: { createdAt: -1 }}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
