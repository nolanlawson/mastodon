import React from 'react';
import PropTypes from 'prop-types';
import BundleContainer from '../containers/bundle_container';
import BundleModalError from './bundle_modal_error';
import ModalLoading from './modal_loading';
import ActionsModal from './actions_modal';
import MediaModal from './media_modal';
import VideoModal from './video_modal';
import BoostModal from './boost_modal';
import ConfirmationModal from './confirmation_modal';
import {
  OnboardingModal,
  ReportModal,
  EmbedModal,
} from '../../../features/ui/util/async-components';

const MODAL_COMPONENTS = {
  'MEDIA': () => Promise.resolve({ default: MediaModal }),
  'ONBOARDING': OnboardingModal,
  'VIDEO': () => Promise.resolve({ default: VideoModal }),
  'BOOST': () => Promise.resolve({ default: BoostModal }),
  'CONFIRM': () => Promise.resolve({ default: ConfirmationModal }),
  'REPORT': ReportModal,
  'ACTIONS': () => Promise.resolve({ default: ActionsModal }),
  'EMBED': EmbedModal,
};

export default class ModalRoot extends React.PureComponent {

  static propTypes = {
    type: PropTypes.string,
    props: PropTypes.object,
    onClose: PropTypes.func.isRequired,
  };

  handleKeyUp = (e) => {
    if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27)
         && !!this.props.type) {
      this.props.onClose();
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyUp, false);
  }

  componentWillReceiveProps (nextProps) {
    if (!!nextProps.type && !this.props.type) {
      this.activeElement = document.activeElement;

      this.getSiblings().forEach(sibling => sibling.setAttribute('inert', true));
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.props.type && !!prevProps.type) {
      this.getSiblings().forEach(sibling => sibling.removeAttribute('inert'));
      this.activeElement.focus();
      this.activeElement = null;
    }
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  getSiblings = () => {
    return Array(...this.node.parentElement.childNodes).filter(node => node !== this.node);
  }

  setRef = ref => {
    this.node = ref;
  }

  renderLoading = modalId => () => {
    return ['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].indexOf(modalId) === -1 ? <ModalLoading /> : null;
  }

  renderError = (props) => {
    const { onClose } = this.props;

    return <BundleModalError {...props} onClose={onClose} />;
  }

  render () {
    const { type, props, onClose } = this.props;
    const visible = !!type;

    if (!visible) {
      return (
        <div className='modal-root' ref={this.setRef} style={{opacity: 0}}>
        </div>
      );
    }

    return (
      <div className='modal-root' ref={this.setRef} style={{opacity: 1}}>
        <div style={{ pointerEvents: visible ? 'auto' : 'none' }}>
          <div role='presentation' className='modal-root__overlay' onClick={onClose} />
          <div role='dialog' className='modal-root__container'>
            <BundleContainer fetchComponent={MODAL_COMPONENTS[type]} loading={this.renderLoading(type)} error={this.renderError} renderDelay={200}>
              {(SpecificComponent) => <SpecificComponent {...props} onClose={onClose} />}
            </BundleContainer>
          </div>
        </div>
      </div>
    );
  }

}
