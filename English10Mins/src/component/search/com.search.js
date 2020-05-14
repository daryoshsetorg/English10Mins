import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, NativeModules, Animated } from 'react-native'
import Styles from '../../assets/styles/search'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { InfoStyle, ErrorStyle } from '../../assets/styles/toast'
import Toast from 'react-native-root-toast'
import Spinner from 'react-native-loading-spinner-overlay';
import { searchLessons } from '../../assets/api/api'

const locale = NativeModules.I18nManager.localeIdentifier

function Search(props) {

  const [loadingMore, setLoadingMore] = useState(false);
  const [loadEnd, setLoadEnd] = useState(true);
  const [typed, setTyped] = useState(false);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);

  let searchedText = '';

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

  function fetchData() {
    let params = { Title: searchedText, PageIndex: pageIndex }
    searchLessons(params).then((res) => {
      setData(data.concat(res));
      setLoadEnd(true);
    }).catch(() => {
      Toast.show('faild to load data', ErrorStyle);
      setLoadEnd(true);
    })
  }

  handleLoadMore = () => {
    var index = pageIndex + 1;
    setPageIndex(index);
    setLoadingMore(true);
    fetchData();
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
        // onEndReachedThreshold={0.5}
        // onEndReached={handleLoadMore}
        // ListFooterComponent={_renderFooter}
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
        {renderFlat()}
      </View>
    </View>
  )
}

Search.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

export default Search;