import {SimpleSchema} from 'meteor/aldeed:simple-schema'; 
 
export const UserSchema = new SimpleSchema({
    emails: {
	type: [Object],
	// this must be optional if you also use other login services like facebook,
	// but if you use only accounts-password, then it can be required
	optional: true
    },
    "emails.$.address": {
	type: String,
	regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
	type: Boolean
    },
    verified: {
	type: Boolean,
	optional: true
    },
    createdAt: {
	type: Date,
	optional: true
    },
    services: {
	type: Object,
	optional: true,
	blackbox: true
    },
    isTeacher: {
	type: Boolean
    },
    classes: {
	type: [ClassSchema]
    }
});

export const AnswerChoiceSchema = new SimpleSchema({
    text: {
	type: String
    },
    explanation: {
	type: String,
	optional: true
    },
    isCorrect: {
	type: Boolean,
	optional: true 
    }
});
AnswerChoiceSchema.labels({text:'choice text',explanation:'optional explanation',isCorrect:'correct choice?'});

export const QuestionSchema = new SimpleSchema({
    text: {
	type: String 
    },
    choices: {
	type: [AnswerChoiceSchema],
	minCount: 2
    }
});
QuestionSchema.labels({text:'Question text'});

export const LectureSchema = new SimpleSchema({
    questions: {
	type: [QuestionSchema],
	minCount: 1
    }
});

export const ClassSchema = new SimpleSchema({
    name: {
	type: String,
        min: 3,
        max: 50
    } 
    //owner: {
    //    type: UserSchema 
    //}, 
    //lectures: { 
	//type: [LectureSchema]
    //}
}); 

export const AddStudentToClassSchema = new SimpleSchema({
    email: {
	type: String,
	min:1
    }
});

AddStudentToClassSchema.labels({email:'SRM given e-mail: (The domains of the email (@srmuniv.edu.in) can be omitted)'}); 
