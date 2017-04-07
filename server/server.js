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
  var id = Meteor.users.findOne({username: "thomasrr"})
  Roles.addUsersToRoles(id._id, ['admin']);

});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
})
