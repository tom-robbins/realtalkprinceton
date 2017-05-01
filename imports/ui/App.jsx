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
var perPage = 3; 
var totalPosts; 
var pagesLimit; 

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
    if (windowBottom >= docHeight && pages < pagesLimit) {
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

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    if (question != '') {
      Meteor.call('posts.insert', question);

      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }
  }

  searchAll(event) {
    event.preventDefault();

    this.toggleBold();
    document.getElementById("current-all").style.fontWeight = "normal";

    this.tagQuery = "";
    this.query = "";
    this.tagSearch = 0;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchAcademic(event) {
    event.preventDefault();

    this.toggleBold();
    document.getElementById("current-academic").style.fontWeight = "normal";

    this.tagQuery = "academic";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchSocial(event) {
    event.preventDefault();

    this.toggleBold();
    document.getElementById("current-social").style.fontWeight = "normal";

    this.tagQuery = "social life";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchExtra(event) {
    event.preventDefault();

    this.toggleBold();
    document.getElementById("current-extracurricular").style.fontWeight = "normal";

    this.tagQuery = "extracurricular";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
  }

  searchUnanswered(event) {
    event.preventDefault();

    this.toggleBold();
    document.getElementById("current-unanswered").style.fontWeight = "normal";

    this.tagQuery = "unanswered";
    this.query = "";
    this.tagSearch = 1;
    this.isSearch = 0;

    this.forceUpdate();
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
    Roles.userIsInRole(Meteor.userId(), 'admin') ? 
      document.getElementById("current-unanswered").style.fontWeight = "100" : '';
    document.getElementById("contributors").style.fontWeight = "100";
  }

  goContributors(event) {

    this.toggleBold();
    document.getElementById("contributors").style.fontWeight = "normal";

    event.preventDefault();
    this.toggleRender();
    this.forceUpdate();
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

    // const Admins = [];
    const admins = [];
    // var bios = [];
    var placeholder;

    const adminList = Roles.getUsersInRole(['admin', 'superadmin']).fetch();

    for (var i=0;i<adminList.length;i++) {

      // Admins.push(<span key={adminList[i].username}></span>);
      // console.log(Admins);

      placeholder = (adminList[i].profile==undefined) ? 'bio' : adminList[i].profile;

      admins[i] = adminList[i].username + ': ' + placeholder;
      // bios[i] = adminList[i].profile;
    }
    
    return (
      <div className="col-md-8 col-sm-8 back-orange">

        { Object.keys(admins).map((obj, i) => 
          <div>
            <p className="bio white" key = {300 - obj}>{admins[obj]}</p>
          </div>
        )}

        {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
            <form className="new-question" onSubmit={this.addBio.bind(this)}>
              <textarea placeholder="Submit a bio" ref="contributorBio"></textarea>
              <input type="submit" value="Submit"/>
            </form>
        ) : ''}

        <li>
          <AccountsUIWrapper />
        </li>
    </div>
    );
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

      totalPosts++; 
      pagesLimit = Math.floor(totalPosts/perPage); 
      if (this.tagSearch == 1) {
        if (this.tagQuery == "unanswered") {
          if (!answered) {
            console.log(answered);
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
    });
  }

  render() {

    return (
      <div className="container-fluid back-white stretch">
      <StickyContainer>
      <div>
        <div>
          <header>
            <h1 className="orange">Real Talk Princeton</h1> 
            <p className="orange">Real Talk Princeton is an established group 
            committed to answering questions about Princeton academics, student 
            life, and beyond.</p>
          </header>
          </div>
        </div>
        <div className="row match-my-cols stretch">
          <div className="col-md-4 col-sm-4 back-light-orange">
            <Sticky>
            <div className="sidebar">
              <div className="row">
                <div className="col-md-6 col-xs-6">
                  <p className="white">Now Viewing: </p>
                </div>
                <div className="col-md-6 col-xs-6">
                  <div><button className="button white pseudo-link" id="current-all" onClick={this.searchAll.bind(this)}>all</button> </div>
                  <div><button className="button white pseudo-link" id="current-academic" onClick={this.searchAcademic.bind(this)}>academic</button> </div>
                  <div><button className="button white pseudo-link" id="current-social" onClick={this.searchSocial.bind(this)}>social life</button> </div>
                  <div><button className="button white pseudo-link" id="current-extracurricular" onClick={this.searchExtra.bind(this)}>extracurricular</button> </div>
                  { Roles.userIsInRole(Meteor.userId(), 'admin') ? ( <div><button className="button white pseudo-link" id="current-unanswered" onClick={this.searchUnanswered.bind(this)}>unanswered</button> </div> ) : ''}
                </div>
              </div>
              <div className="row"> 
                <div className="col-md-12">
                  <li>
                    <form className="search" onSubmit={this.handleSearch.bind(this)}>
                      <p>
                        <input type = "text"
                          ref = "searchString"
                          placeholder="search"/>
                      </p>
                    </form>
                    { this.isSearch && this.search != '' ? (
                      <p className = "tiny"> 
                        Current search: <input type="reset" value={this.search}/>
                      </p> ) : ''}
                  </li>
                  <li>
                    { this.props.currentUser ?
                      <form className="new-question" onSubmit={this.handleSubmit.bind(this)}>
                        <textarea placeholder="Ask a question!" ref="textInput"></textarea>
                        <input type="submit" value="Submit"/>
                      </form> : ''
                    }
                  </li>
                  <li>
                    <button className="button white pseudo-link" id="contributors" onClick={this.goContributors.bind(this)}>About the Contributors</button>
                  </li>
                  <p> <br/></p>
                </div>
              </div> 
            </div>
            </Sticky>
          </div>
          <div className="col-md-8 col-sm-8 back-orange">
            <ul>
              { this.isAbout ? (this.renderFound()) : (this.renderContributors())}
            </ul>
            {pages > 1 ? (
              <button className="button white pseudo-link fivemargin" onClick={this.handlePaginationDown.bind(this)}>Prev</button>
            ) : ''}
            {pages < pagesLimit ? (
              <button className="button white pseudo-link fivemargin" onClick={this.handlePaginationUp.bind(this)}>Next</button>
            ) : ''}
          </div>
        </div>
        </StickyContainer>
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
    posts: Posts.find({}, { sort: { createdAt: -1 }}).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
