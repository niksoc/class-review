import React, { Component } from 'react';
import { Link } from 'react-router';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { ClassListItem } from './ClassListItem';
 
const ClassListView = (props)=>{
    //console.log(props);
    if(props.results.length===0) return <p className="lead">No items yet</p>;
    const class_list = props.results.map((cl, i)=>React.createElement(props.itemType, {obj:cl, key:i, num:i, ...props.itemProps, currentUser:props.currentUser}));
      return (
	  <ListGroup>
	    {class_list}
	  </ListGroup>
      );
}

export default ClassListView;
