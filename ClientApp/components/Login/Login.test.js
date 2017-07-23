import React from "react";
import { shallow } from "enzyme";
import { Login } from "./Login";
import ViewModel from "viewmodel-react";

describe("Login", () => {
  describe("view model", () => {
    let login;
    beforeEach(() => {
      login = new Login();
    });

    it("has user mixin", () => {
      expect(login.hasMixin("user", "userSvc")).toBe(true);
    });
    it("has email mixin", () => {
      expect(login.hasMixin("email", "emailSvc")).toBe(true);
    });

    describe("hovering", () => {
      it("defaults to false", () => {
        expect(login.hovering()).toBe(false);
      });
    });

    describe("username", () => {
      beforeEach(() => {
        login.userSvc = {
          checkUsername: (value, isValid) => isValid(true)
        };
      });
      it("defaults to blank", () => {
        expect(login.username()).toBe("");
      });
      it("is invalid with blank", done => {
        const assert = () => {
          expect(login.username.valid()).toBe(false); // validatED
          done();
        };
        login.userSvc = {
          checkUsername: (value, isValid) => isValid(true) || assert()
        };

        expect(login.username.valid()).toBe(false); // validatING
        if (!login.username.validating()) {
          done();
        }
      });
      it("is valid with a value", done => {
        const assert = () => {
          expect(login.username.valid()).toBe(true); // validatED
          done();
        };
        login.userSvc = {
          checkUsername: (value, isValid) => isValid(true) || assert()
        };
        login.username("A");
        expect(login.username.valid()).toBe(false); // validatING
      });
    });

    describe("email", () => {
      it("defaults to blank", () => {
        expect(login.email()).toBe("");
      });
      it("is invalid if validEmail returns false", () => {
        let sentToEmailSvc;
        login.emailSvc = {
          validEmail(value) {
            sentToEmailSvc = value;
            return false;
          }
        };
        login.email("A");
        expect(login.email.valid()).toBe(false);
        expect(sentToEmailSvc).toBe("A");
      });
      it("is valid if validEmail returns false", () => {
        let sentToEmailSvc;
        login.emailSvc = {
          validEmail(value) {
            sentToEmailSvc = value;
            return true;
          }
        };
        login.email("A");
        expect(login.email.valid()).toBe(true);
        expect(sentToEmailSvc).toBe("A");
      });
    });

    describe("password", () => {
      it("defaults to blank", () => {
        expect(login.password()).toBe("");
      });
      it("is invalid with blank", () => {
        expect(login.password.valid()).toBe(false);
      });
      it("is invalid with 7 chars", () => {
        login.password("1234567");
        expect(login.password.valid()).toBe(false);
      });
      it("is valid with 8 chars", () => {
        login.password("12345678");
        expect(login.password.valid()).toBe(true);
      });
    });

    describe("createAccount", () => {
      it("calls service when valid", () => {
        let usernameSent, emailSent, passwordSent;
        login.userSvc = {
          createAccount(username, email, password) {
            usernameSent = username;
            emailSent = email;
            passwordSent = password;
          }
        };

        login.username("A");
        login.email("B");
        login.password("C");
        login.valid = () => true;
        login.createAccount();
        expect(usernameSent).toBe("A");
        expect(emailSent).toBe("B");
        expect(passwordSent).toBe("C");
      });
      it("doesn't call service when invalid", () => {
        let called = false;
        login.userSvc = {
          createAccount() {
            called = true;
          }
        };

        login.valid = () => false;
        login.createAccount();
        expect(called).toBe(false);
      });
    });
  });

  describe("bindings", () => {
    const emailSvc = () => {};
    emailSvc.validEmail = () => true;
    const userSvc = () => {};
    userSvc.checkUsername = () => true;
    const rendered = shallow(
      <Login {...{ userSvc, emailSvc }} invalidMessages={[1]} />
    );

    describe("username", () => {
      it("binds field", () => {
        const elements = rendered.find(
          `.field.required[data-bind="class: { error: username.validating || username.invalid && hovering }"]`
        );
        expect(elements.length).toBe(1);
      });
      it("binds icon", () => {
        const elements = rendered.find(
          `.icon[data-bind="class: { loading: username.validating }"]`
        );
        expect(elements.length).toBe(1);
      });
      it("binds input", () => {
        const elements = rendered.find(
          `input[type="text"][data-bind="value: username"]`
        );
        expect(elements.length).toBe(1);
      });
    });

    describe("email", () => {
      it("binds field", () => {
        const elements = rendered.find(
          `.field.required[data-bind="class: { error: hovering && email.invalid }"]`
        );
        expect(elements.length).toBe(1);
      });
      it("binds input", () => {
        const elements = rendered.find(
          `input[type="email"][data-bind="value: email"]`
        );
        expect(elements.length).toBe(1);
      });
    });

    describe("password", () => {
      it("binds field", () => {
        const elements = rendered.find(
          `.field.required[data-bind="class: { error: hovering && password.invalid }"]`
        );
        expect(elements.length).toBe(1);
      });
      it("binds input", () => {
        const elements = rendered.find(
          `input[type="password"][data-bind="value: password, enter: createAccount"]`
        );
        expect(elements.length).toBe(1);
      });
    });

    it("binds button", () => {
      const elements = rendered.find(
        `.button[data-bind="click: createAccount, class: { primary: valid, 'basic red': hovering && invalid }, hover: hovering"]`
      );
      expect(elements.length).toBe(1);
    });

    describe("error list", () => {
      it("binds segment", () => {
        const elements = rendered.find(`.red.segment[data-bind="if: invalid"]`);
        expect(elements.length).toBe(1);
      });
      it("binds li", () => {
        const elements = rendered.find(
          `.red.segment li[data-bind="repeat: invalidMessages, text: repeatObject"]`
        );
        expect(elements.length).toBe(1);
      });
    });
  });
});
