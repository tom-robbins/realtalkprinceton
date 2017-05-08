Meteor.startup(function () {


  // user roles
  var roles = ['admin', 'pleb']

  // this will fail if the roles package isn't installed
  if(Meteor.roles.find().count() === 0) {
    roles.map(function(role) {
      Roles.createRole(role)
    })
  }

  console.log('Running server startup code...');

  Accounts.onCreateUser(function (options, user) {
    Roles.setRolesOnUserObj(user, ['pleb']);

    if (options.profile) {
      // include the user profile
      user.profile = options.profile
    }

    // other user object changes...
    // ...

    return user;
  });


});

Meteor.publish('userList', function (){
  return Meteor.users.find({});
})
