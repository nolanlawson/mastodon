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
        <i style={style} className='status__action-bar-preview-button icon-button fa fa-fw fa-reply' />
        <i style={style} className='status__action-bar-preview-button icon-button fa fa-fw fa-retweet' />
        <i style={style} className='status__action-bar-preview-button icon-button fa fa-fw fa-star' />
        <i style={style} className='status__action-bar-preview-button icon-button fa fa-fw fa-ellipsis-h' />
      </div>
    );
  }

}
