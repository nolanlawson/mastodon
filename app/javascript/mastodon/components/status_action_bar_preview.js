import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class StatusActionBarPreview extends React.PureComponent {

  static propTypes = {
    size: PropTypes.number,
    reblogged: PropTypes.bool,
    favourited: PropTypes.bool,
  }

  static defaultProps = {
    size: 18,
  }

  render () {

    const { reblogged, favourited, size } = this.props;

    const style = {
      height: `${size * 1.28571429}px`,
      fontSize: `${size}px`,
      lineHeight: `${size}px`,
    };

    const iconStyle = {
      width: `${size * 1.28571429}px`,
    };

    const retweetStyle = {
      marginLeft: `${(size * 1.28571429) - 22}px`,
      marginTop: `${(size * 1.28571429) - 22}px`,
    };

    return (
      <div aria-hidden='true' style={style} className='status__action-bar-preview'>
        <i style={iconStyle} className='icon-button status__action-bar-preview-button fa fa-fw fa-reply' />
        <i style={retweetStyle} className={classNames('icon-button status__action-bar-preview-button fa fa-fw fa-retweet', { pressed: reblogged })} />
        <i style={iconStyle} className={classNames('icon-button status__action-bar-preview-button fa fa-fw fa-star', { pressed: favourited })} />
        <i style={iconStyle} className='icon-button status__action-bar-preview-button fa fa-fw fa-ellipsis-h' />
      </div>
    );
  }

}
