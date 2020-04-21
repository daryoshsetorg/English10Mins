import React, { useEffect, useState } from 'react';
import { View, Text, ToastAndroid, TouchableOpacity, Slider } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-ionicons'
import Sound from 'react-native-sound'

import Styles from '../../assets/styles/lesson'

function Lesson(props) {

  Sound.setCategory('Playback');
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(3);
  const [isPlay, setIsPlay] = useState(false);
  const [whoosh, setWhoosh] = useState(new Sound(require('../../assets/music/a.mp3'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      ToastAndroid.showWithGravity("failed to load the sound,call manager", ToastAndroid.LONG, ToastAndroid.CENTER)
      return;
    }
  }));

  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);

  function backToList() {
    setTitle("")
    setShowTitle(false);
    whoosh.stop();
    whoosh.release();
    props.navigation.goBack();
  }

  function showTitles(title) {
    setShowTitle(true);
    setTitle(title)
  }

  function hideTitle() {
    setTitle('')
    setShowTitle(false);
  }

  useEffect(() => {
    let tt = whoosh.getDuration();
    setDuration(tt);
  })


  var timeInterVal = setInterval(() => {
    whoosh.getCurrentTime((seconds) => {
      setCurrent(seconds);
    })
  }, 5000);
  clearInterval(timeInterVal);
  timeInterVal = null;

  function handlePlay() {

    clearInterval(timeInterVal);
    timeInterVal = null;
    timeInterVal = setInterval(() => {
      whoosh.getCurrentTime((seconds) => {
        setCurrent(seconds);
      })
    }, 5000);

    whoosh.play((success) => {
      if (!success) {
        console.log('cant play')
      }
      else {
        setIsPlay(true);
      }
    })
  }

  function handlePause() {
    console.log('pause')
    whoosh.pause();
  }

  function handleStop() {
    console.log('stop')
    whoosh.stop();
  }

  function handleCurrent() {
    whoosh.getCurrentTime((seconds, isPlaying) => {
      console.log(seconds)
      setCurrent(seconds);
    })
  }

  function handleDuration() {
    let tt = whoosh.getDuration();
    setDuration(tt);
  }

  function handleSetCurrent(time) {
    whoosh.setCurrentTime(time);
    setCurrent(time);
  }

  function player() {
    let playButton = <TouchableOpacity onPress={() => { handlePlay() }}>
      <Icon android="play" size={20}
        color="#fff" />
    </TouchableOpacity>
    if (isPlay) {
      playButton = <TouchableOpacity onPress={() => { handlePause() }}>
        <Icon android="pause" size={20}
          color="#fff" />
      </TouchableOpacity>
    }
    return (<View style={Styles.playerMainSection}>
      <View style={Styles.playerButton}>

        {playButton}

      </View>
      <View style={Styles.playerSlider}>
        <View style={Styles.playerSliderCurrent}>
          <Text style={Styles.playerSliderText}>{Math.round((current / 60 + Number.EPSILON) * 100) / 100}</Text>
        </View>
        <View style={Styles.playerSliderMain}>
          <Slider
            style={{ width: '100%', height: 40 }}
            value={current}
            minimumValue={0}
            maximumValue={duration}
            onValueChange={(v) => { handleSetCurrent(v) }}
            onTouchStart={() => { handleStop() }}
            onTouchEnd={() => { handlePlay() }}
            maximumTrackTintColor="#FFFFFF"
            minimumTrackTintColor="#000000"
          />
        </View>
        <View style={Styles.playerSliderDuration}>
          <Text style={Styles.playerSliderText}>{Math.round((duration / 60 + Number.EPSILON) * 100) / 100}</Text>
        </View>

      </View>
      <View style={Styles.playerRepeat}>
        <Text>
          <Icon android="repeat" size={30}
            color="#fff" />
        </Text>

      </View>
      <View style={Styles.playerOprationLike}>
        <Text>
          <Icon android="heart" size={25}
            color="#fff" />
        </Text>

      </View>
      <View style={Styles.playerOprationDownload}>
        <Text>
          <Icon android="download" size={25}
            color="#fff" />
        </Text>
      </View>
    </View>
    )
  }

  function fixedTop() {
    if (showTitle)
      return (
        <View>
          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
            <Icon android="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 40 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{title}</Text>
          </View>
        </View>
      )
    else
      return (
        <View>
          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
            <Icon android="arrow-back-outline" size={20}
              color="#fff" />
          </TouchableOpacity>
        </View>
      )
  }

  let imageUrl = require('../../assets/images/logo.jpg');

  return (
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={80}
      headerImage={imageUrl}
      maxOverlayOpacity={0.5}
      foregroundParallaxRatio={3}
      renderFixedForeground={() => (fixedTop())}>


      <TriggeringView onBeginHidden={() => { showTitles('test') }}
        onDisplay={() => { hideTitle() }}
      >
      </TriggeringView>

      <View style={{ minHeight: 200 }}>
        {player()}

        <View>
          <Text>{}</Text>
  <Text>{}</Text>
        </View>
      </View>

    </ HeaderImageScrollView>

  );
}

Lesson.navigationOptions = () => ({
  headerShown: false
});

export default Lesson;