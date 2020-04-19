import React,{useEffect, useState} from 'react';
import {View,Text,ToastAndroid,TouchableOpacity,Slider} from 'react-native'
import Sound from 'react-native-sound'

Sound.setCategory('Playback');

export default function Lesson(){

  const [current,setCurrent]=useState(0);
  const [duration,setDuration]=useState(2);
  let currentt=0;

  var whoosh = new Sound(require('../../assets/music/a.mp3'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      ToastAndroid.showWithGravity("failed to load the sound,call manager",ToastAndroid.LONG,ToastAndroid.CENTER)
      return;
    }
  });

  
  
  function handlePlay(){
        setDuration(whoosh.getDuration());

        setInterval(() => {
          whoosh.getCurrentTime((seconds,isPlaying) => {
          setCurrent(seconds);  
          })
        }, 5000);

    whoosh.play((success) => {
      console.log(success)
      if (!success) {
        
      }
      else{
        
      }
    })
  }
  
  function handlePause(){
    clearInterval();
    whoosh.pause();
  }

  function handleStop(){
    clearInterval();
    whoosh.stop(()=>{
      whoosh.play();
    });
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
    clearInterval();
    whoosh.stop();
    whoosh.setCurrentTime(time);
    whoosh.play();
    setInterval(() => {
      whoosh.getCurrentTime((seconds,isPlaying) => {
        setCurrent(seconds);})
    }, 5000);
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

     <TouchableOpacity onPress={()=>{handleCurrent()}}>
       <Text>getCurrent</Text>
     </TouchableOpacity>

     <TouchableOpacity onPress={()=>{handleDuration()}}>
       <Text>getAll</Text>
     </TouchableOpacity>

  <Text>current : {Math.round(current/60)}</Text>
  <Text>Total : {duration}</Text>
  <Text>Minute Time : {Math.round(duration/60)}</Text>

  <Slider
    style={{width: 200, height: 40}}
    value={current}
    minimumValue={0}
    maximumValue={duration}
    onValueChange={(v)=>{handleSetCurrent(v)}}
    onSlidingComplete={()=>{handleStop()}}
    maximumTrackTintColor="#FFFFFF"
    minimumTrackTintColor="#000000"
  />
    </View>
  );
}

