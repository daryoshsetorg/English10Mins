import { StyleSheet, NativeModules } from 'react-native'

const locale = NativeModules.I18nManager.localeIdentifier

let direction = 'row'

if (locale == 'fa_IR')
  direction = 'row-reverse'


export default StyleSheet.create({
  mainSection: {
    flex: 1,
    flexDirection: 'row-reverse',
    zIndex: 1000,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    backgroundColor: '#000',
    borderTopEndRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomEndRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  next: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 50,
    height: 30,
    backgroundColor: 'red',
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  preve: {
    position: 'absolute',
    top: 10,
    right: 70,
    zIndex: 10,
    width: 50,
    height: 30,
    backgroundColor: 'red',
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerMainSection: {
    display: 'flex',
    flexDirection: direction,
    height: 40,
    backgroundColor: 'red',
    width: '100%',
  }
  ,
  playerButton: {
    flex: 1,
    backgroundColor: '#5b369f',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playerSlider: {
    flex: 4,
    backgroundColor: 'gray',
    flexDirection: direction
  },
  playerSliderText: {
    fontSize: 12
  },
  playerSliderCurrent: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }
  , playerSliderMain: {
    flex: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerSliderDuration: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerRepeat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  playerOprationLike: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  }
  , playerOprationDownload: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  title: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  bodyTarget: {
    minHeight: 200
  },
  htmlView: {
    minHeight: 200,
    padding: 20,
    lineHeight: 10,
    fontSize: 15
  }
})