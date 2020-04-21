import React,{useState,useEffect} from 'react';
import {View,Text,ActivityIndicator,FlatList,TouchableOpacity,Image,SafeAreaView} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import Styles from '../../assets/styles/lessons'
import Header from '../header/com.header'
import {MainImageUrl} from '../../utilities/url'
import Icon from 'react-native-ionicons'

export default function Lessons(props){

const [loading,setLoading]=useState(false);
const [loadingMore,setLoadingMore]=useState(false);
const [data,setData]=useState([]);
const [pageIndex,setPageIndex]=useState(1);
const [pageSize,setPageSize]=useState(5);
const [lesson,setLesson]=useState({});

const fakeData=[
  {
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
},
{
  Id:4,
  Title:'test02',
  ImgUrl:'0'
},
{
  Id:5,
  Title:'test02',
  ImgUrl:'0'
},
{
  Id:6,
  Title:'test02',
  ImgUrl:'0'
},
{
  Id:7,
  Title:'test02',
  ImgUrl:'0'
}
];

fetchData = () => {
  // props.GetArticles(state.Filter).then(() => {
  //   var a = state.data;
  //   var b = props.ArticlesData;
  //   state.data.push.apply(a, b);
  //   setLoading(false);
  // });
  setData(fakeData);
}

useEffect(() => {
  fetchData();
},[]);

  sendData = (id) => {
    let filterLesson = data.filter((less) => {
      return less.ID === id
    })

    setLesson(filterLesson[0]);
    props.navigation.navigate("Lesson", lesson);
  }

  _handleLoadMore = () => {
    var index = pageIndex + 1;
    setPageIndex(index);
    setLoadingMore(true);
    fetchData();
  };

  Items=(params)=> {
    let imageUrl;
    // if (params.ImgUrl != null)
    //   imageUrl = { uri: MainImageUrl + params.ImgUrl }
    // else
      imageUrl = require('../../assets/images/noImage.png');

    return (
      <View style={Styles.mainContainer}>
        <View style={Styles.itemContainer}>
          <TouchableOpacity onPress={() => {
            sendData(params.ID)
          }} style={Styles.imageContainer}>
            <Image resizeMode='cover' style={Styles.image}  source={imageUrl} />
          </TouchableOpacity>
          <View style={Styles.textContainer}>
              <TouchableOpacity>
                <Text style={Styles.title}>
                  {params.Title}
                </Text>
              </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

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

beforRender=()=> {
    let render = <View >
      <Spinner
        visible={true}
        textContent={'درحال دریافت..'}
        textStyle={{ color: '#fff' }}
      />
    </View>
    if (!loading)
      render = 
        <FlatList
          data={data}
          renderItem={({ item }) => Items(item)}
          keyExtractor={item => item.ID}
          onEndReachedThreshold={0.5}
          onEndReached={_handleLoadMore}
          ListFooterComponent={_renderFooter}
         // ListHeaderComponent={Header}
         style={{marginTop:10}}
        />
    return render;
  }

  Lessons.navigationOptions = ({ navigation }) => ({
    headerLeft:()=> null,
      title:'English10Mins',
      headerTitleStyle: {
        textAlign: "left",
        fontSize: 24
      },
     
      headerRightContainerStyle: {
        paddingRight: 10
      },
      headerRight: (
        <TouchableOpacity onPress={() => props.navigation.navigate("Search")}>
           <Icon name="search"  left={20} /> 
        </TouchableOpacity>
      )
  });

  return (
<SafeAreaView>
    {beforRender()}
</SafeAreaView>
  )
}