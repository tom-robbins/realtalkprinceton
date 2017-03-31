Meteor.startup(function () {

  // user roles
  var roles = ['admin']

  // this will fail if the roles package isn't installed
  if(Meteor.roles.find().count() === 0) {
    roles.map(function(role) {
      Roles.createRole(role)
    })
  }

  console.log('Running server startup code...');

  Accounts.onCreateUser(function (options, user) {
    Roles.setRolesOnUserObj(user, ['admin']);

    if (options.profile) {
      // include the user profile
      user.profile = options.profile
    }

    // other user object changes...
    // ...

    return user;
  });

  var id = Meteor.users.findOne({username: "thomasrr"})
  console.log(id)
  Roles.addUsersToRoles(id._id, ['admin']);

});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
})
