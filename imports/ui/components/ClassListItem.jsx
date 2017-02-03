import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { ListGroupItem } from 'react-bootstrap';

const ClassListItem = (props)=>
	<LinkContainer to={`/class/${props.obj._id}`}>
	<ListGroupItem header={props.obj.name}></ListGroupItem>
      </LinkContainer>;

export default ClassListItem;
