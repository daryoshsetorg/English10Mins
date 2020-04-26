import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,Image} from 'react-native'
import Styles from '../../assets/styles/lessons'

export default function Items(params){

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
