import React from 'react';
import {View,Text} from 'react-native'

import Styles from '../../assets/styles/header'
export default function Header(){
  return (
<View style={Styles.mainSection}>
    <View style={Styles.logoSection}>
      <Text>English Lessons</Text>
    </View>
    <View style={Styles.searchSecton}></View>
</View>
  )
}