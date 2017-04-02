import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

export const Posts = new Mongo.Collection('posts');
export const Found = new Mongo.Collection('found');

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

  Meteor.publish('found', function foundPublication() {
    return Found.find({})
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
      answer: '',
      createdAt: new Date(),
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

  'posts.search'(query) {
    check(query, String);

    // Make sure the user is logged in before inserting a post
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Found.remove({});

    console.log(query);

    const found = Posts.find({}).fetch();

    if (found != undefined) {
      for (i = 0; i < found.length; i++) {
        if (found[i].question.includes(query)) {
          question = found[i].question;
          Found.insert({
            question,
            answer: '',
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
          });
        }
      }
    } 
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
});
