import React from 'react';
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import { ClassSchema, LectureSchema, AddStudentToClassSchema } from '../../Schemas';
import { Classes } from '../../api/classes'; 
import { Lectures } from '../../api/lectures'; 

const commonProps = {onSubmitSuccess:() => alert('Success!')};

export default Forms = {
    classes:()=>[{
	    title:'New Class',
	formElement:<AutoForm schema={ClassSchema} onSubmit={doc => Meteor.call('classes.insert', doc)} {...commonProps}/>}], 
    lectures:(id)=>[{title:'Edit Class',
		     formElement:<AutoForm schema={ClassSchema} {...commonProps} onSubmit={
			doc => Meteor.call('classes.update', {doc, id})} model={Classes.findOne(id)} />},{
	title:'New Lecture',
			    formElement:<AutoForm schema={LectureSchema} {...commonProps} onSubmit={doc => Meteor.call('lectures.insert', {doc, id})} />},{
	title:'Add student',
				formElement:<AutoForm schema={AddStudentToClassSchema} {...commonProps} onSubmit={doc => Meteor.call('classes.addStudent', {email:doc.email, classId:id})}/>}],
    quiz:(id,cid)=>[{title:'Edit Lecture',
	    formElement:<AutoForm schema={LectureSchema} model={Lectures.findOne(id)} {...commonProps} onSubmit={doc => Meteor.call('lectures.update', {doc, cid, id})}  />}] 

};
