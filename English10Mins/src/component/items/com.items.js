import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import Styles from '../../assets/styles/lessons'
import { MainImageUrl } from '../../utilities/url'
import Icon from 'react-native-ionicons'

export default function Items(params) {

  let imageUrl = { uri: MainImageUrl + "/" + params.Id + '.jpg' + '?random_number=' + new Date().getTime() }

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.itemContainer}>
        <TouchableOpacity onPress={() => {
          sendData(params.Id)
        }} style={Styles.imageContainer}>
          <Image resizeMode='stretch' style={Styles.image} source={imageUrl} />
        </TouchableOpacity >
        <View style={Styles.textContainer}>
          <View style={Styles.titleContainer}>
            <TouchableOpacity onPress={() => {
              sendData(params.Id)
            }}>
              <Text style={Styles.title}>
                {params.Title}
              </Text>

            </TouchableOpacity>
          </View>
          <View style={Styles.likeContainer}>
            <Icon android="heart" color="red" size={25} />
            <Text>

              {params.LikeCount}
            </Text>
          </View>

        </View>

      </View>
    </View>
  )
}
