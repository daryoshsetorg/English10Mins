import React, { Component, useState, useEffect } from 'react'
import { View, Image, Animated } from 'react-native'
import Styles from '../../assets/styles/welcome'
import { createStackNavigator } from 'react-navigation-stack';

function Welcome(props) {
    const[fadeAnim,setFadeAnim]=useState(new Animated.Value(0));

    useEffect(()=>{
        Animated.timing(
            fadeAnim,
            {
              toValue: 1,
              duration: 2500,
            }
          ).start();
          setTimeout(() => {
            props.navigation.navigate("Main")
          }, 2500);
    },[])
  


    return (
      <View style={Styles.main}>
        <View style={Styles.mainClass}>
          <View style={Styles.topRight}></View>
          <View style={Styles.topMiddle}></View>
          <View style={Styles.topLeft}></View>
        </View>
        <View style={Styles.logoArea}>
          <Animated.View style={{ opacity: fadeAnim, zIndex: 10 }}>
            <Image style={Styles.logo} source={require('../../assets/images/logo.jpg')} />
          </Animated.View>
        </View>
        <View style={Styles.mainClass}>
          <View style={Styles.bottomRight}></View>
          <View style={Styles.bottomMiddle}></View>
          <View style={Styles.bottomLeft}></View>
        </View>
      </View >
    )
}

Welcome.navigationOptions = ({ navigation }) => ({
  header:null 
});
export default Welcome;