import React, { useState, useEffect } from 'react';
import { BackHandler, View, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { getAll } from '../../assets/api/api'
import Toast from 'react-native-root-toast';
import { ErrorStyle } from '../../assets/styles/toast';
import { ConnectToServer } from '../../utilities/errorsMessages'

var pageIndex = 0;
var exitApp = 0;

function Lessons(props) {

  const [loadEnd, setLoadEnd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [dontLoadMore, setDontLoadMore] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);

  useEffect(() => {
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      deviceBackButton,
    );
    fetchData();

    return () => handler.remove();
  }, []);

 function fetchData() {
    let params = { index: pageIndex }
    getAll(params).then((res) => {
      if (res.length > 0) {
        setData(data.concat(res));
        setLoadEnd(true);
        setLoadingMore(false);
        //exitApp = 0;
      }
      else {
        setDontLoadMore(true);
        setLoadingMore(false);
      }

    }).catch(() => {
      Toast.show(ConnectToServer, ErrorStyle);
      setLoadEnd(true);
      setDontLoadMore(true);
    });
  }

  function refreshData(){
    pageIndex=0;
    setData([])
    fetchData();
  }
  function deviceBackButton() {
    // if (exitApp == 0) {
    //   exitApp = 1;
    //   Toast.show("Press Back Again To Exit", ErrorStyle);
    // }
    // else
      BackHandler.exitApp();

    return true;
  }

  sendData = (id) => {
    props.navigation.navigate("Lesson", { Id: id });
  }

  function handleLoadMore() {
    if (!dontLoadMore && !onEndReached) {
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

  _beforRender = () => {
    let render =
      <Spinner
        visible={true}
        textContent={'Loading..'}
        textStyle={{ color: '#fff' }}
      />

    if (loadEnd)
      render =
        <FlatList
          refreshing={!loadEnd}
          onRefresh={() => { refreshData() }}
          data={data}
          renderItem={({ item }) => Items(item)}
          keyExtractor={item => item.Id}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => { setOnEndReached(false) }}
          onEndReached={handleLoadMore}
          ListFooterComponent={_renderFooter}
          // ListHeaderComponent={Header}
          style={{ marginTop: 10 }}
        />
    return render;
  }

  Lessons.navigationOptions = () => ({
    headerStyle: {
      backgroundColor: '#f35f19',
    },
    headerLeft: () => null,
    title: 'Alvin',
    headerTitleStyle: {
      textAlign: "left",
      fontSize: 24,
      color: 'white'
    },

    headerRightContainerStyle: {
      paddingRight: 10
    },
    headerRight: (
      <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => props.navigation.navigate("Search")}>
        <Icon name="search" color={'white'} left={20} />
      </TouchableOpacity>
    )

  });

  return (
    <SafeAreaView>
      {_beforRender()}
    </SafeAreaView>
  )

}

export default Lessons