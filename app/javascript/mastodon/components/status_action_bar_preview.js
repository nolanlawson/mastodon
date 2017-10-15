import React from 'react';
import PropTypes from 'prop-types';

export default class StatusActionBarPreview extends React.PureComponent {

  static propTypes = {
    size: PropTypes.number,
  }

  static defaultProps = {
    size: 18,
  }

  render () {

    const style = {
      fontSize: `${this.props.size}px`,
      width: `${this.props.size * 1.28571429}px`,
      height: `${this.props.size * 1.28571429}px`,
      lineHeight: `${this.props.size}px`,
    };

    return (
      <div className='status__action-bar-preview'>
        <button style={style} className='icon-button status__action-bar-preview-button'><i className='fa fa-fw fa-reply' /></button>
        <button style={style} className='icon-button status__action-bar-preview-button'><i className='fa fa-fw fa-retweet' /></button>
        <button style={style} className='icon-button status__action-bar-preview-button'><i className='fa fa-fw fa-star' /></button>
        <button style={style} className='icon-button status__action-bar-preview-button'><i className='fa fa-fw fa-ellipsis-h' /></button>
      </div>
    );
  }

}
