Meteor.startup(function () {
  process.env.MAIL_URL = "smtp://jamilm9:realtalkprinceton123@smtp.sendgrid.net:587";
  console.log('this is the mail_url: ', process.env.MAIL_URL);
  // user roles
  var roles = ['superadmin', 'admin', 'pleb']

  // this will fail if the roles package isn't installed
  if(Meteor.roles.find().count() === 0) {
    roles.map(function(role) {
      Roles.createRole(role)
    })
  }

  console.log('Running server startup code...');
  
  var id = Meteor.users.findOne({username: "admin"});
  Roles.addUsersToRoles(id._id, ['superadmin']);

});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
})

Meteor.methods({
  'posts.addAdmin'(user) {
   var id = Meteor.users.findOne({username: user})
   Roles.addUsersToRoles(id._id, ['admin']);
  },
  'posts.removeAdmin'(user) {
   var id = Meteor.users.findOne({username: user})
   Roles.removeUsersFromRoles(id._id, ['admin']);
  }
});

Meteor.publish('userList', function (){
  return Meteor.users.find({});
})
