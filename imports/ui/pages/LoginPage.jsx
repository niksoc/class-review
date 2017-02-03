import React from 'react';
import { BlazeToReact } from 'meteor/gwendall:blaze-to-react';

const AtFormReact = React.createClass({
  render() {
    return <BlazeToReact {...this.props} blazeTemplate='atForm' />
  }
});

class LoginPage extends React.Component{
    constructor(props){
	super(props);
	this.state = {formState:'signIn'};
    }
    changeState(newState){
	this.setState({formState:newState});
    }
    render(){
	return <AtFormReact state={this.state.formState} />
    }
}

export default LoginPage;
