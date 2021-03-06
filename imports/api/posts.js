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
  Meteor.publish('posts', function postsPublication(limit, tag, query, id, admin) {
    var dl = limit;
    var re = new RegExp(query, 'i');

    if (id != "") {
      console.log("ID: " + id)
      console.log(Posts.find("_id" : id).count());
      return Posts.find({"_id" : id});
    }
    if (admin != "") {
      return Posts.find({"answer.name" : {$in : [admin]}});
    }
    if (Roles.userIsInRole(this.userId, 'admin')) {
      if (tag == 'all') {
        return Posts.find(
          {$or:[
            {"question": {$regex: re}},
            {"date": {$regex: re}},
            {"answer.name": {$in : [re]}},
            {"answer.text" : {$in : [re]}},
            ]},
          { sort: { createdAt: -1 },
          "limit": dl });
      }
      else if (tag == 'unanswered') {
        return Posts.find(
          {$or:[
            {"question": {$regex: re}},
            {"date": {$regex: re}},
            {"answer.name": {$regex: re}},
            {"answer.text" : {$in : [re]}},
            ]},
            {"answer" : []},
          { sort: { createdAt: -1 },
          "limit": dl });
      } else {
        return Posts.find({
          "tags" : {$in : [tag]}},
          {$or:[
            {"question": {$regex: re}},
            {"date": {$regex: re}},
            {"answer.name": {$regex: re}},
            {"answer.text" : {$in : [re]}},
            ]},
          { sort: { createdAt: -1 },
          "limit": dl });
      }
    }
    else {
      if (tag == 'all') {
        return Posts.find(
        {$and : [
        {$or : [
            {"question": {$regex: re}},
            {"date": {$regex: re}},
            {"answer.name": {$regex: re}},
            {"answer.text" : {$in : [re]}},
            ]},
          {$or : [{$and : [{"hidden" : {$exists : true}}, {"hidden" : false}]}, {"hidden" : {$exists : false}} ]}
          ]},
          { sort: { createdAt: -1 },
          "limit": dl });
      }
      else {
        return Posts.find(
          {$and : [
            {"tags" : {$in : [tag]}},
            {$or : [
              {"question": {$regex: re}},
              {"date": {$regex: re}},
              {"answer.name": {$regex: re}},
              {"answer.text" : {$in : [re]}},
              ]},
              {$or : [{$and : [{"hidden" : {$exists : true}}, {"hidden" : false}]}, {"hidden" : {$exists : false}} ]},
          ]},
        { sort: { createdAt: -1 },
          "limit": dl });
      }
    }
  });
}

Meteor.methods({


  'posts.insert'(question, email) {
    check(question, String);
    check(email, String);
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
      email: email,
    });
  },
  'posts.remove'(postId) {
    check(postId, String);

    const post = Posts.findOne(postId);
    Posts.remove(postId);

  },

  'posts.ansRemove'(postId, index) {
    const post = Posts.findOne(postId);

    if (Meteor.user().username == post.answer[index].name) {
      var newArray = post.answer.slice();
      newArray.splice(index, 1);
      Posts.update({_id: postId}, {$set: {answer: newArray}});
    }
  },

  'posts.tagRemove'(postId, index) {
    const post = Posts.findOne(postId);
    var newArray = post.tags.slice();
    newArray.splice(index, 1);
    Posts.update({_id: postId}, {$set: {tags: newArray}});
  },

  'posts.setHidden'(postId, setToHidden) {
    check(postId, String);
    check(setToHidden, Boolean);

    const post = Posts.findOne(postId);
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

    var textEmail = "New Answer by " + Meteor.user().username + ":" + '\n \n' + x + '\n \n \n' + "See your post at: http://www.realtalkprinceton.com/post/" + String(postId);
    var address = Meteor.user().username + "@realtalkprinceton.com"
    // Email notification
    if (post.email != '') {
    	Email.send({
		  to: post.email,
		  from: address,
		  subject: "RealTalkPrinceton Alert",
		  text: textEmail,
		});
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
