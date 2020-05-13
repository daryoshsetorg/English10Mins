import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay'
import Icon from 'react-native-ionicons'
import Items from '../items/com.items'
import { getAll } from '../../assets/api/api'

function Lessons(props) {

  const [loadEnd, SetLoadEnd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);

  fetchData = () => {
    let params = { index: pageIndex }
    getAll(params).then((res) => {
      setData(res);
      SetLoadEnd(true);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  sendData = (id) => {
    props.navigation.navigate("Lesson", { Id: id });
  }

  _handleLoadMore = () => {
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

  beforRender = () => {
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
          onEndReached={_handleLoadMore}
          ListFooterComponent={_renderFooter}
          // ListHeaderComponent={Header}
          style={{ marginTop: 10 }}
        />
    return render;
  }

  return (
    <SafeAreaView>
      {beforRender()}
    </SafeAreaView>
  )
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

export default Lessons