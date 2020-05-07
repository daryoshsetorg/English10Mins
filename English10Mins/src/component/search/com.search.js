import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, NativeModules } from 'react-native'
import Styles from '../../assets/styles/search'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { InfoStyle } from '../../assets/styles/toast'
import Toast from 'react-native-root-toast'
import Spinner from 'react-native-loading-spinner-overlay';
import { searchLessons } from '../../assets/api/api'

const locale = NativeModules.I18nManager.localeIdentifier

function Search(props) {

  const [loadEnd, SetLoadEnd] = useState(true);
  const [typed, setTyped] = useState(false);
  const [data, setData] = useState([]);

  const searchRef = useRef(null);

  function _goBack() {
    props.navigation.goBack();
  }

  function _changeText(value) {

    if (value.length > 0) {
      if (value.length > 3) {
        setTyped(true);
        _getData(value);
      }
      else {
        Toast.show('less than three', InfoStyle)
      }
    }
    else {
      setTyped(false);
      setData([]);
    }

  }

  function _cancleButton() {

    if (!typed)
      return <></>

    return (<TouchableOpacity onPress={() => { _cancleButtonClick() }}>
      <Icon android={'close'}></Icon>
    </TouchableOpacity>)

  }

  function _cancleButtonClick() {
    searchRef.current.clear();
    setData([]);
  }

  function _getData(value) {

    SetLoadEnd(false);
    setData([{
      Id: 0,
      Title: 'test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01',
      ImgUrl: '0'
    },
    {
      Id: 1,
      Title: 'test02',
      ImgUrl: '0'
    },
    {
      Id: 2,
      Title: 'test02',
      ImgUrl: '0'
    },
    {
      Id: 3,
      Title: 'test02',
      ImgUrl: '0'
    }])
    SetLoadEnd(true);
  }

  function fetchData(value) {
    let params = { title: value }
    searchLessons(params).then((res) => {
      setData(res);
    })
  }

  function renderFlat() {
    let returnList = <Spinner
      visible={true}
      textContent={'Loading..'}
      textStyle={{ color: '#fff' }}
    />

    if (loadEnd) {
      returnList = <FlatList
        data={data}
        renderItem={({ item }) => Items(item)}
        keyExtractor={item => item.ID}
        style={{ marginTop: 10 }}
      />

    }

    return returnList;
  }

  function _backButton() {
    if (locale == 'fa_IR')
      return <Icon android={'arrow-forward-circle-sharp'}></Icon>
    else
      return <Icon android={'arrow-back-circle-sharp'}></Icon>
  }

  return (
    <View>
      <View style={Styles.heaerMainSectin}>
        <View style={Styles.headerBackSection}>
          <TouchableOpacity onPress={() => { _goBack() }}>
            {_backButton()}
          </TouchableOpacity>
        </View>
        <View style={Styles.headerSearchSection}>
          <TextInput
            ref={searchRef}
            onTouchStart={() => { console.log('touch') }}
            onChangeText={(val) => { _changeText(val) }}
            placeholder={'Search...'}
            style={{ width: '100%', fontSize: 20 }} />
        </View>
        <View style={Styles.headerSearchCancle}>
          {_cancleButton()}
        </View>
      </View>
      <View style={Styles.searchBody}>

      </View>
      <View>
        {renderFlat()}
      </View>
    </View>
  )
}

Search.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

export default Search;