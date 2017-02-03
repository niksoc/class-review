import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Classes, isOwner } from './classes';
import { Lectures } from './lectures';

/* schema
{lectureid, userid, answerstring, numCorrect, createdAt}
*/
export const Submissions = new Mongo.Collection('submissions');

if (Meteor.isServer) {
    Meteor.publish('submissions', function submissionsPublication({lectureid}) {
	const user = Meteor.users.findOne(this.userId);
	if(user.isTeacher) return Submissions.find({lectureid}, {feedback:1});
	return Submissions.find({sid:this.userId, lectureid});
    });
}

Meteor.methods({
    'submissions.insert'(obj) {
	console.log(obj);
	const answerString = obj.answerString;
	const lectureid = obj.id;
	const feedback = obj.feedback;
	if (! this.userId) {
	    throw new Meteor.Error('not-authorized');
	}
	if( Submissions.findOne({sid:this.userId, lectureid}) ){
	    throw new Meteor.Error('forbidden');
	}
	let lecture = Lectures.findOne(lectureid);
	const cAnswerString = lecture.answerString;
	let i = 0;
	let score = 0;
	lecture.questions = lecture.questions.map((q)=>{
	    let flag = true;
	    q.choices = q.choices.map((c)=>{
		if(answerString.charAt(i)==='1') c.count++;i++;
		if(c.isCorrect && answerString.charAt(i)==='0' || !c.isCorrect && answerString.charAt(i)==='1') flag = false;
		return c;
	    });
	    if(flag) {q.correct++;score++;}
	    return q;
	});
	Lectures.update(lectureid, {$set:{questions:lecture.questions}, $inc:{sub_count:1}});
	const new_submission = {
	    sid: this.userId,
	    lectureid,
	    createdAt: new Date(),
	    answerString,
	    score,
	    feedback
	};
	Submissions.insert(new_submission); 
	
   }
});
