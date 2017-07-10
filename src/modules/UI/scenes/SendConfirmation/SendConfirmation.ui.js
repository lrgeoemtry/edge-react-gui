import React, { Component } from 'react'
import {
  View,
  Share,
  Text,
  TouchableHighlight,
  Keyboard,
  Button,
  Platform,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import styles from './styles.js'
import ExchangeRate from '../../components/ExchangeRate/index.js'
import MaxButton from '../../components/MaxButton/index.js'
import FlipInput from '../../components/FlipInput/index.js'
import Password from './SendConfirmationPasswordSample.js'

import ABQRCode from '../../components/QRCode/index.js'
import RequestStatus from '../../components/RequestStatus/index.js'
import ShareButtons from '../../components/ShareButtons/index.js'

import Recipient from '../../components/Recipient/index.js'
import ABSlider from '../../components/Slider/index.js'
import Fees from '../../components/Fees/index.js'

import { getCryptoFromFiat, getFiatFromCrypto, sanitizeInput, border as b } from '../../../utils.js'
import LinearGradient from 'react-native-linear-gradient'

import {
  updateAmountSatoshiRequest,
  updateAmountFiat,
  updateFiatPerCrypto,
  updateInputCurrencySelected,
  updateLabel,
  updateMaxSatoshiRequest,
  updateDraftStatus,
  updateIsKeyboardVisible,
  signBroadcastAndSave,
  useMaxSatoshi,
} from './action.js'

class SendConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardVisible: false
    }
  }

  _onFocus = () => {
    this.setState({keyboardVisible: true})
  }

  _onBlur = () => {
    this.setState({keyboardVisible: false})    
  }

  render () {
    const {
      amountSatoshi,
      amountFiat,
      draftStatus,
      label,
      isSliderLocked,
     } = this.props.sendConfirmation


    return (
      <LinearGradient
        style={[styles.view, b()]}
        start={{x:0,y:0}} end={{x:1, y:0}}
        colors={["#3b7adb","#2b569a"]}
      >
        <ScrollView style={[styles.mainScrollView]}>
          <View style={[styles.exchangeRateContainer, b()]} >
            <ExchangeRate mode={draftStatus} fiatPerCrypto={this.props.fiatPerCrypto} fiatCurrencyCode={this.props.fiatCurrencyCode} cryptoDenom={this.props.inputCurrencyDenom}  />
          </View>

          <View style={[styles.main, b(), {flex: this.state.keyboardVisible ? 0 : 1}]}>
            <FlipInput
              mode={draftStatus}
              onInputCurrencyToggle={this.onInputCurrencyToggle}
              onCryptoInputChange={this.onCryptoInputChange}
              onFiatInputChange={this.onFiatInputChange}
              amountSatoshi={this.props.amountSatoshi || 0}
              amountFiat={this.getAmountFiat(this.props.amountSatoshi)}
              inputCurrencySelected={this.props.inputCurrencySelected}
              maxAvailableToSpendInCrypto={this.props.getMaxSatoshi}
              displayFees
              feeInCrypto={this.props.feeSatoshi}
              feeInFiat={this.getFeeInFiat(this.props.feeSatoshi)}
              cryptoDenom={this.props.inputCurrencyDenom}
              fiatCurrencyCode={this.props.fiatCurrencyCode}   
              inputOnFocus={this._onFocus}
              inputOnBlur={this._onBlur}          
            />
            {/* <Recipient label={label} address={publicAddress} /> */}
            <Recipient label={'Ashley Rind'} address={this.props.recipientPublicAddress} />
            {/* <Password /> */}
          </View>

          <ABSlider style={[b()]} onSlidingComplete={this.signBroadcastAndSave} sliderDisabled={!isSliderLocked} />
        </ScrollView>
      </LinearGradient>
    )
  }

  signBroadcastAndSave = () => {
    const { transaction } = this.props
    this.props.signBroadcastAndSave(transaction)
  }

  getTopSpacer = () => {
    if (this.props.sendConfirmation.keyboardIsVisible) {
      return
    } else {
      return <View style={styles.spacer} />
    }
  }

  getBottomSpacer = () => {
    if (!this.props.sendConfirmation.keyboardIsVisible) {
      return
    } else {
      return <View style={styles.spacer} />
    }
  }

  onMaxPress = () => {
    this.props.useMaxSatoshi()
  }

  getDraftStatus = (amountSatoshi, maxSatoshi) => {
    let draftStatus

    if ( amountSatoshi > maxSatoshi ) {
      draftStatus = 'over'
    } else if ( amountSatoshi == maxSatoshi ) {
      draftStatus = 'max'
    } else {
      draftStatus = 'under'
    }

    return draftStatus
  }

  onInputCurrencyToggle = () => {
    console.log('SendConfirmation->onInputCurrencyToggle called')
    const { inputCurrencySelected } = this.props
    const nextInputCurrencySelected =
      inputCurrencySelected === 'crypto'
        ? 'fiat'
        : 'crypto'

      this.props.dispatch(updateInputCurrencySelected(nextInputCurrencySelected))
  }

  onCryptoInputChange = amountSatoshi => {
    this.props.updateAmountSatoshi(parseInt(amountSatoshi))
  }

  onFiatInputChange = (amountFiat) => {
    const amountSatoshi = getCryptoFromFiat(amountFiat, this.props.fiatPerCrypto)
    this.props.updateAmountSatoshi(amountSatoshi)
  }

  getFeeInFiat = feeSatoshi => {
    const { fiatPerCrypto = 1077.75 } = this.props
    const feeFiat = getFiatFromCrypto(feeSatoshi, fiatPerCrypto)

    return feeFiat
  }

  getAmountFiat = amountSatoshi => {
    const { fiatPerCrypto = 1077.75 } = this.props
    const amountFiat = getFiatFromCrypto(amountSatoshi, fiatPerCrypto)

    return amountFiat
  }
}

const mapStateToProps = state => {
  return {
    sendConfirmation:      state.ui.scenes.sendConfirmation,
    amountSatoshi:         state.ui.scenes.sendConfirmation.amountSatoshi,
    feeSatoshi:            state.ui.scenes.sendConfirmation.feeSatoshi,
    fiatPerCrypto:         state.ui.scenes.sendConfirmation.fiatPerCrypto,
    inputCurrencySelected: state.ui.scenes.sendConfirmation.inputCurrencySelected,
    //publicAddress:         state.ui.scenes.sendConfirmation.publicAddress,
    spendInfo:             state.ui.scenes.sendConfirmation.spendInfo,
    transaction:           state.ui.scenes.sendConfirmation.transaction,
    inputCurrencyDenom: state.ui.wallets.byId[state.ui.wallets.selectedWalletId].denominations[state.ui.settings[state.ui.wallets.byId[state.ui.wallets.selectedWalletId].currencyCode].denomination -1]  ,
    fiatCurrencyCode: state.core.wallets.byId[state.ui.wallets.selectedWalletId].fiatCurrencyCode    
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateAmountSatoshi: amountSatoshi => dispatch(updateAmountSatoshiRequest(amountSatoshi)),
    updateAmountFiat:       amountFiat => dispatch(updateAmountFiatRequest(amountFiat)),
    toggleCurrencyInput:            () => dispatch(toggleCurrencyInput()),
    signBroadcastAndSave:  transaction => dispatch(signBroadcastAndSave(transaction)),
    updateMaxSatoshi:               () => dispatch(updateMaxSatoshiRequest()),
    useMaxSatoshi:                  () => dispatch(useMaxSatoshi()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SendConfirmation)
