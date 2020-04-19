
import { StyleSheet } from 'react-native'

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
    backgroundColor: '#ffa200'
  },
  topMiddle: {
    flex: 1
  },
  topLeft: {
    flex: 8,
    backgroundColor: '#ff3a00'
  },
  bottomRight: {
    flex: 8,
    backgroundColor: '#ff3a00'
  },
  bottomMiddle: {
    flex: 1
  },
  bottomLeft: {
    flex: 8,
    backgroundColor: '#ffa200'
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