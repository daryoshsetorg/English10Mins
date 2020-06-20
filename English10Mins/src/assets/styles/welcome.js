import { StyleSheet } from 'react-native'

const yellow="#5b369f"
const purple="#f8ee53"

export default  StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#f35f19'
  },
  mainClass: {
    flex: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArea:{
    flex:1,
    flexDirection:'row'
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
    width: 50,
    height: 35,
    zIndex: 10,
    marginTop: -40,
  },
  mainText:{
    color:'white',
    fontSize:16
  },
  mainTextBold:{
    color:'white',
    fontWeight:'bold',
    fontSize:26
  }
})