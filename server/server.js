Meteor.startup(function () {

  // user roles
  var roles = ['admin', 'pleb']

  // this will fail if the roles package isn't installed
  if(Meteor.roles.find().count() === 0) {
    roles.map(function(role) {
      Roles.createRole(role)
    })
  }

  var admins = ['thomasrr', 'vmo', 'savannah', 'jmerali', 'lanchang']

  console.log('Adding admin user privileges...');
  for (i = 0; i < admins.length; i++) {
    var id = Meteor.users.findOne({username: admins[i]})
    console.log(id)
    if (id) {
      Roles.addUsersToRoles(id._id, ['admin']);
    }
  }

});

Meteor.publish(null, function (){
  return Meteor.roles.find({})
})
