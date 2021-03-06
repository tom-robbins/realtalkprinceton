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
import { ReactiveVar } from 'meteor/reactive-var';

var pages = 1;
var perPage = 10;
var totalPosts;
var pagesLimit;
var max_chars = 500;
var limit = new ReactiveVar(10);
var currentTag = new ReactiveVar('all');
var query = new ReactiveVar("");
var unique_id = new ReactiveVar("");
var this_admin = new ReactiveVar("");
var morePosts = true;

// App component - represents the whole app
class App extends Component {
  //const query;
  constructor(props) {
  super(props);
  this.handleScroll = this.handleScroll.bind(this);
  this.search = "";
  this.searchOn = 0;
  this.isAbout = 0;
  this.rendered = 0;

  this.state = {
    hideCompleted: false,
    chars_left: max_chars
    };
  }

  handleChange(event) {
    var input = event.target.value;
    console.log("handleChange");
    this.setState({
      chars_left: max_chars - input.length
    });
  }

  // from some random internet man
  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight) - 10;
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      if (Posts.find().count() < limit.get()) {
          morePosts = false;
      } else {
        morePosts = true;
      }

      if (morePosts) {
        limit.set(limit.get() + 10);
        console.log("Handle Scroll... limit=" + limit.get() +  " tag=" + currentTag.get());
      }
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
    this.forceUpdate();
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const question = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const email = ReactDOM.findDOMNode(this.refs.textInput2).value.trim();

    if (question.match(/oink/i)) {
      var snd = new Audio("audio.mp3");
      snd.volume = 0.05;
      snd.play();
      snd.currentTime=0;
    }

    if (question.match(/\S/)) {
      console.log('MATCH ' + question);
    } else {
      console.log('NOT ' + question);
    }

    if (question.length > max_chars) {
      return;
    }
    else if (question.match(/\S/) && email != '') {
      console.log('1 ' + question);
      Meteor.call('posts.insert', question, email);

      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Thank you for your question! Ask another!';
      ReactDOM.findDOMNode(this.refs.textInput2).value = '';
      this.setState({
        chars_left: max_chars
       });
    }
    else if (question.match(/\S/)) {
      Meteor.call('posts.insert', question, '');
      console.log('2 ' + question);
      // Clear form
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Thank you for your question! Ask another!';
      ReactDOM.findDOMNode(this.refs.textInput2).value = '';
      this.setState({
      chars_left: max_chars
    });

    }
    else {
      console.log('3 ' + question);
      ReactDOM.findDOMNode(this.refs.textInput).value = '';
      ReactDOM.findDOMNode(this.refs.textInput).placeholder = 'Enter some text here';
    }
  }

  searchAdmin(admin, event) {
    event.preventDefault();
    pages = 1;

    this.unbold();

    this_admin.set(admin)

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

    morePosts = true;
    pages = 1;
    limit.set(10);
    Router.go("/");
    unique_id.set("");


    pages = 1;

    this.limit += 75;
    Meteor.subscribe('posts', this.limit);

    // Find the text field via the React ref
    query.set(ReactDOM.findDOMNode(this.refs.searchString).value.trim());
    // this.search = this.query;
    this.search = query.get()
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

  unbold() {
    document.getElementById("all").style.fontWeight = "100";
    if (location.pathname.split('/')[1] != "post") {
      document.getElementById("academic").style.fontWeight = "100";
      document.getElementById("social life").style.fontWeight = "100";
      document.getElementById("extracurricular").style.fontWeight = "100";
      document.getElementById("other").style.fontWeight = "100";
    }
    Roles.userIsInRole(Meteor.userId(), 'admin') ?
      document.getElementById("unanswered").style.fontWeight = "100" : '';
    document.getElementById("contributors").style.fontWeight = "100";
  }

  goContributors(event) {

    this.unbold();
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
    var pageDescription = [];

    const adminList = Roles.getUsersInRole(['admin']).fetch();
    const superadmin = Roles.getUsersInRole(['superadmin']).fetch();

    for (var i=0;i<adminList.length;i++) {
      placeholder = (adminList[i].profile==undefined) ? '' : adminList[i].profile;
      admins[i] = adminList[i].username;
      bios[i] = placeholder;
    }

    for (var i=0;i<superadmin.length;i++) {
      pageDescription = (superadmin[i].profile==undefined) ? '' : superadmin[i].profile;
    }

    return (
      <div className="col-md-10 col-sm-10 margin">
      {<p>{pageDescription}</p>}

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

        { Roles.userIsInRole(Meteor.userId(), 'superadmin') ? (
            <form className="new-question" onSubmit={this.addBio.bind(this)}>
              <textarea className="outline" placeholder="Update the page description!" ref="contributorBio"></textarea>
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
        return true;
      }
    }
    return false;
  }

  // Shows posts that were searched for
  renderFound() {
    console.log("RENDERING NOW..." + Posts.find().count() + " POSTS");

    let filteredPosts = this.props.posts;
    if (this.state.hideCompleted) {
      filteredPosts = filteredPosts.filter(post => !post.checked);
    }
    totalPosts = 0;
    this.rendered = 0;

    const currentUserId = this.props.currentUser && this.props.currentUser._id;
    const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');

    return filteredPosts.map((post) => {
      const answered = post.answer != "";

      var re = new RegExp(this.query, 'i');
      // Show a specific post if the url is for it
      if (location.pathname.split('/')[1] == "post") {
        console.log("rendering single post!");
        unique_id.set(location.pathname.split('/')[2]);
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
        this.rendered++;
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

  setTag(string) {
    unique_id.set("");
    this_admin.set("");
    window.scrollTo(0, 0);
    morePosts = true;
    pages = 1;
    limit.set(10);
    currentTag.set(string);
    this.unbold();
    document.getElementById(string).style.fontWeight = "normal";

    if (location.pathname.split('/')[1] == "post") {
      var delayMillis = 300;
      setTimeout(location.reload.bind(location), delayMillis);
      Router.go("/");
    }

    this.update();
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
                <button className="white large title" onClick={()=>this.setTag('all')}>Real Talk Princeton</button><br/><br/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6">
                  <p className="white">Now Viewing:</p>
                </div>
                <div className="col-md-6 col-xs-6">
                  <div><button className="button white pseudo-link" id="all" onClick={()=>this.setTag('all')}>all</button> </div>
                  { location.pathname.split('/')[1] != "post" ? (
                    <div><button className="button white pseudo-link" id="academic" onClick={()=>this.setTag('academic')}>academic</button> </div>
                  ) : ''}
                  { location.pathname.split('/')[1] != "post" ? (
                  <div><button className="button white pseudo-link" id="social life" onClick={()=>this.setTag('social life')}>social life</button> </div>
                  ) : ''}
                  { location.pathname.split('/')[1] != "post" ? (
                    <div><button className="button white pseudo-link" id="extracurricular" onClick={()=>this.setTag('extracurricular')}>extracurricular</button> </div>
                  ) : ''}
                  { location.pathname.split('/')[1] != "post" ? (
                    <div><button className="button white pseudo-link" id="other" onClick={()=>this.setTag('other')}>other</button> </div>
                  ) : ''}
                  { Roles.userIsInRole(Meteor.userId(), 'admin') ? ( <div><button className="button white pseudo-link" id="unanswered" onClick={()=>this.setTag('unanswered')}>unanswered</button> </div> ) : ''}
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
                        <textarea onChange={this.handleChange.bind(this)} placeholder="Ask a question!" ref="textInput"></textarea>
                        <p className = "tiny white">Characters left: {this.state.chars_left}</p>
                        <input type="text" placeholder="(Optional) Email for notification" ref="textInput2"/>
                        <input type="submit" value="Submit"/>
                      </form> <br/>
                    <button className="button white pseudo-link" id="contributors" onClick={this.goContributors.bind(this)}>About the Contributors</button>
                  <p> <br/></p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-sm-9 white back-white">
            <ul>
              { this.isAbout ? (
                this.renderFound()
                ) : (this.renderContributors())}
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

export default createContainer(() => {

  console.log('container code');

  Meteor.subscribe('userList');
  console.log('LIMIT: ' + limit.get())
  postSub = Meteor.subscribe('posts', limit.get(), currentTag.get(), query.get(), unique_id.get(), this_admin.get());

  re = new RegExp(query.get(), 'i');
  dl = limit.get();
  tag = currentTag.get();


  if (currentTag.get() == "all") {
    return {
    posts: Posts.find(
      {
        $or:[
          {"question": {$regex: re}},
          {"date": {$regex: re}},
          {"answer.name": {$regex: re}},
          {"answer.text" : {$in : [re]}}
        ]
      },
      { limit : limit.get(), sort: { createdAt: -1 }}).fetch(),
    currentUser: Meteor.user(),
  };
  } else if (currentTag.get() == "unanswered") {
    return {
    posts: Posts.find(
      {
        "answer" : [],
        $or:[
          {"question": {$regex: re}},
          {"date": {$regex: re}},
          {"answer.name": {$regex: re}},
          {"answer.text" : {$in : [re]}}
        ]
      },
      { limit : limit.get(), sort: { createdAt: -1 }}).fetch(),
    currentUser: Meteor.user(),
  };
  } else {
    return {
      posts: Posts.find(
        {
          "tags" : {$in : [currentTag.get()]},
          $or:[
            {"question": {$regex: re}},
            {"date": {$regex: re}},
            {"answer.name": {$regex: re}},
            {"answer.text" : {$in : [re]}},
          ]
        },
        { limit : limit.get(), sort: { createdAt: -1 }}
      ).fetch(),
      currentUser: Meteor.user(),
    };
  }
}, App);
