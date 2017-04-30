import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const Posts = new Mongo.Collection('posts');

function Answer(text, name) {
    this.text = text;
    this.name = name;
    this.date = new Date();
}

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish posts that are public or belong to the current user
  Meteor.publish('posts', function postsPublication() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Posts.find({})
    } else {
      return Posts.find({
        $or: [
          { hidden: { $ne: true } },
          { owner: this.userId },
        ],
      });
    }
  });
}

Meteor.methods({
  'posts.insert'(question) {
    check(question, String);

    // Make sure the user is logged in before inserting a post
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Posts.insert({
      question,
      answer: [],
      createdAt: new Date(),
      tags:[],
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'posts.remove'(postId) {
    check(postId, String);

    const post = Posts.findOne(postId);
    /*
    if (post.public && post.owner !== Meteor.userId()) {
      // If the post is public, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }
    */

    Posts.remove(postId);
  },

  'posts.ansRemove'(postId, index) {
    const post = Posts.findOne(postId);
    var newArray = post.answer.slice();
    newArray.splice(index, 1);
    Posts.update({_id: postId}, {$set: {answer: newArray}});
  },

  'posts.tagRemove'(postId, index) {
    const post = Posts.findOne(postId);
    var newArray = post.tags.slice();
    newArray.splice(index, 1);
    Posts.update({_id: postId}, {$set: {tags: newArray}});
  },
  /*
  'posts.setChecked'(postId, setChecked) {
    check(postId, String);
    check(setChecked, Boolean);

    const post = Posts.findOne(postId);
    if (post.public && post.owner !== Meteor.userId()) {
      // If the post is hidden, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Posts.update(postId, { $set: { checked: setChecked } });
  },
  */

  'posts.setHidden'(postId, setToHidden) {
    check(postId, String);
    check(setToHidden, Boolean);

    const post = Posts.findOne(postId);

    /*
    // Make sure only the post owner can make a post hidden
    if (post.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    */

    Posts.update(postId, { $set: { hidden: setToHidden } });
  },
  
  'posts.answer'(postId, x) {
   // check(postId, String);
    const post = Posts.findOne(postId);

    // Make Answer Obj
    var newAnswer = new Answer(x, Meteor.user().username);
    
    // If user already posted, find index, else -1
    var index = -1;
    for (var i = 0; i < post.answer.length; i++) {
        if (post.answer[i].name === newAnswer.name) {
            index = i;
            break;
        }
    }
    
    // If user didn't post just add
    if (index == -1) {
        Posts.update({_id: postId}, {$push: {answer: newAnswer}});
    }
    // Else update answer array
    else {
        var newArray = post.answer.slice();
        newArray[parseInt(index)] = newAnswer;
        Posts.update({_id: postId}, {$set: {answer: newArray}});
    }

  },

  'posts.tag'(postId, x) {
    // check(postId, String);
    const post = Posts.findOne(postId);

    for (var i = 0; i < x.split(",").length; i++) {
      Posts.update({_id: postId}, {$push: {tags: x.split(",")[i]}});
    }
  },
});
