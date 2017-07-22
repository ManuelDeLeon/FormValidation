import ViewModel from "viewmodel-react";

const emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

ViewModel.mixin({
  email: {
    validEmail(email) {
      return !!email && emailRegex.test(email);
    }
  },
  user: {
    createAccount(username, email, password) {
      toastr.info(`Created account for ${email}`);
    },
    checkUsername(username, done) {
      setTimeout(() => done(true), 1000);
    }
  }
});
