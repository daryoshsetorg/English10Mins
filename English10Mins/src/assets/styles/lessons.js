import { StyleSheet, NativeModules, Dimensions } from 'react-native'

const locale = NativeModules.I18nManager.localeIdentifier

let direction = 'row'
let itemContainerMargin = 10;
let itemContainerHeight = 250;
let imageContainerHeight = 180;

if (locale == 'fa_IR')
  direction = 'row-reverse'

if (Dimensions.get('window').width > 500) {
  itemContainerMargin = 50;
  itemContainerHeight = 350;
  imageContainerHeight = 280;
}


export default StyleSheet.create({
  mainSection: {
    flex: 1,
    flexDirection: 'row'
  },
  logoSection: {
    flex: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchSecton: {
    flex: 2,
    backgroundColor: 'gray'
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    height: itemContainerHeight,
    marginLeft: itemContainerMargin,
    marginRight: itemContainerMargin,
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  imageContainer: {
    height: imageContainerHeight,
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
    overflow: 'hidden',
    display: 'flex',
    flexDirection: direction
  },
  titleContainer: {
    flex: 9
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  likeContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  likeCount: {
    flex: 1,
    backgroundColor: 'red'
  }
})