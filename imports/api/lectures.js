import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Classes, isOwner } from './classes';

export const Lectures = new Mongo.Collection('lectures');

if (Meteor.isServer) {
    Meteor.publish('lectures', function lecturesPublication({cid}) {
	if(!cid) {return Lectures.find({});}
	const cl = Classes.findOne(cid);
	return Lectures.find({_id:{$in:cl.lectures}},{answerString: 0});
    });
}

Meteor.methods({
    'lectures.insert'(obj) {
	let questions = obj.doc.questions;
	const cid = obj.id;
	if (! this.userId) {
	    throw new Meteor.Error('not-authorized');
	}
	if (!isOwner(cid, this.userId)) {
	    throw new Meteor.Error('not-authorized');
	} 
	let answerString = '';
	questions = questions.map((q)=>{
	    q.choices = q.choices.map((c)=>{answerString+=c.isCorrect?'1':'0';c.count=0;return c;});
	    q.correct = 0;
	    return q;});
	const new_lecture = {
	    questions,
	    sub_count:0,
	    createdAt: new Date(),
	    answerString
	};
	Lectures.insert(new_lecture, (err,id)=>{ 
	    if(err) return; 
	    Classes.update(cid, { $push: {lectures : id} });
	}); 
	
   },
    'lectures.remove'(lectureId) {
	if (! this.userId) {
	    throw new Meteor.Error('not-authorized');
	}
	const cid = Classes.findOne({lectures:lectureId})._id;
	if (!isOwner(cid, this.userId)) {
	    throw new Meteor.Error('not-authorized');
	} 
	Classes.update(cid, {$pull:{lectures:lectureId}});
	Lectures.remove(lectureId);
    },
    'lectures.update'(obj) {
	console.log(obj);
	let questions = obj.doc.questions;
	const id = obj.id;
	const cid = obj.cid;
	if (! this.userId) {
	    throw new Meteor.Error('not-authorized');
	}
	if( Classes.findOne(cid).lectures.indexOf(id) === -1) {
	    console.error('lecture ' + id + ' not found in class ' + cid);
	    return;
	}
	if (!isOwner(cid, this.userId)) {
	    throw new Meteor.Error('not-authorized');
	} 
	questions = questions.map((q)=>{
	    q.choices = q.choices.map((c)=>{c.count=0;return c;});
	    q.correct = 0;
	    return q;});
	Lectures.update(id, {$set:{questions, modifiedAt:new Date()}});
    } 
});
