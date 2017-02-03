import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import Routes from '../imports/Routes.jsx';
import '../imports/api/users';

Meteor.startup(() => {
  render(<Routes />, document.getElementById('render-target'));
});
