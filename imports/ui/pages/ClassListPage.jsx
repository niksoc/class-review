import React, { Component } from 'react';
import AccountsUIWrapper from '../components/AccountsUIWrapper';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Navbar,NavItem,Nav, Accordion, Panel } from 'react-bootstrap';
import ClassListView from '../components/ClassListView';
import Containers from "meteor/utilities:react-list-container";
import AutoForm from 'uniforms-bootstrap3/AutoForm';
import ClassListItem from '../components/ClassListItem';
import LectureListItem from '../components/LectureListItem';
import { ClassSchema, LectureSchema } from '../../Schemas';
import QuizPage from '../pages/QuizPage';
import Forms from '../components/Forms';

import { Classes } from '../../api/classes'; 
import { Lectures } from '../../api/lectures'; 

const ListContainer = Containers.ListContainer;
const DocumentContainer = Containers.DocumentContainer;
const ClassListPage = (props)=>{
    let config = {};
    let formsList = [];
    let backLink = '/';
    switch(props.route.name){
    case 'classes': config = {
	collection: Classes,
	selector: {},
	options: {},
	publication: 'classes',
	terms: {uid:Meteor.userId()},
	component: ClassListView, 
	componentProps: {itemType: ClassListItem}
    }; 
	backLink = '/';
	formsList = Forms[props.route.name]();
	break;
    case 'lectures':
	config = {
	collection: Lectures,
	selector: {},
	options: {questions:0},
	publication: 'lectures',
	terms: {cid:props.params._id},
	component: ClassListView, 
	componentProps: {itemType: LectureListItem, itemProps: {cid:props.params._id}},
    };
	backLink = '/';
	formsList = Forms[props.route.name](props.params._id);
	break;
    case 'quiz':
	config = {
	collection: Lectures,
	selector: {_id:props.params._id},
	options: {},
	publication: 'lectures',
	terms: {cid:props.params.cl_id},
	component: QuizPage, 
	componentProps:{id:props.params._id}
    }; 
	backLink = '/class/'+props.params.cl_id;
	formsList = Forms[props.route.name](props.params._id,props.params.cl_id);
	break;
    };
    let forms = null;
    if(props.user.isTeacher){
	if(props.user.emails[0].verified){
	    if(formsList.length>0){
		const formList = formsList.map((f)=>{const i=Math.floor((Math.random() * 10000));return <Panel header={f.title} key={i} eventKey={i}>{f.formElement}</Panel>});
		forms = <Accordion>{formList}</Accordion>;
	    }
	}
	else forms = <p className="lead">Please verify your account by clicking on the mail sent to you. This is needed for confirming your identity as a teacher.</p>;
}
    return ( 
	<div>
	    <Link to={backLink}>back</Link>
	    {forms}
	{props.route.type==='document'?<DocumentContainer {...config} />:<ListContainer {...config} />}
	</div>
    );

}

export default ClassListPage;
