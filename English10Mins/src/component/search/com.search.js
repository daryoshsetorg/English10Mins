import React, { useState, useRef, useEffect } from 'react';
import {SafeAreaView ,BackHandler, View, TouchableOpacity, TextInput, Text, FlatList, NativeModules, Animated, ActivityIndicator } from 'react-native'
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
  const [dontLoadMore, setDontLoadMore] = useState(false);

  const searchRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    Animated.timing(
      fadeAnim, { useNativeDriver: true }
    ).start();

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      deviceBackButton,
    );

    return () => handler.remove();
  }, []);

  function goBack() {
    props.navigation.goBack();
  }

  function deviceBackButton() {
    props.navigation.goBack();
    return true;
  }

  function _changeText(value) {
    searchedText = value;
    if (value.length > 0) {
      if (value.length > 3) {
        pageIndex = 0;
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
    let params = { Title: searchedText, PageIndex: pageIndex }
    searchLessons(params).then((res) => {

      if (res.length > 0) {
        setData(res);
        setNotFound(false)
        setDontLoadMore(false)
      }
      else {
        setNotFound(true);
        pageIndex = 0;
      }


      setLoadingMore(false);
      setLoadEnd(true);
    }).catch((res) => {

      Toast.show(ConnectToServer, ErrorStyle);
      setLoadEnd(true);
      setLoadingMore(false);
    })
  }

  function handleFetch(){
    let params = { Title: searchedText, PageIndex: pageIndex }
    searchLessons(params).then((res) => {

      if (res.length > 0) {
        setData(data.concat(res));
      }
      else{
        setDontLoadMore(true);
      }
     
      setLoadingMore(false);
      setLoadEnd(true);
    }).catch((res) => {
      Toast.show(ConnectToServer, ErrorStyle);
      setLoadEnd(true);
      setLoadingMore(false);
    })
  }

  handleLoadMore = () => {
    if (!onEndReached && !dontLoadMore) {
      pageIndex += 1;
      setLoadingMore(true);
      handleFetch();
    }
  };

  function _renderFooter() {
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
    let returnList = <ActivityIndicator animating size="large" />

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
        style={{ marginTop: 2,marginBottom:20,paddingBottom:20 }}
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
    <SafeAreaView>
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
        {_renderFlat()}
      
    </SafeAreaView>
  )
}

Search.navigationOptions = () => ({
  headerShown: false
});

export default Search;