import React,{useEffect, useState} from 'react';
import {View,Text,ToastAndroid,TouchableOpacity,Slider} from 'react-native'
import Sound from 'react-native-sound'

Sound.setCategory('Playback');

export default function Lesson(){

  const [current,setCurrent]=useState(0);
  const [duration,setDuration]=useState(3);
  const [whoosh,setWhoosh]=useState(new Sound(require('../../assets/music/a.mp3'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      ToastAndroid.showWithGravity("failed to load the sound,call manager",ToastAndroid.LONG,ToastAndroid.CENTER)
      return;
    }
  }));


  useEffect(()=>{
    whoosh.play();
    let tt= whoosh.getDuration();
    setDuration(tt);
  })
  

  var timeInterVal =  setInterval(() => {
    whoosh.getCurrentTime((seconds) => {
    setCurrent(seconds);  
    })
  }, 5000);
  clearInterval(timeInterVal);
  timeInterVal=null;
  
  function handlePlay(){
        
    clearInterval(timeInterVal);
        timeInterVal=null;
        timeInterVal =  setInterval(() => {
          whoosh.getCurrentTime((seconds) => {
          setCurrent(seconds);  
          })
        }, 5000);

    whoosh.play((success) => {
      if (!success) {
        console.log('cant play')
      }
      else{
        
      }
    })
  }
  
  function handlePause(){
    console.log('pause')
    whoosh.pause();
  }

  function handleStop(){
    console.log('stop')
    whoosh.stop();
  }

  function handleCurrent(){
    whoosh.getCurrentTime((seconds,isPlaying) => {
      console.log(seconds)
      setCurrent(seconds);})
  }
  
  function handleDuration(){
   let tt= whoosh.getDuration();
   setDuration(tt);
  }

  function handleSetCurrent(time){
    whoosh.setCurrentTime(time);
    setCurrent(time);
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


  <Text>current : {Math.round((current/60 + Number.EPSILON) * 100) / 100}</Text>
  <Text>Minute Time : {Math.round((duration/60 + Number.EPSILON) * 100) / 100}</Text>

  <Slider
    style={{width: 200, height: 40}}
    value={current}
    minimumValue={0}
    maximumValue={duration}
    onValueChange={(v)=>{handleSetCurrent(v)}}
    onTouchStart={()=>{handleStop()}}
    onTouchEnd={()=>{handlePlay()}}
    maximumTrackTintColor="#FFFFFF"
    minimumTrackTintColor="#000000"
  />
    </View>
  );
}

