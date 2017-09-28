import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePureComponent from 'react-immutable-pure-component';

export default class ExtendedVideoPlayer extends ImmutablePureComponent {

  static propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    time: PropTypes.number,
    controls: PropTypes.bool.isRequired,
    muted: PropTypes.bool.isRequired,
    onRef: PropTypes.func,
  };

  updateOnProps = ['src', 'width', 'height', 'time', 'controls', 'muted']

  handleLoadedData = () => {
    if (this.props.time) {
      this.video.currentTime = this.props.time;
    }
  }

  componentDidMount () {
    this.video.addEventListener('loadeddata', this.handleLoadedData);
  }

  componentWillUnmount () {
    this.video.removeEventListener('loadeddata', this.handleLoadedData);
  }

  setRef = (c) => {
    this.video = c;
    this.props.onRef && this.props.onRef(c);
  }

  render () {
    return (
      <div className='extended-video-player'>
        <video
          ref={this.setRef}
          src={this.props.src}
          autoPlay
          muted={this.props.muted}
          controls={this.props.controls}
          loop={!this.props.controls}
        />
      </div>
    );
  }

}
