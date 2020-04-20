
import { StyleSheet } from 'react-native'

const perpale="#5b369f"
const yellow="#f8ee53"
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
    backgroundColor: perpale
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
    backgroundColor: perpale
  },
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 315,
    height: 200,
    zIndex: 10,
    marginTop: -40,
  },
})