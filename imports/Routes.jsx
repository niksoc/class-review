import React from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import AccountsUIWrapper from './ui/components/AccountsUIWrapper'; 
import { Meteor } from 'meteor/meteor';
// route components
import ClassListPage from './ui/pages/ClassListPage';
import ClassListView from './ui/components/ClassListView';
import QuestionListItem from './ui/components/QuestionListItem';
import Layout from './ui/Layout';
import NotFoundPage from './ui/pages/NotFoundPage';

export default Routes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={ClassListPage} name={'classes'} />
      <Route path="/class/:_id" component={ClassListPage} name={'lectures'} />
      <Route path="/class/:cl_id/lecture/:_id" component={ClassListPage} name={'quiz'} type={'document'} />
      <Route path="/login" component={()=><span>Please log in</span>} onEnter={redirectToHome} />
      <Route path="/logout" onEnter={()=>Meteor.logout(()=>browserHistory.push('/login'))} />
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);


function requireAuth(nextState, replace) {
    if (!Meteor.userId()) {
	replace({
	    pathname: '/login',
	    state: { nextPathname: nextState.location.pathname }
	});
    }
}

function redirectToHome(nextState, replace) {
    if (Meteor.userId()) {
	replace({
	    pathname: '/',
	    state: { nextPathname: nextState.location.pathname }
	});
    }
}

