var React = require('react');
var ReactDOM = require('react-dom');
var $ = require("jquery");

const top_30_days_url = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
const top_all_time_url = "https://fcctop100.herokuapp.com/api/fccusers/top/alltime";

var CoderList = React.createClass({
  propsTypes: {
    url: React.PropTypes.object.isRequired
  },
  render: function () {
    var coderRows = this.props.data.map(function(coder, idx) {
      return (
        <tr key={"coder_idx"+idx}>
          <td className="col1">{idx+1}</td>
          <td className="col2"><img src={coder.img} className="coderimg" />{coder.username}</td>
          <td className="col3">{coder.recent}</td>
          <td className="col4">{coder.alltime}</td>
        </tr>
      );
    });
    return <tbody>{coderRows}</tbody>;
  }
});

var CoderData = React.createClass({
  propsTypes: {
    url: React.PropTypes.string.isRequired
  },
  loadCodersFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCodersFromServer();
  },
  componentDidUpdate: function() {
    this.loadCodersFromServer();
  },
  render: function() {
    return (
      <CoderList data={this.state.data} />
    );
  }
});

var CoderTable = React.createClass({
    getInitialState: function() {
      return {url: top_all_time_url};
    },
    handleSortBy30: function() {
      if (this.state.url === top_all_time_url) {
        this.setState({url: top_30_days_url});
      }
    },
    handleSortByAll: function() {
      if (this.state.url !== top_all_time_url) {
        this.setState({url: top_all_time_url});
      }
    },
    render: function() {
        return (
          <table className="table table-striped">
            <thead>
              <tr>
                <td className="col1">#</td>
                <td className="col2">User</td>
                <td className="col3"><button onClick={this.handleSortBy30}>Points in past 30 days <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button></td>
                <td className="col4"><button onClick={this.handleSortByAll}>Points in all time <span className="glyphicon glyphicon-chevron-down" aria-hidden="true"></span></button></td>
              </tr>
            </thead>
            <CoderData url={this.state.url} />
          </table>
        );
    }
});

ReactDOM.render(<CoderTable />, document.getElementById('react-app'));
