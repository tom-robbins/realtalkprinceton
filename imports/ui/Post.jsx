import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts';
import ReactDOM from 'react-dom';

import { render } from 'react-dom';

import App from './App.jsx';
import classnames from 'classnames';

// Post component - represents a single todo item
export default class Post extends Component {

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('posts.setChecked', this.props.post._id, !this.props.post.checked);
  }

  deleteThisPost() {
    this.props.post.delete = true;
    this.forceUpdate();
  }

  cancelDeleteThisPost() {
    this.props.post.delete = false;
    this.forceUpdate();
  }

  permDeleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }

  toggleHidden() {
    Meteor.call('posts.setHidden', this.props.post._id, ! this.props.post.hidden);
  }

  answerPost(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const ans = ReactDOM.findDOMNode(this.refs.ansInput).value.trim();

    if (ans != '') {
      Meteor.call('posts.answer', this.props.post._id, ans);

    }
  }

  youAnswered(){
    let posts = this.props.post.answer;
    for (obj in Object.keys(posts)) {
      if (Meteor.user().username == posts[obj].name) {
        return true;
      }
    }
    return false;
  }

  yourObj(){
    let posts = this.props.post.answer;
    for (obj in Object.keys(posts)) {
      if (Meteor.user().username == posts[obj].name) {
        return obj;
      }
    }
    return false;
  }

  displayForm(event) {
    event.preventDefault();
    ReactDOM.findDOMNode(this.refs.answerForm).style.display = 'block';
  }

  tagPost() {
    var tag = prompt("Please enter your tag", "Blank");
    Meteor.call('posts.tag', this.props.post._id, tag);
  }

  deleteThisAnswer(t, o) {
    // o is the index of the answer to remove
    Meteor.call('posts.ansRemove', this.props.post._id, o);
  }

  deleteThisTag(t, o) {
    // o is the index of the answer to remove
    Meteor.call('posts.tagRemove', this.props.post._id, o);
  }


  searchAdmin(admin, event) {
    Meteor.call('searchAdmin', admin, event);
  }

  update() {
    var delayMillis = 300;
    setTimeout(location.reload.bind(location), delayMillis);
    Router.go("http://www.realtalkprinceton.com/post/" + this.props.post._id);
  }

  render() {

    // Give posts a different className when they are checked off,
    // so that we can style them nicely in CSS
    const postClassName = classnames({
      hidden: this.props.post.hidden,
    });


    if (this.props.isAdmin || this.props.answered) {
      return (
        <li className={postClassName}>

          <div className="row match-my-cols posts">
            <div className="col-md-6 col-sm-6">
            { this.props.isAdmin ? (
              <div className="row">
                <div className="col-md-6 col-sm-6">
                  {this.props.post.hidden ? (
                    <button className="admin-button response float-left white back-light-orange" onClick={this.toggleHidden.bind(this)}>
                    Now Hidden</button>) : (
                    <button className="admin-button response float-left white back-orange" onClick={this.toggleHidden.bind(this)}>
                    Now Public</button>
                    ) }
                </div>
                <div className="col-md-6 col-sm-6 float-right">
                  {this.props.post.delete ? (
                      <div>
                      <p className = "tiny red justify-right">Are you sure you want to permanently delete this question?</p>
                        <div className="col-md-6 col-sm-6 float-right">
                           <button className="admin-button response float-right white back-red" onClick={()=>this.permDeleteThisPost()}>
                          Delete</button>
                        </div>
                        <div className="col-md-6 col-sm-6 float-right">
                          <button className="admin-button response float-right white back-light-orange" onClick={()=>this.cancelDeleteThisPost()}>
                          Cancel</button>
                        </div>
                      </div>
                    ) : (
                  <button className="delete" onClick={()=>this.deleteThisPost()}>
                       &times;
                  </button>
                )}
                </div>

              </div>
              ) : ''}

              <br/>

              <p className="orange tiny no-margin"><b> {String(this.props.post.createdAt).split(" ")[1] +" " + String(this.props.post.createdAt).split(" ")[2] + ": "}</b></p>
              <button className = "button questionButton black" onClick={()=>this.update()}> {this.props.post.question} </button>

              { this.props.post.tags.length > 0 && this.props.isAdmin ? (
                  Object.keys(this.props.post.tags).map((obj, i) =>
                   <div>
                     <button className="delete" onClick={()=>this.deleteThisTag(this, parseInt(obj))}> &times; </button>
                     <p className="tag tiny no-margin orange" key = {300 - obj}>{this.props.post.tags[obj]}</p>
                   </div>
                 )
               ) : ''}

              { this.props.post.tags.length > 0 && !this.props.isAdmin ? (
                  Object.keys(this.props.post.tags).map((obj, i) =>
                   <div>
                     <p className="tag tiny no-margin orange" key = {300 - obj}>{this.props.post.tags[obj]}</p>
                   </div>
                 )
               ) : ''}

              <br/>

              <div className="row">
                <div className="col-md-6 col-sm-6 float-left">
                { this.props.isAdmin ? (
                <button className="admin-button response back-light-orange float-left" onClick={this.tagPost.bind(this)}>Tag</button>
                ) : ''}
                </div>

                <div className="col-md-6 col-sm-6">

                { this.props.isAdmin && !this.youAnswered() ? (
                  <button className="admin-button response back-light-orange" onClick={this.displayForm.bind(this)}>Answer</button>
                ) : ''}
                </div>
              </div>

            </div>

          <br/>


          <div className="col-md-6 col-sm-6">
          {this.props.isAdmin ? (
            this.youAnswered() ? (
              <form className="new-question search" ref="answerForm" onSubmit={this.answerPost.bind(this)}>
                  <textarea className="outline" placeholder="Answer the question!" ref="ansInput">{this.props.post.answer[this.yourObj()].text}</textarea>
                    <input type="submit" ref="saveButton" value="Save"/>
              </form>
              )

            : (
              <form className="new-question search hide" ref="answerForm" onSubmit={this.answerPost.bind(this)}>
                  <textarea className="outline" placeholder="Answer the question!" ref="ansInput"></textarea>
                    <input type="submit" ref="saveButton" value="Save"/>
              </form>
              ))
            : '' }
          {
            this.props.answered ? (
            <div>
              {Object.keys(this.props.post.answer).map((obj, i) =>
                <div>
                <br/>


                <p className="response tiny black no-margin inline">Response from </p>

                <button className="response tiny no-margin highlight button black_link" key={obj} onClick={this.searchAdmin.bind(this.props.post, this.props.post.answer[obj].name)}>{this.props.post.answer[obj].name}</button>



                { Meteor.user().username == this.props.post.answer[obj].name ? (
                 <button className="delete" onClick={()=>this.deleteThisAnswer(this, parseInt(obj))}>
                   &times;
                 </button>
                 ) : '' }
                <p className="black qa no-margin answertext" key = {300 - obj}>{this.props.post.answer[obj].text}<br/></p>

                </div>
              )}
            </div>
          ) : ''
        }
        </div>
        </div>
        </li>
      );

    }
    else {
      return (null);
    }
  }
}
                // <p className="response tiny black no-margin" key = {obj}>Response from <b>{this.props.post.answer[obj].name}</b></p>

Post.propTypes = {
  // This component gets the post to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,
  answered: React.PropTypes.bool.isRequired,
};
