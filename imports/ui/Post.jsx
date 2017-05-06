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
    if (confirm("Are you sure you want to delete this question?")) {
      Meteor.call('posts.remove', this.props.post._id);
    }
  }

  toggleHidden() {
    Meteor.call('posts.setHidden', this.props.post._id, ! this.props.post.hidden);
  }

  answerPost(event) {
    event.preventDefault();
    console.log("answerPost"); 
    // Find the text field via the React ref
    const ans = ReactDOM.findDOMNode(this.refs.ansInput).value.trim();

    if (ans != '') {
      Meteor.call('posts.answer', this.props.post._id, ans);

    }
  }

  youAnswered(){ 
    let posts = this.props.post.answer; 
    console.log(Object.keys(posts)); 
    console.log("youAnswered"); 
    for (obj in Object.keys(posts)) {
      console.log(posts[obj]);
      if (Meteor.user().username == posts[obj].name) {
        return true; 
      }
    }
    return false;  
  }

  yourObj(){ 
    let posts = this.props.post.answer; 
    console.log(Object.keys(posts)); 
    console.log("youAnswered"); 
    for (obj in Object.keys(posts)) {
      console.log(posts[obj]);
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

  searchAdmin(admin) {
    // Meteor.call
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
                  <button className="admin-button response back-light-orange float-left" onClick={this.toggleHidden.bind(this)}>
                    { this.props.post.hidden ? 'Hidden' : 'Public' }
                  </button>
                </div>
                <div className="col-md-6 col-sm-6 float-right">
                  <button className="delete" onClick={()=>this.deleteThisPost()}>
                       &times;
                  </button>
                </div>

              </div>
              ) : ''}

              <br/>

              <p className="orange tiny no-margin"><b> {String(this.props.post.createdAt).split(" ")[1] +" " + String(this.props.post.createdAt).split(" ")[2] + ": "}</b></p>
              <p className="black qa no-margin">{this.props.post.question}</p>

              { this.props.post.tags.length > 0 && this.props.isAdmin ? (
                  Object.keys(this.props.post.tags).map((obj, i) => 
                   <div>
                     <button className="delete" onClick={()=>this.deleteThisTag(this, parseInt(obj))}> &times; </button>
                     <p className="tag tiny no-margin" key = {300 - obj}>{this.props.post.tags[obj]}</p>
                   </div>
                 )
               ) : ''}

              { this.props.post.tags.length > 0 && !this.props.isAdmin ? (
                  Object.keys(this.props.post.tags).map((obj, i) => 
                   <div>
                     <p className="tag tiny no-margin" key = {300 - obj}>{this.props.post.tags[obj]}</p>
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
                  <textarea placeholder="Answer the question!" ref="ansInput">{this.props.post.answer[this.yourObj()].text}</textarea>
                    <input type="submit" ref="saveButton" value="Save"/>
              </form> 
              )

            : (
              <form className="new-question search hide" ref="answerForm" onSubmit={this.answerPost.bind(this)}>
                  <textarea placeholder="Answer the question!" ref="ansInput"></textarea>
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
                <button className="response tiny no-margin highlight button" key={obj} onClick={this.searchAdmin(this.props.post.answer[obj].name)}>{this.props.post.answer[obj].name}</button>



                { this.props.isAdmin ? (
                 <button className="delete" onClick={()=>this.deleteThisAnswer(this, parseInt(obj))}>
                   &times;
                 </button>
                 ) : '' }
                <p className="black qa no-margin" key = {300 - obj}>{this.props.post.answer[obj].text}<br/></p>

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
