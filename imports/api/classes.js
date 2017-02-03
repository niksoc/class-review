import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Lectures } from './lectures';
import { Accounts } from 'meteor/accounts-base';

export const Classes = new Mongo.Collection('classes');/*,{
    transform: function(doc) {
	const email = Meteor.users.findOne(doc.owner, {emails:1}).emails[0].address;
	doc.owner_name = email.substr(0, email.indexOf('@'));
	return doc;
    }
});*/

if (Meteor.isServer) {
    Meteor.publish('classes', function classesPublication({uid}) {
	const user = Meteor.users.findOne(uid);
	return Classes.find({_id:{$in:user.classes}});
    });
}

export function isOwner(id, uid){
    const obj = Classes.findOne(id);
    return obj.owner === uid;
}

Meteor.methods({
    'classes.addStudent'(obj){
	let {classId,email} = obj;
	console.log(email);
	if (!isOwner(classId, this.userId) ) {
	    throw new Meteor.Error('not-authorized');
	}
	if(email.indexOf('@')===-1) email += '@srmuniv.edu.in';
	const student = Accounts.findUserByEmail(email);
	if(student.classes.indexOf(classId)===-1) Meteor.users.update(student._id, {$push:{classes:classId}});
    },
    'classes.insert'({name}) {
	check(name, String);
	if (! this.userId) {
	    throw new Meteor.Error('not-authorized');
	}
	const user = Meteor.users.findOne(this.userId);
	if (! user.isTeacher || ! user.emails[0].verified) {
	    throw new Meteor.Error('not-authorized');
	} 
	const new_class = {
	    name,
	    owner: this.userId,
	    lectures: []
	};
	Classes.insert(new_class, (err,id)=>{ 
	    if(err) return; 
	    Meteor.users.update(this.userId, { $push: {classes : id} });
	});
    },
    'classes.remove'(classId) {
	check(classId, String);
	if (!isOwner(classId, this.userId) ) {
	    throw new Meteor.Error('not-authorized');
	}
	Classes.remove(classId);
    },
    'classes.update'(obj) {
	const classId = obj.id;
	const name = obj.doc.name;
	check(classId, String);
	check(name, String);
	if (!isOwner(classId, this.userId) ) {
	    throw new Meteor.Error('not-authorized');
	}
	Classes.update(classId, {$set: {name}});
    } 
});
