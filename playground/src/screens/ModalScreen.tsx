import React from 'react';
import { NavigationComponentProps } from 'react-native-navigation';
import last from 'lodash/last';
import concat from 'lodash/concat';
import forEach from 'lodash/forEach';
import head from 'lodash/head';
import Root from '../components/Root';
import Button from '../components/Button';
import Navigation from './../services/Navigation';
import { stack } from '../commons/Layouts';
import Screens from './Screens';
import testIDs from '../testIDs';

const {
  PUSH_BTN,
  MODAL_SCREEN_HEADER,
  MODAL_BTN,
  DISMISS_MODAL_BTN,
  DISMISS_UNKNOWN_MODAL_BTN,
  MODAL_LIFECYCLE_BTN,
  DISMISS_PREVIOUS_MODAL_BTN,
  DISMISS_ALL_PREVIOUS_MODAL_BTN,
  DISMISS_ALL_MODALS_BTN,
  DISMISS_FIRST_MODAL_BTN,
  SET_ROOT,
} = testIDs;

interface Props extends NavigationComponentProps {
  previousModalIds?: string[];
  modalPosition?: number;
}

export default class ModalScreen extends React.Component<Props> {
  static options() {
    return {
      topBar: {
        testID: MODAL_SCREEN_HEADER,
        title: {
          text: 'Modal',
        },
      },
    };
  }

  render() {
    return (
      <Root
        componentId={this.props.componentId}
        footer={`Modal Stack Position: ${this.getModalPosition()}`}
      >
        <Button label="Show Modal" testID={MODAL_BTN} onPress={this.showModal} />
        <Button label="Dismiss Modal" testID={DISMISS_MODAL_BTN} onPress={this.dismissModal} />
        <Button
          label="Dismiss Unknown Modal"
          testID={DISMISS_UNKNOWN_MODAL_BTN}
          onPress={this.dismissUnknownModal}
        />
        <Button
          label="Modal Lifecycle"
          testID={MODAL_LIFECYCLE_BTN}
          onPress={this.modalLifecycle}
        />
        {this.getPreviousModalId() && (
          <Button
            label="Dismiss Previous Modal"
            testID={DISMISS_PREVIOUS_MODAL_BTN}
            onPress={this.dismissPreviousModal}
          />
        )}
        {this.props.previousModalIds && (
          <Button
            label="Dismiss All Previous Modals"
            testID={DISMISS_ALL_PREVIOUS_MODAL_BTN}
            onPress={this.dismissAllPreviousModals}
          />
        )}
        <Button
          label="Dismiss All Modals"
          testID={DISMISS_ALL_MODALS_BTN}
          onPress={this.dismissAllModals}
        />
        {this.props.previousModalIds && (
          <Button
            label="Dismiss First Modal"
            testID={DISMISS_FIRST_MODAL_BTN}
            onPress={this.dismissFirstModal}
          />
        )}
        <Button label="Push" testID={PUSH_BTN} onPress={this.push} />
        <Button label="Set Root" testID={SET_ROOT} onPress={this.setRoot} />
      </Root>
    );
  }

  showModal = () => {
    Navigation.showModal({
      component: {
        name: Screens.Modal,
        passProps: {
          modalPosition: this.getModalPosition() + 1,
          previousModalIds: concat([], this.props.previousModalIds || [], this.props.componentId),
        },
      },
    });
  };

  dismissModal = async () => await Navigation.dismissModal(this.props.componentId);

  dismissPreviousModal = () => Navigation.dismissModal(this.getPreviousModalId());

  dismissUnknownModal = () => Navigation.dismissModal('unknown');

  dismissAllPreviousModals = () =>
    forEach(this.props.previousModalIds, (id) => Navigation.dismissModal(id));

  dismissFirstModal = () => Navigation.dismissModal(head(this.props.previousModalIds)!);

  dismissAllModals = () => Navigation.dismissAllModals();

  modalLifecycle = () =>
    Navigation.showModal({
      component: {
        name: Screens.Lifecycle,
        passProps: { isModal: true },
      },
    });

  push = () => Navigation.push(this, Screens.Pushed);

  setRoot = () => Navigation.setRoot(stack(Screens.Pushed));

  getModalPosition = () => this.props.modalPosition || 1;

  getPreviousModalId = () => last(this.props.previousModalIds)!;
}
