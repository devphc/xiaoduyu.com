import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { showSign } from '../../actions/sign';
// import { isMember } from '../../reducers/user';
// import { like, unlike } from '../../actions/like';
import { loadReportTypes } from '../../store/actions/report';
import { addBlock } from '../../store/actions/block';
import { isMember } from '../../store/reducers/user';
import { getProfile } from '../../store/reducers/user';

// style
import './style.scss';


@connect(
  (state, props) => ({
    isMember: isMember(state),
    me: getProfile(state)
  }),
  dispatch => ({
    loadReportTypes: bindActionCreators(loadReportTypes, dispatch),
    addBlock: bindActionCreators(addBlock, dispatch)
  })
)
@withRouter
export default class ReportMenu extends Component {

  constructor(props) {
    super(props)
    this.stopPropagation = this.stopPropagation.bind(this);
    this.report = this.report.bind(this);
    this.block = this.block.bind(this);
    this.edit = this.edit.bind(this);
  }

  stopPropagation(e) {
    e.stopPropagation();
    this.props.loadReportTypes();
  }

  edit (e) {
    e.stopPropagation();

    const { posts, comment } = this.props;

    if (comment) {
      $('#editor-comment-modal').modal({
        show: true
      }, {
        type:'edit',
        comment
      });
    } else {
      this.props.history.push(`/new-posts?posts_id=${posts._id}`);
    }

  }

  async block(e) {
    e.stopPropagation();
    const { posts, user, comment, addBlock } = this.props;

    let args = {};

    if (posts) {
      args.posts_id = posts._id;
    } else if (user) {
      args.people_id = user._id;
    } else if (comment) {
      args.comment_id = comment._id;
    } else {
      Toastify({
        text: '缺少资源',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
      return
    }

    let [ err, res ] = await addBlock({ args });

    if (res && res.success) {
      Toastify({
        text: '屏蔽成功',
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
      }).showToast();
    } else if (err && err.message) {
      Toastify({
        text: err.message,
        duration: 3000,
        backgroundColor: 'linear-gradient(to right, #ff6c6c, #f66262)'
      }).showToast();
    }

  }

  report(e) {

    e.stopPropagation();

    const { posts, user, comment } = this.props;

    $('#report').modal({
      show: true
    }, {
      posts,
      user,
      comment
    });

  }

  render () {

    const { posts, comment, isMember, me } = this.props;

    if (!isMember) return '';

    return (<span>
      {/* dropdown-menu */}
      <a href="javascript:void(0)" styleName="menu" data-toggle="dropdown" onClick={this.stopPropagation}>其他</a>
      <div className="dropdown-menu">
        {posts && posts.user_id._id == me._id ||
          comment && comment.user_id._id == me._id ?
          <a className="dropdown-item" href="javascript:void(0)" onClick={this.edit}>编辑</a>
          : null}
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.block}>不感兴趣</a>
        <a className="dropdown-item" href="javascript:void(0)" onClick={this.report}>举报</a>
      </div>
      {/* dropdown-menu end */}
    </span>)
  }
}
