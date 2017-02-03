import React, { Component } from 'react';
import AccountsUIWrapper from './components/AccountsUIWrapper.jsx';
//import Loading from './components/Loading.jsx';
import { Link, browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Navbar,NavItem,Nav } from 'react-bootstrap'; 
import { Classes } from '../api/classes.js'; 
import Containers from "meteor/utilities:react-list-container";

const DocumentContainer = Containers.DocumentContainer;
const ListContainer = Containers.ListContainer;

const Layout  = (props)=>{
    if(props.location.pathname==='/login' && props.document) {location.pathname= '/';return null;}
    if(props.location.pathname!=='/login' && !Meteor.userId()) {location.pathname='/login'; return null;}
    if(Meteor.userId() && !props.document) return null;
    if(props.document && !props.document.classes) return null;
    return (
	<div className='container'>
	  <Navbar> 
	    <Navbar.Header><Navbar.Brand>Class Review</Navbar.Brand></Navbar.Header>
	    <Nav><NavItem><AccountsUIWrapper /></NavItem></Nav>
	  </Navbar> 
	  {props.location.pathname!=='/login'?
	      <ListContainer {...config}>
		    {React.cloneElement(props.children, {user:props.document})}
	      </ListContainer>:props.children}
	</div>
    );
}

//The below config is to subscribe to classes at any stage of the route
const config = {
    collection: Classes,
    selector: {},
    options: {},
    publication: 'classes',
    terms: {uid:Meteor.userId()},
    cacheSubscription: true 
};

export default createContainer((props)=>{
    Meteor.subscribe('userData');
    const document = Meteor.user();
    return { document, ...props }
}, Layout); 
