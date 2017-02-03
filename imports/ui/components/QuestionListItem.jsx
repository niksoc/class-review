import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import AutoFields from 'uniforms-bootstrap3/AutoFields';

const QuestionListItem = (props)=>{
    const choices = props.obj.choices.map((c,i)=>{
	let bsStyle = null;
	if(c.isCorrect) bsStyle = 'success'; 
	return <ListGroupItem key={i} bsStyle={bsStyle}>{c.text}<span style={{float:"right"}}>{c.count}</span></ListGroupItem>;
    });
    const header = <span style={{font:'1rem',fontWeight:800}}>{props.obj.text}<span style={{float:"right"}}>{props.obj.correct + ' got it right'}</span></span>;
    return <ListGroupItem header={header}>{choices}</ListGroupItem>; 
};

export default QuestionListItem;
 
