import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts';
import classnames from 'classnames';

// Post component - represents a single todo item
export default class Post extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('posts.setChecked', this.props.post._id, !this.props.post.checked);
  }

  deleteThisPost() {
    Meteor.call('posts.remove', this.props.post._id);
  }

  toggleHidden() {
    Meteor.call('posts.setHidden', this.props.post._id, ! this.props.post.hidden);
  }

  answerPost() {
    var ans = prompt("Please enter your your answer", "Blank");
    Meteor.call('posts.answer', this.props.post._id, ans)
  }

  tagPost() {
    var tag = prompt("Please enter your your answer", "Blank");
    Meteor.call('posts.tag', this.props.post._id, tag)
  }

  deleteThisAnswer(t, o) {
    // o is the index of the answer to remove
    Meteor.call('posts.ansRemove', this.props.post._id, o);
  }

  deleteThisTag(t, o) {
    // o is the index of the answer to remove
    Meteor.call('posts.tagRemove', this.props.post._id, o);
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
                  <button className="admin-button back-light-orange float-left" onClick={this.toggleHidden.bind(this)}>
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

              <p className="tiny no-margin"><b> {String(this.props.post.createdAt).split(" ")[1] +" " + String(this.props.post.createdAt).split(" ")[2] + ": "}</b></p>
              <p className="white">{this.props.post.question}</p>
              
              <div className="row"> 
                <div className="col-md-6 col-sm-6 float-left">
                { this.props.isAdmin ? (
                <button className="admin-button back-light-orange float-left" onClick={this.tagPost.bind(this)}>Tag</button>
                ) : ''}
                </div>

                <div className="col-md-6 col-sm-6">
                { this.props.isAdmin ? (
                <button className="admin-button back-light-orange" onClick={this.answerPost.bind(this)}>Answer</button>
                ) : ''}
                </div>
              </div>

            </div>

          <br/>

          { 
            this.props.answered ? (
            <div className="col-md-6 col-sm-6">
              {Object.keys(this.props.post.answer).map((obj, i) =>
                <div>
                <p className="white no-margin" key = {obj}><b>{"Response from " + this.props.post.answer[obj].name}</b></p>
                { this.props.isAdmin ? (
                 <button className="delete" onClick={()=>this.deleteThisAnswer(this, parseInt(obj))}>
                   &times;
                 </button>
                 ) : '' }
                <p className="white no-margin" key = {300 - obj}>{this.props.post.answer[obj].text}</p>

                </div>
              )}
            </div>
          ) : ''
        }
        </div>
        </li>
      );

    }
    else {
      return (null);
    }
  }
}

Post.propTypes = {
  // This component gets the post to display through a React prop.
  // We can use propTypes to indicate it is required
  post: PropTypes.object.isRequired,
  isAdmin: React.PropTypes.bool.isRequired,
  answered: React.PropTypes.bool.isRequired,
};
