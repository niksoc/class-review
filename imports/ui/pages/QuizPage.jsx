import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FormGroup, Glyphicon, FormControl, ControlLabel, Checkbox, Button, HelpBlock, Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import Containers from "meteor/utilities:react-list-container";
import { Submissions } from '../../api/submissions'; 
const ListContainer = Containers.ListContainer;
const DocumentContainer = Containers.DocumentContainer;

const QuizPageStudent = (props)=>{
    if(props.submission) return <QuizPageStudentInActive {...props} />; 
    return <QuizPageStudentActive {...props} />;
}

const QuizPageStudentInActive = (props)=>{
    let num = -1;
    const answerString = props.submission.answerString;
    const quiz = props.document.questions.map((q,i)=>{
	let qbsStyle = 'success';
	const choices = q.choices.map((c,ci)=>{
	    num++;
	    bsStyle = 'success';
	    if(c.isCorrect && answerString.charAt(num)==='0' || !c.isCorrect && answerString.charAt(num)==='1'){
		bsStyle = 'danger';
		qbsStyle = 'danger';
	    }
	    return <ListGroupItem key={ci} bsStyle={bsStyle}>{c.isCorrect?<Glyphicon glyph='ok'/>:<Glyphicon glyph='remove'/>} | {c.text}  {c.explanation}</ListGroupItem>; 
	}); 
	const header = <span style={{font:'1rem',fontWeight:800}}>{q.text}</span>;
	return <li key={i}><Panel header={header} bsStyle={qbsStyle}><ListGroup>{choices}</ListGroup></Panel></li>;
    }); 
    return <ul style={{'listStyleType':'none', paddingLeft:0}}>{quiz}</ul>;
};

class QuizPageStudentActive extends React.Component{
    constructor(props){
	super(props);
	let answerString='';
	props.document.questions.forEach((q)=>q.choices.forEach((c)=>answerString+='0'));
	this.state = {answerString, feedback:''};
    }
    handleFormChange(num){
	let answerString = this.state.answerString;
	if(answerString[num] === '0') answerString = answerString.substr(0, num) + '1' + answerString.substr(num + 1);
	else answerString = answerString.substr(0, num) + '0' + answerString.substr(num + 1);
	this.setState({answerString});
    }
    handleChange(event) {
	this.setState({feedback: event.target.value});
    }
    handleSubmit(event){
	event.preventDefault();
	Meteor.call('submissions.insert', {answerString:this.state.answerString, id:this.props.document._id, feedback: this.state.feedback});
    }
    render(){
	let num=0;
	const quiz = this.props.document.questions.map((q,i)=>{
	    const choices = q.choices.map((c,ci)=>{num++;return <Checkbox key={ci} onChange={this.handleFormChange.bind(this, num-1)}>{c.text}</Checkbox>;});
	    return <div key={i}><p className="lead">{q.text}</p>{choices}</div>;
	});
	return (<div>
		{quiz}
		<form onSubmit={this.handleSubmit.bind(this)}>
		<FormGroup controlId="feedback-form">
		<ControlLabel>Feedback</ControlLabel>
		<FormControl componentClass="textarea" value={this.state.feedback} onChange={this.handleChange.bind(this)} />
		<FormControl.Feedback />
		<HelpBlock> Help: Doubts, actionable suggestions. etc. Help the teacher can help you better.  The feedback is anonymized before sending it to the teacher for your comfort, so respect the freedom given to you. Being polite and respectful always helps. 
		</HelpBlock>
		<Button type="submit">Submit</Button>
		</FormGroup>
		</form>
		</div>
	       );
    } 
}

const QuizPageTeacher = (props)=>{
    const quiz = props.document.questions.map((q,i)=>{
	const choices = q.choices.map((c,ci)=><ListGroupItem key={ci} bsStyle={c.isCorrect?'success':null}>{c.text}<span style={{float:"right"}}>{c.count}/{props.document.sub_count}</span></ListGroupItem>);
    const header = <span style={{font:'1rem',fontWeight:800}}>{q.text}<span style={{float:"right"}}>{`${q.correct}/${props.document.sub_count} got it right`}</span></span>;
	return <li key={i}><Panel header={header}><ListGroup>{choices}</ListGroup></Panel></li>;
    }); 
    feedback = props.results.map((r,i)=><ListGroupItem key={i}>{r.feedback}</ListGroupItem>);
    if( feedback.length===0 ) feedback = <p>No items</p>;
    return <ul style={{'listStyleType':'none', paddingLeft:0}}>{quiz}<h2>Feedback</h2><ListGroup>{feedback}</ListGroup></ul>;
};

const QuizPage = (props)=>{
    if(props.currentUser.isTeacher) return <ListContainer collection={Submissions} publication={'submissions'} terms={{lectureid:props.document._id}}><QuizPageTeacher {...props} /></ListContainer>;
    return <DocumentContainer collection={Submissions} selector={{}} publication={'submissions'} terms={{lectureid:props.document._id}} documentPropName={'submission'}><QuizPageStudent {...props} /></DocumentContainer>;
}
export default QuizPage; 
