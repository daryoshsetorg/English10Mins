import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Text, FlatList, NativeModules, Animated, ActivityIndicator } from 'react-native'
import Styles from '../../assets/styles/search'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { InfoStyle, ErrorStyle } from '../../assets/styles/toast'
import Toast from 'react-native-root-toast'
import { searchLessons } from '../../assets/api/api'
import { ConnectToServer } from '../../utilities/errorsMessages'

const locale = NativeModules.I18nManager.localeIdentifier
var pageIndex = 0;
var searchedText = '';

function Search(props) {

  const [loadingMore, setLoadingMore] = useState(false);
  const [loadEnd, setLoadEnd] = useState(true);
  const [typed, setTyped] = useState(false);
  const [data, setData] = useState([]);
  const [onEndReached, setOnEndReached] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const searchRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim, { useNativeDriver: true }
    ).start();
  }, []);

  function goBack() {
    props.navigation.goBack();
  }

  function _changeText(value) {
    searchedText = value;
    if (value.length > 0) {
      if (value.length > 3) {
        setTyped(true);
        fetchData();
      }
      else {
        Toast.show('less than three character', InfoStyle)
        setNotFound(false);
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

    return (<TouchableOpacity onPress={() => { cancleButtonClick() }}>
      <Icon android={'close'}></Icon>
    </TouchableOpacity>)

  }

  function cancleButtonClick() {
    setNotFound(false);
    searchRef.current.clear();
    setData([]);
  }

  function fetchData() {
    console.log(searchedText)
    let params = { Title: searchedText, PageIndex: pageIndex }
    searchLessons(params).then((res) => {

      if (res.length == 0)
        setNotFound(true);
      else
        setNotFound(false);

      if (loadingMore)
        setData(data.concat(res));
      else
        setData(res)

      setLoadingMore(false);
      setLoadEnd(true);
    }).catch((res) => {

      Toast.show(ConnectToServer, ErrorStyle);
      setLoadEnd(true);
      setLoadingMore(false);
    })
  }

  handleLoadMore = () => {
    if (!onEndReached) {
      console.log('handle moreeeee')
      pageIndex += 1;
      setLoadingMore(true);
      fetchData();
    }
  };

  _renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View
        style={{
          position: 'relative',
          width: '100%',
          height: 100,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: '#ccc'
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  function _renderFlat() {
    let returnList = <ActivityIndicator />

    if (notFound)
      returnList = <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}><Text>Not Found</Text></View>

    if (loadEnd && !notFound) {
      returnList = <FlatList
        data={data}
        renderItem={({ item }) => Items(item)}
        keyExtractor={item => item.Id}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        onMomentumScrollBegin={() => { setOnEndReached(false) }}
        ListFooterComponent={_renderFooter}
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
          <TouchableOpacity onPress={() => { goBack() }}>
            {_backButton()}
          </TouchableOpacity>
        </View>
        <View style={Styles.headerSearchSection}>
          <TextInput
            ref={searchRef}
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
        {_renderFlat()}
      </View>
    </View>
  )
}

Search.navigationOptions = () => ({
  headerShown: false
});

export default Search;