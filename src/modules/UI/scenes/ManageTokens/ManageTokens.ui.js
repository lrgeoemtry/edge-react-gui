// @flow

import React, {Component} from 'react'
import {
  View,
  FlatList,
  ActivityIndicator
} from 'react-native'
import Text from '../../components/FormattedText'
import s from '../../../../locales/strings.js'
import Gradient from '../../components/Gradient/Gradient.ui'
import {Actions} from 'react-native-router-flux'
import {connect} from 'react-redux'
// import * as CORE_SELECTORS from '../../../Core/selectors.js'
import styles from './style.js'
import ManageTokenRow from './ManageTokenRow.ui.js'
import {PrimaryButton, SecondaryButton} from '../../components/Buttons'
import {
  getEnabledTokens,
  setEnabledTokens
} from '../../Wallets/action.js'
import type { GuiTokenInfo, GuiWallet } from '../../../../types'

export type Props = {
  guiWallet: GuiWallet,
  manageTokensPending: boolean
}

export type DispatchProps = {
  getEnabledTokensList: (string) => void,
  setEnabledTokensList: (string, Array<GuiTokenInfo>) => void
}

export type State = {
  enabledTokens: Array<GuiTokenInfo>
}

class ManageTokens extends Component<Props & DispatchProps, State> {
  constructor (props: Props & DispatchProps) {
    super(props)
    this.state = {
      enabledTokens: []
    }
  }

  componentDidMount () {
    let enabledTokens = []
    const { tokensEnabled } = this.props.guiWallet
    for (let prop in tokensEnabled) {
      let tokenValues = tokensEnabled[prop]
      enabledTokens.push(tokenValues)
    }
    let sortedEnabledTokens = enabledTokens.sort((a, b) => {
      if (a.currencyCode < b.currencyCode) return -1
      if (a === b) return 0
      return 1
    })
    this.setState({
      enabledTokens: sortedEnabledTokens
    })
  }

  toggleToken = (currencyCode) => {
    let enabledTokens = []
    const { tokensEnabled } = this.props.guiWallet
    for (let prop in tokensEnabled) {
      if (prop === currencyCode) {
        tokensEnabled[prop].enabled = !tokensEnabled[prop].enabled
      }
      let tokenValues = tokensEnabled[prop]
      enabledTokens.push(tokenValues)
    }
    let sortedEnabledTokens = enabledTokens.sort((a, b) => {
      if (a.currencyCode < b.currencyCode) return -1
      if (a.currencyCode === b.currencyCode) return 0
      return 1
    })
    this.setState({
      enabledTokens: sortedEnabledTokens
    })
  }

  saveEnabledTokenList = () => {
    const { tokensEnabled, id } = this.props.guiWallet
    const walletEnabledTokens = tokensEnabled
    for (let item of this.state.enabledTokens) {
      walletEnabledTokens[item.currencyCode].enabled = item.enabled
    }
    this.props.setEnabledTokensList(id, walletEnabledTokens)
    Actions.pop()
  }

  render () {

    return (
      <View style={[styles.manageTokens]}>
        <Gradient style={styles.gradient} />
        <View style={styles.container}>
          {this.header()}
          <View style={styles.instructionalArea}>
            <Text style={styles.instructionalText}>{s.strings.managetokens_top_instructions}</Text>
          </View>
          <View style={[styles.metaTokenListArea]}>
            <View style={[styles.metaTokenListWrap]}>
              <FlatList
                data={this.state.enabledTokens}
                renderItem={(metaToken) => <ManageTokenRow metaToken={metaToken} toggleToken={this.toggleToken} />}
                style={[styles.tokenList]}
              />
            </View>
            <View style={[styles.buttonsArea]}>
              <SecondaryButton
                style={[styles.addButton]}
                text={'Add'}
                onPressFunction={this.goToAddTokenScene}
              />
              <PrimaryButton
                text={'Save'}
                style={[styles.saveButton]}
                onPressFunction={this.saveEnabledTokenList}
                processingElement={<ActivityIndicator />}
                processingFlag={this.props.manageTokensPending}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }


  header () {
    const {name} = this.props.guiWallet
    return (
      <Gradient style={[styles.headerRow]}>
        <View style={[styles.headerTextWrap]}>
          <View style={styles.leftArea}>
            <Text style={styles.headerText}>
              {name}
            </Text>
        </View>
        </View>
      </Gradient>
    )
  }

  goToAddTokenScene = () => {
    const { id } = this.props.guiWallet
    Actions.addToken({walletId: id})
  }
}

const mapStateToProps = (state: any, ownProps: any): Props => ({
  manageTokensPending: state.ui.wallets.manageTokensPending,
  guiWallet: ownProps.guiWallet

})
const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  getEnabledTokensList: (walletId: string) => dispatch(getEnabledTokens(walletId)),
  setEnabledTokensList: (walletId: string, enabledTokens: Array<GuiTokenInfo>) => dispatch(setEnabledTokens(walletId, enabledTokens))

})
export default connect(mapStateToProps, mapDispatchToProps)(ManageTokens)