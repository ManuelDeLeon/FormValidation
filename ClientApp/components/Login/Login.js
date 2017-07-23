Login({
  mixin: {
    emailSvc: "email",
    userSvc: "user"
  },
  hovering: false,
  username: ViewModel.property.string.notBlank
    .invalidMessage(`Unique username is required`)
    .validatingMessage(`Checking if username is available`)
    .validateAsync((value, done) => {
      this.userSvc.checkUsername(value, done);
    }),
  email: ViewModel.property.string
    .validate(value => this.emailSvc.validEmail(value))
    .invalidMessage(`Valid email is required`),
  password: ViewModel.property.string
    .validate(value => value.length >= 8)
    .invalidMessage(`Password must be at least 8 characters long`),
  createAccount() {
    if (this.valid()) {
      this.userSvc.createAccount(
        this.username(),
        this.email(),
        this.password()
      );
    }
  },
  render() {
    <div class="ui centered grid">
      <div class="column">
        <div class="ui form segment">
          <div
            class="field required"
            b="class: { error: username.validating || username.invalid && hovering }"
          >
            <label>Username</label>
            <div
              class="ui icon input"
              b="class: { loading: username.validating }"
            >
              <input type="text" placeholder="Username" b="value: username" />
              <i class="user icon" />
            </div>
          </div>

          <div
            class="field required"
            b="class: { error: hovering && email.invalid }"
          >
            <label>Email</label>
            <div class="ui icon input">
              <input type="email" placeholder="Email" b="value: email" />
              <i class="mail icon" />
            </div>
          </div>
          <div
            class="field required"
            b="class: { error: hovering && password.invalid }"
          >
            <label>Password</label>
            <div class="ui icon input">
              <input
                type="password"
                b="value: password, enter: createAccount"
              />
              <i class="lock icon" />
            </div>
          </div>
          <div
            class="ui button"
            b="click: createAccount, class: { primary: valid, 'basic red': hovering && invalid }, hover: hovering"
          >
            Sign Up
          </div>
        </div>
        <div class="ui red segment" b="if: invalid">
          <ul class="ui list">
            <li b="repeat: invalidMessages, text: repeatObject" />
          </ul>
        </div>
      </div>
    </div>;
  }
});
