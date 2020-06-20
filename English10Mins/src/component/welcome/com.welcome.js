import React, { useState, useEffect } from 'react'
import { View, Image, Animated, Text } from 'react-native'
import Styles from '../../assets/styles/welcome'
import Version from '../../../package.json'

function Welcome(props) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true
      }
    ).start();

    setTimeout(() => {
      props.navigation.navigate("Main")
    }, 2500);
  }, []);

  return (
    <View style={Styles.main}>
      <View style={Styles.mainClass}>
        <Text style={Styles.mainTextBold}>English </Text>
        <Text style={Styles.mainText}> 3 Mins Every Day</Text>
      </View>
      <View style={Styles.logoArea}>
        <Image style={Styles.logo} source={require('../../assets/images/logo.png')} />
        <Text style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>{Version.version}</Text>
      </View>
    </View >
  )
}

Welcome.navigationOptions = () => ({
  headerShown: false
});

export default Welcome;
