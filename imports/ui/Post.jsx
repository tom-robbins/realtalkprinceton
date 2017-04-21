import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { Posts } from '../api/posts';
import Modal, {closeStyle} from 'simple-react-modal'
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

  deleteThisAnswer(t, o) {
    // o is the index of the answer to remove
    Meteor.call('posts.ansRemove', this.props.post._id, o);
  }

  show(){
      this.setState({show: true})
  }

  close(){
      this.setState({show: false})
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
          { this.props.isAdmin ? (
            <button className="delete" onClick={this.deleteThisPost.bind(this)}>
              &times;
            </button>
          ) : '' }

          { this.props.isAdmin ? (
            <button className="toggle-hidden" onClick={this.toggleHidden.bind(this)}>
              { this.props.post.hidden ? 'Hidden' : 'Public' }
            </button>
          ) : ''}

          <div className="row match-my-cols posts">
            <div className="col-md-6 col-sm-6">
              <p className="tiny no-margin"><b> {String(this.props.post.createdAt).split(" ")[1] +" " + String(this.props.post.createdAt).split(" ")[2] + ": "}</b></p>
              <p className="white no-margin">{this.props.post.question}</p>

              { this.props.isAdmin ? (

                  <div>
                    <a onClick={this.show.bind(this)}>Open Modal</a>
                    <Modal
                        className="test-class" //this will completely overwrite the default css completely
                        style={{background: 'red'}} //overwrites the default background
                        containerStyle={{background: 'blue'}} //changes styling on the inner content area
                        containerClassName="test"
                        closeOnOuterClick={true}
                        show={this.state.show}
                        onClose={this.close.bind(this)}>

                      <a style={closeStyle} onClick={this.close.bind(this)}>X</a>
                      <div>hey</div>

                    </Modal>
                  </div>

            ) : ''}
            </div>
          <br/>

          { 
            this.props.answered ? (
            <div className="col-md-6 col-sm-6">
              {Object.keys(this.props.post.answer).map((obj, i) =>
                <div>
                <p className="white no-margin" key = {obj}><b>{"Response from " + this.props.post.answer[obj].name}</b></p>
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
