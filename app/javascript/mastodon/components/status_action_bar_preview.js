import React from 'react';

export default class StatusActionBarPreview extends React.Component {

  render () {
    return (
      <div className='status__action-bar-preview'>
        <i className='fa fa-fw fa-reply' />
        <i className='fa fa-fw fa-retweet' />
        <i className='fa fa-fw fa-star' />
        <i className='fa fa-fw fa-ellipsis-h' />
      </div>
    );
  }

}
