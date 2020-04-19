import React,{useEffect, useState} from 'react';
import {View,Text,ToastAndroid,TouchableOpacity,Slider} from 'react-native'
import Sound from 'react-native-sound'

Sound.setCategory('Playback');


export default function Lesson(){
  const [current,setCurrent]=useState(0);

  var whoosh = new Sound(require('../../assets/music/a.mp3'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      ToastAndroid.showWithGravity("failed to load the sound,call manager",ToastAndroid.LONG,ToastAndroid.CENTER)
      console.log('failed to load the sound1', error);
      return;
    }
  });
  
  function handlePlay(){
    whoosh.play((success) => {
      if (!success) {
       
        console.log('Sound did not play')
      }
    })
  }
  
  function handlePause(){
    whoosh.pause((success) => {
      if (!success) {
        console.log('Sound did not play')
      }
    })
  }

  function handleStop(){
    whoosh.stop((success) => {
      if (!success) {
        console.log('Sound did not play')
      }
    })
  }
  
  function handleDuration(){
    whoosh.getCurrentTime((seconds,isPlay) => {
      console.log(seconds)
      console.log(isPlay)
      setCurrent(seconds);})
  }
  

  return (
    <View >
     <TouchableOpacity onPress={()=>{handlePlay()}}>
       <Text>play</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={()=>{handlePause()}}>
       <Text>pause</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={()=>{handleStop()}}>
       <Text>stop</Text>
     </TouchableOpacity>

  <Text>duration : {handleDuration()}</Text>

  <Slider
    style={{width: 200, height: 40}}
    minimumValue={0}
    maximumValue={200}
    maximumTrackTintColor="#FFFFFF"
    minimumTrackTintColor="#000000"
  />
    </View>
  );
}

