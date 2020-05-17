import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, SafeAreaView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { getAll } from '../../assets/api/api'
import Toast from 'react-native-root-toast';
import { ErrorStyle } from '../../assets/styles/toast';
import { ConnectToServer } from '../../utilities/errorsMessages'

var pageIndex = 0;

function Lessons(props) {

  const [loadEnd, setLoadEnd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [dontLoadMore, setDontLoadMore] = useState(false);
  const [onEndReached, setOnEndReached] = useState(true);
  

  useEffect(() => {
    fetchData();
  }, []);

  fetchData = () => {
    console.log('fetch----------')
    let params = { index: pageIndex }
    getAll(params).then((res) => {
      console.log(res)
      console.log('==============================')
      if (res.length > 0) {
        setData(data.concat(res));
        console.log(data)
        setLoadEnd(true);
        setLoadingMore(false);
      }
      else {
        setDontLoadMore(true);
      }

    }).catch(() => {
      Toast.show(ConnectToServer, ErrorStyle);
      setLoadEnd(true);
      setDontLoadMore(true);
    });
  }

  sendData = (id) => {
    props.navigation.navigate("Lesson", { Id: id });
  }

  handleLoadMore = () => {
    console.log('haaaaaaaaaaandle')
    if (!dontLoadMore && !onEndReached) {
      console.log('iiiiiiiiiin handle more')
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
          data={data}
          renderItem={({ item }) => Items(item)}
          keyExtractor={item => item.ID}
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

    headerLeft: () => null,
    title: 'Alvin',
    headerTitleStyle: {
      textAlign: "left",
      fontSize: 24
    },

    headerRightContainerStyle: {
      paddingRight: 10
    },
    headerRight: (
      <TouchableOpacity onPress={() => props.navigation.navigate("Search")}>
        <Icon name="search" left={20} />
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