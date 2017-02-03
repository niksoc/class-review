import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/AccountCreation';
import '../imports/api/users';
import '../imports/api/classes';
import '../imports/api/lectures';
import '../imports/api/submissions';

Meteor.startup(() => {
    // code to run on server at startup
    // Deny all client-side updates to user documents
    Meteor.users.deny({
	update() { return true; }
    });
});
