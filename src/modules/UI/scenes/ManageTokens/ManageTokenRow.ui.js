import React, {Component} from 'react'
import {
  View,
  TouchableHighlight
} from 'react-native'
import Text from '../../components/FormattedText'
import CheckBox from '../../components/CheckBox'
import {connect} from 'react-redux'
import * as CORE_SELECTORS from '../../../Core/selectors.js'
import styles from './style.js'
import * as UTILS from '../../../utils.js'

class ManageTokenRow extends Component {
  constructor (props) {
    super(props)
    this.state = {
      enabled: props.enabled
    }
  }

  render () {
    const { item } = this.props.metaToken
    return (
      <TouchableHighlight
        style={[styles.manageTokenRow, UTILS.border()]}
        onPress={() => this.props.toggleToken(item.currencyCode)}
      >
        <View style={[styles.manageTokenRowInterior, UTILS.border()]}>
          <View style={[styles.tokenNameArea, UTILS.border()]}>
            <Text style={[styles.tokenNameText, UTILS.border()]}>{item.currencyName} ({item.currencyCode})</Text>
          </View>
          <CheckBox enabled={true} />
        </View>
      </TouchableHighlight>
    )
  }
}


const mapStateToProps = (state) => ({
  context: CORE_SELECTORS.getContext(state),
  account: CORE_SELECTORS.getAccount(state)
})
const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageTokenRow)