import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native'

import Styles from '../../assets/styles/search'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import {InfoStyle} from '../../assets/styles/toast'
import Toast from 'react-native-root-toast'

function Search(props) {

  const [typed, setTyped] = useState(false);
  const searchRef = useRef(null);
  const [data,setData]=useState([]);

  function _goBack() {
    props.navigation.goBack();
  }

  function _changeText(value) {
    if (value.length > 0) {
      if(value.length>3)
      {
        setTyped(true);
        _getData();
      }
      else{
        Toast.show('less than three',InfoStyle)
      }
      
    }
    else {
      setTyped(false);
      setData([]);
    }

  }

  function _cancleButton() {
    if (typed) {
      return (<TouchableOpacity onPress={() => { _cancleButtonClick() }}>
        <Icon android={'close'}></Icon>
      </TouchableOpacity>)
    }
    else {
      return (<></>)
    }
  }

  function _cancleButtonClick(){
    searchRef.current.clear();
    setData([]);
  }

  function _getData(){

    
    setData([{
      Id:0,
      Title:'test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01test01',
      ImgUrl:'0'
    },
    {
      Id:1,
      Title:'test02',
      ImgUrl:'0'
    },
    {
      Id:2,
      Title:'test02',
      ImgUrl:'0'
    },
    {
      Id:3,
      Title:'test02',
      ImgUrl:'0'
    }])
  }

  return (
    <View>
      <View style={Styles.heaerMainSectin}>
        <View style={Styles.headerBackSection}>
          <TouchableOpacity onPress={() => { _goBack() }}>
            <Icon android={'arrow-back-circle-sharp'}></Icon>
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
        <FlatList
          data={data}
          renderItem={({ item }) => Items(item)}
          keyExtractor={item => item.ID}
          style={{ marginTop: 10 }}
        />
      </View>
    </View>
  )
}

Search.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

export default Search;