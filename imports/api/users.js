import Classes from './classes';

if(Meteor.isServer) {
    Meteor.publish('userData', function () {
	const selector = {
	    _id: { $eq: this.userId }
	};

	const options = {
	    fields: { isTeacher: 1,
		      emails: 1,
		      _id: 1,
		      classes:1}
	};

	return Meteor.users.find(selector, options);
    });
}
   
