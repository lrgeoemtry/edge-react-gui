import {StyleSheet} from 'react-native'
import THEME from '../../../../theme/variables/airbitz'

export default StyleSheet.create({
  headerRoot: {
    zIndex: 1006
  },
  sideTextWrap: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIconStyle: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 3,
    color: THEME.COLORS.WHITE,
  },
  sideText: {
    color: THEME.COLORS.WHITE,
    fontSize: 18
  },
  icon: {
    color: THEME.COLORS.WHITE,
    fontSize: 25
  },
  default: {
    backgroundColor: THEME.COLORS.TRANSPARENT,
    color: THEME.COLORS.WHITE
  }
})
