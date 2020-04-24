import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  mainSection: {
    flex: 1,
    flexDirection: 'row',
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  next: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  preve: {
    position: 'absolute',
    top: 10,
    right: 50,
    zIndex: 10,
    width: 40,
    height: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  playerMainSection: {
    display: 'flex',
    flexDirection: 'row',
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
    flexDirection: 'row'
  },
  playerSliderText: {
    fontSize: 20
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
    flex: 2,
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
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bodyTarget: {
    minHeight: 200
  },
  htmlView:{
    minHeight:200,
    padding:10,
    lineHeight:10,
    fontSize:15
  }
})