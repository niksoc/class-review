import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
    const email = user.emails[0].address;
    user.isTeacher = email.substr(email.length - 5) === 'ac.in';
    if(user.isTeacher) Accounts.sendVerificationEmail(user._id);
    user.createdAt = new Date();
    user.classes = [];
    return user;
});

Accounts.config({sendVerificationEmail: true, forbidClientAccountCreation: false}); 
