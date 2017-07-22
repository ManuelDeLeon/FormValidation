import "../mixins/mixins";
Layout({
  render() {
    <div class="container-fluid">
      <div class="ui one column centered grid">
        <div id="body-main" class="column">
          <br />
          {this.props.children}
        </div>
      </div>
    </div>;
  }
});
