// @flow

import React, {Component} from 'react'
import {TextInput} from 'react-native'

import IonIcon from 'react-native-vector-icons/Ionicons'

import ModalButtons from './ModalButtons.ui'
import StylizedModal from '../../../components/Modal/Modal.ui'

import strings from '../../../../../locales/default'

import styles from './styles'

const HEADER_TEXT    = strings.enUS['settings_title_auto_logoff']
const HEADER_SUBTEXT = strings.enUS['settings_title_auto_logoff']

type Props = {
  autoLogoutTimeInMinutes: number,
  showModal: boolean,
  onDone: (number) => void,
  onCancel: () => void
}
type State = {autoLogoutTimeInMinutes: number}

export default class AutoLogoutModal extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {autoLogoutTimeInMinutes: props.autoLogoutTimeInMinutes}
  }

  render () {
    const modalMiddle = <TextInput ref={'autoLogoutInput'} autoFocus selectTextOnFocus
      onChangeText={(autoLogoutTimeInMinutes) => this.setState({autoLogoutTimeInMinutes: +autoLogoutTimeInMinutes})}
      autoCorrect={false}
      keyboardType={'numeric'}
      defaultValue={this.props.autoLogoutTimeInMinutes}
      onSubmitEditing={this.onSubmit} />
    const modalBottom = <ModalButtons onDone={this.onSubmit} onCancel={this.onCancel} />
    const icon = <IonIcon name='ios-time-outline' size={24} style={styles.icon} />

    return <StylizedModal visibilityBoolean={this.props.showModal}
      featuredIcon={icon}
      headerText={HEADER_TEXT}
      headerSubtext={HEADER_SUBTEXT}
      modalMiddle={modalMiddle}
      modalBottom={modalBottom}
      onExitButtonFxn={this.onCancel} />
  }

  onSubmit = () => {
    this.props.onDone(this.state.autoLogoutTimeInMinutes)
  }

  onCancel = () => {
    this.setState({autoLogoutTimeInMinutes: this.props.autoLogoutTimeInMinutes})
    this.props.onCancel()
  }
}
