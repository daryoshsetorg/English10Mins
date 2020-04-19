import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Lessons from '../lesson/com.lessons'
import Lesson from '../lesson/com.lesson'
import Welcome from '../welcome/com.welcome'
import Search from '../search/com.search'

const stack = createStackNavigator({
  Main:{
    screen:Lessons,
  },
  Search:{
    screen:Search,
  },
  Lesson:{
      screen:Lesson
  },
  Welcome: {
    screen: Welcome,
    navigationOptions: {
      header: null,
    }
  },
},{
  initialRouteName:'Welcome'
});

const AppContainer = createAppContainer(stack);
export default function Main(){
  return (
    <>
           <AppContainer />
    </>
  )
}