import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroupItem } from 'react-bootstrap';
import Containers from "meteor/utilities:react-list-container"; 
import { Submissions } from '../../api/submissions'; 
const DocumentContainer = Containers.DocumentContainer;

const LectureListItem = (props)=>{
    let bsStyle = null, text = props.currentUser.isTeacher?'submissions: '+props.obj.sub_count:'Unattempted';
    if(props.document){
	bsStyle = 'success';
	text = props.document.score;
    }
    return <LinkContainer to={`/class/${props.cid}/lecture/${props.obj._id}`}>
	<ListGroupItem header={props.obj.createdAt.getDate() +'/'+ (props.obj.createdAt.getMonth()+1)} bsStyle={bsStyle}>
	{text}
	</ListGroupItem>
	</LinkContainer>;
}

const LectureListItemContainer = (props)=><DocumentContainer collection={Submissions} selector={{}} publication={'submissions'} terms={{lectureid:props.obj._id}}><LectureListItem {...props} /></DocumentContainer>;
export default LectureListItemContainer;
