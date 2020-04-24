import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Slider, Animated } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-ionicons'
import Sound from 'react-native-sound'
import RNFS from 'react-native-fs'
import Styles from '../../assets/styles/lesson'
import Toast from 'react-native-root-toast';
import { ErrorStyle, SuccessStyle, infoStyle } from '../../assets/styles/toast'
import HTMLView from 'react-native-htmlview';

function Lesson(props) {
  console.log(props.navigation.state.params.Id)

  Sound.setCategory('Playback');
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(3);
  const [isPlay, setIsPlay] = useState(false);
  const [whoosh, setWhoosh] = useState(new Sound(require('../../assets/music/a.mp3'), Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('error')
      return;
    }
  }));

  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        useNativeDriver: true
      }
    ).start();

    let tt = whoosh.getDuration();
    setDuration(tt);
  }, []);

  var timeInterVal = setInterval(() => {
    whoosh.getCurrentTime((seconds) => {
      setCurrent(seconds);
    })
  }, 5000);
  clearInterval(timeInterVal);
  timeInterVal = null;

  function backToList() {
    setTitle("")
    setShowTitle(false);
    whoosh.stop();
    whoosh.release();
    props.navigation.goBack();
  }

  function fetchData() {

  }

  function showTitles(title) {
    setShowTitle(true);
    setTitle(title)
  }

  function hideTitle() {
    setTitle('')
    setShowTitle(false);
  }

  function handleDownload() {
    const fileName = 'header_logo.png'
    console.log(fileName)
    if (RNFS.existsRes(`${RNFS.DownloadDirectoryPath}/${fileName}`)) {
      console.log('file exist')
      Toast.show(`file exists in ${RNFS.DownloadDirectoryPath}/${fileName}`, ErrorStyle
      );
    }
    else {
      RNFS.downloadFile({
        fromUrl: `https://facebook.github.io/react-native/img/${fileName}`,
        toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
        progress: (v) => { _downloadFileProgress(v) }
        , progressDivider: 1
      })
    }

  }

  function _downloadFileProgress(data) {
    console.log('download progress')
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    const text = `Progress ${percentage}%`;
    console.log(text);
    if (percentage == 100) {
      Toast.show('download done!', SuccessStyle)
    }
    else {
      _downloadFileProgress(data);
    }
  }

  function handlePlay() {
    clearInterval(timeInterVal);
    timeInterVal = null;

    timeInterVal = setInterval(() => {
      whoosh.getCurrentTime((seconds) => {
        setCurrent(seconds);
      })
    }, 5000);

    setIsPlay(true);

    whoosh.play((success) => {
      if (!success) {
        Toast.show('cant play song', ErrorStyle)
      }
      else {

      }
    })
  }

  function handlePause() {
    whoosh.pause();
    setIsPlay(false);
  }

  function handleStop() {
    whoosh.stop();
  }

  function handleRepeat() {
    whoosh.setNumberOfLoops(-1)
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
        <TouchableOpacity>
          <Icon android="repeat" size={30}
            color="#fff" />
        </TouchableOpacity>

      </View>
      <View style={Styles.playerOprationLike}>
        <TouchableOpacity>
          <Icon android="heart" size={25}
            color="#fff" />
        </TouchableOpacity>

      </View>
      <View style={Styles.playerOprationDownload}>
        <TouchableOpacity onPress={() => { handleDownload() }}>
          <Icon android="download" size={25}
            color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  function smallPlayer(){
    let playButton = <TouchableOpacity onPress={() => { handlePlay() }}>
      <Icon android="play" size={40}  color="#fff" />
    </TouchableOpacity>

    if (isPlay) {
      playButton = <TouchableOpacity onPress={() => { handlePause() }}>
        <Icon android="pause" size={40} color="#fff" />
      </TouchableOpacity>
    }

    return (<View style={Styles.playerMainSection}>
      <View style={Styles.playerButton}>

        {playButton}

      </View>
    </View>
    )
  }

  function fixedTop() {
    if (showTitle)
      return (
        <View>
          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
            <Icon android="arrow-back-circle-sharp" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{marginTop:40}}>
          {smallPlayer()}
          </View>
        </View>
      )
    else
      return (
        <View>
          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
            <Icon android="arrow-back-circle-sharp" size={30}
              color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.next}>
            <Text style={{color:"#fff"}}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.preve}>
            <Text style={{color:"#fff"}}>Preve</Text>
          </TouchableOpacity>
        </View>
      )
  }

  let imageUrl = require('../../assets/images/logo.jpg');
  let htmlContent = '<div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div><div><p><a href="#">testttt</a></p></div><div><h1>asdfasdf asdfasdf sadfasdfdg sadfasdf asdfasdf asdfasdf asdfasdf </h1></div>'
  return (
    <HeaderImageScrollView
      maxHeight={200}
      minHeight={80}
      headerImage={imageUrl}
      maxOverlayOpacity={0.5}
      foregroundParallaxRatio={3}
      renderFixedForeground={() => (fixedTop())}
    >
      <TriggeringView onBeginHidden={() => { showTitles('test') }}
        onDisplay={() => { hideTitle() }}>
      </TriggeringView>

      <View style={Styles.bodyTarget}>

        {player()}

        <View style={Styles.title}>
          <Text style={Styles.titleText}>asdfasdf  asdfasdf asdfasdf </Text>
        </View>

        <View style={Styles.htmlView}>
          <HTMLView value={htmlContent} />
        </View>

      </View>

    </ HeaderImageScrollView>
  );
}

Lesson.navigationOptions = () => ({
  headerShown: false
});

export default Lesson;