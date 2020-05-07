import { StyleSheet,NativeModules } from 'react-native'

const locale = NativeModules.I18nManager.localeIdentifier

let direction = 'row'

if (locale == 'fa_IR')
  direction = 'row-reverse'

export default StyleSheet.create({
  mainSection: {
    flex: 1,
    flexDirection:'row'
  },
  logoSection:{
      flex:10,
      backgroundColor:'green',
      justifyContent:'center',
      alignItems:'center'
  },
  searchSecton:{
      flex:2,
      backgroundColor:'gray'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    height: 250,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  imageContainer: {
    height: 180,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  textContainer: {
    height: 60,
    padding: 5,
    overflow:'hidden'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    overflow: 'hidden',
  }
})