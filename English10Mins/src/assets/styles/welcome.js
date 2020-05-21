
import { StyleSheet } from 'react-native'

const yellow="#5b369f"
const purple="#f8ee53"

export default  StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainClass: {
    flex: 15,
    flexDirection: 'row'
  },
  topRight: {
    flex: 8,
    backgroundColor: purple
  },
  topMiddle: {
    flex: 1
  },
  topLeft: {
    flex: 8,
    backgroundColor: yellow
  },
  bottomRight: {
    flex: 8,
    backgroundColor: yellow
  },
  bottomMiddle: {
    flex: 1
  },
  bottomLeft: {
    flex: 8,
    backgroundColor: purple,
    alignItems:'flex-end',
    justifyContent:'flex-end'
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 100,
    height: 70,
    zIndex: 10,
    marginTop: -40,
  },
})