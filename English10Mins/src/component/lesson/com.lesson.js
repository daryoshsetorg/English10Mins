import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, AppState, BackHandler, View, Text, TouchableOpacity, Slider, Animated, NativeModules, Dimensions } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-ionicons'
import Sound from 'react-native-sound'
import RNFS from 'react-native-fs'
import Styles from '../../assets/styles/lesson'
import Toast from 'react-native-root-toast';
import { ErrorStyle } from '../../assets/styles/toast'
import HTMLView from 'react-native-htmlview';
import { MainImageUrl, MainSoundUrl } from '../../utilities/url';
import { getLesson, likeLesson } from '../../assets/api/api';
import Spinner from 'react-native-loading-spinner-overlay';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import { ConnectToServer, PlaySound, LoadSound } from '../../utilities/errorsMessages'

const locale = NativeModules.I18nManager.localeIdentifier//language
let imageScroll = 200;

function Lesson(props) {

  if (Dimensions.get('window').width > 500) {
    imageScroll = 300;
  }

  Sound.setCategory('Playback');
  const [lessonId, setLessonId] = useState(props.navigation.state.params.Id);
  const [fileName] = useState(lessonId + ".mp3");
  const [soundUrl] = useState(MainSoundUrl + "/" + fileName);
  const [imageUrl, setImageUrl] = useState({ uri: MainImageUrl + "/" + lessonId + ".jpg" + '?random_number=' + new Date().getTime() });

  const [whoosh] = useState(new Sound(soundUrl, null, (error) => {
    if (error) {
      Toast.show(LoadSound, ErrorStyle);
      return;
    }
  }));

  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isPlay, setIsPlay] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadPercentage, setDownloadPercentage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showSmallPlayer, setShowSmallPlayer] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lesson, setLesson] = useState({});
  const [loadEnd, setLoadEnd] = useState(false);
  const [fileExist, setFileExist] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);//forground or background

  let currentType = 0//for next and preve button

  useEffect(() => {
    Animated.timing(
      fadeAnim, { useNativeDriver: true }
    ).start();

    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      deviceBackButton,
    );

    //to stop sound on home button click
    AppState.addEventListener('change', handleAppStateChange)

    fetchData(lessonId);

    return () => {
      handler.remove();
      AppState.removeEventListener('change', handleAppStateChange)
    }

  }, []);

  //to stop sound on home button click
  function handleAppStateChange(nextAppState) {
    if (appState == "active" && nextAppState === 'active') {
      //App has come to the foreground!
    }
    else {
      handlePause();
    }
    setAppState(nextAppState);
  }

  function fetchData(id) {

    let params = { Id: id, Type: currentType }
    getLesson(params).then((res) => {

      console.log(res)

      if (currentType != 0)//next or prev button clicked
      {
        setLessonId(res.Id);
        currentType = 0;
        fetchData(res.Id);
      }

      //set duration of sound 
      let tt = whoosh.getDuration();
      setDuration(tt);

      setLesson(res);
      setImageUrl({ uri: MainImageUrl + "/" + id + ".jpg" + '?random_number=' + new Date().getTime() });
      setLoadEnd(true);

      if (res.Liked)
        setIsLiked(true);
      else
        setIsLiked(false)

      RNFS.exists(`${RNFS.DocumentDirectoryPath}/${fileName}`).then((exist) => {
        if (exist) {
          setFileExist(true);
        }
      });

    }).catch(() => {
      Toast.show(ConnectToServer, ErrorStyle)
      setLoadEnd(true);
    });
  }

  function deviceBackButton() {
    whoosh.stop();
    whoosh.release();
    props.navigation.goBack();
    return true;
  }

  function backToList() {
    whoosh.stop();
    whoosh.release();
    props.navigation.goBack();
  }

  function handleDownload() {

    RNFS.exists(`${RNFS.DocumentDirectoryPath}/${fileName}`).then((exist) => {
      if (exist) {
        Toast.show(`file exists in ${RNFS.DocumentDirectoryPath}/${fileName}`, ErrorStyle
        );
      }
      else {
        setIsDownloaded(true);
        setLoadEnd(false);

        RNFS.downloadFile({
          fromUrl: `${MainSoundUrl}/${fileName}`,
          toFile: `${RNFS.DocumentDirectoryPath}/${fileName}`,
          progress: (v) => { downloadFileProgress(v) }
          , progressDivider: 10
        }).promise.then(() => {
          setDownloadPercentage(100);
          setIsDownloaded(false);
          setLoadEnd(true);
          setFileExist(true);

        }).catch(() => {
          setIsDownloaded(false);
          setLoadEnd(true);
          Toast.show(ConnectToServer, ErrorStyle);
        });
      }
    })
  }

  function downloadFileProgress(data) {
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    setDownloadPercentage(percentage);
  }

  function handlePlay() {
    findTime();
    setIsPlay(true);

    //set duration of sound 
    let tt = whoosh.getDuration();
    setDuration(tt);

    whoosh.play((success) => {
      if (!success) {
        Toast.show(PlaySound, ErrorStyle)
      }
      else {
      }
    })
  }

  function findTime() {
    whoosh.getCurrentTime((seconds) => {
      setCurrent(seconds);
      if (seconds != duration)
        findTime();
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
    whoosh.setNumberOfLoops(-1);
    setIsRepeated(true);
  }

  function handleRemoveRepeat() {
    whoosh.setNumberOfLoops(0);
    setIsRepeated(false);
  }

  function handleSetCurrent(time) {
    whoosh.setCurrentTime(time);
    setCurrent(time);
  }

  function handleNext() {
    setLoadEnd(false);
    setImageUrl('');
    currentType = 1;//1 for next
    fetchData(lessonId);
  }

  function handlePreve() {
    setLoadEnd(false);
    setImageUrl('');
    currentType = -1;//-1 for preve
    fetchData(lessonId);
  }

  function handleLike() {
    let params = { Id: lessonId }
    likeLesson(params).then(() => {
      fetchData(lessonId);
    }).catch(() => {
      Toast.show(ConnectToServer, ErrorStyle);
    })
  }

  function _downloadButton() {
    let download = <TouchableOpacity onPress={() => { handleDownload() }}>
      <Icon android="download" size={25}
        color="#fff" />
    </TouchableOpacity>

    if (fileExist) {
      download = <Icon android="download" size={25}
        color="green" />
    }

    return download;
  }

  function _downlodProgress() {
    return <Spinner
      visible={true}
      cancelable={true}
      textContent={'Downloading.. ' + downloadPercentage + " %"}
      textStyle={{ color: '#fff' }}
    />
  }

  function _likeButton() {
    let like = <TouchableOpacity onPress={() => { handleLike() }}>
      <Icon android="heart" size={25}
        color="#fff" />
    </TouchableOpacity>

    if (isLiked) {
      like = <TouchableOpacity onPress={() => { handleLike() }}>
        <Icon android="heart" size={25}
          color="red" />
      </TouchableOpacity>
    }

    return like;
  }

  function _repeatButton() {
    let repeatIcon = <TouchableOpacity onPress={() => { handleRepeat() }}>
      <Icon android="repeat" size={30}
        color="#fff" /></TouchableOpacity>

    if (isRepeated)
      repeatIcon = <TouchableOpacity onPress={() => { handleRemoveRepeat() }}><Icon android="repeat" size={30}
        color="red" /></TouchableOpacity>

    return repeatIcon;
  }

  function _player() {

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
          <Text style={Styles.playerSliderText}>
            {Math.round((current / 60 + Number.EPSILON) * 100) / 100}
          </Text>
        </View>

        <View style={Styles.playerSliderMain}>
          <Slider
            style={{ width: '100%', height: 40, }}
            thumbTintColor={'#f35f19'}
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
          <Text style={Styles.playerSliderText}>
            {Math.round((duration / 60 + Number.EPSILON) * 100) / 100}
          </Text>
        </View>

      </View>

      {/* <View style={Styles.playerRepeat}>
        {_repeatButton()}
      </View> */}

      <View style={Styles.playerOprationLike}>
        {_likeButton()}
      </View>

      <View style={Styles.playerOprationDownload}>
        {_downloadButton()}
      </View>

    </View>
    )
  }

  function _smallPlayer() {
    let playButton = <TouchableOpacity onPress={() => { handlePlay() }}>
      <Icon android="play" size={40} color="#fff" />
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

  function _fixedTop() {
    let backIcon = <Icon android="arrow-back-circle-sharp" size={30} color="#fff" />

    if (locale == 'fa_IR')
      backIcon = <Icon android="arrow-forward-circle-sharp" size={30} color="#fff" />

    let back = <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
      {backIcon}
    </TouchableOpacity>

    if (showSmallPlayer)
      return (
        <View>
          {back}
          <View style={{ marginTop: 40 }}>
            {_smallPlayer()}
          </View>
        </View>
      )
    else
      return (
        <View>
          {back}

          <TouchableOpacity onPress={() => { handleNext() }} style={Styles.next}>
            <Text style={{ color: "#fff" }}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { handlePreve() }} style={Styles.preve}>
            <Text style={{ color: "#fff" }}>
              Preve
            </Text>
          </TouchableOpacity>
        </View>
      )
  }

  function _renderHtml(text) {
    let changeText = text;
    changeText = changeText.replace(/<br \/>/g, '\n')
    return changeText;
  }

  function _mainReturn() {
    let mainReturn = (<Spinner
      visible={true}
      textContent={'Loading...'}
      textStyle={{ color: '#fff' }}
    />)

    if (isDownloaded) {
      mainReturn = _downlodProgress();
    }

    if (loadEnd) {
      mainReturn =
        <HeaderImageScrollView
          maxHeight={imageScroll}
          minHeight={80}
          headerImage={imageUrl}
          maximumZoomScale={2}
          maxOverlayOpacity={0.5}
          foregroundParallaxRatio={3}
          renderFixedForeground={() => (_fixedTop())}
        >
          <TriggeringView onBeginHidden={() => { setShowSmallPlayer(true) }}
            onDisplay={() => { setShowSmallPlayer(false) }}>
          </TriggeringView>

          <View style={Styles.bodyTarget}>

            {_player()}

            <View style={Styles.title}>
              <Text style={Styles.titleText}>
                {lesson.Title}
              </Text>
            </View>

            <ReactNativeZoomableView style={Styles.htmlView}
              maxZoom={1.5}
              minZoom={1}
              zoomStep={0.5}
              initialZoom={1}
              bindToBorders={true}
            >
              <HTMLView stylesheet={htmlstyles} value={_renderHtml(lesson.Content)} />
              <Text style={{ borderTopWidth: 2, borderTopColor: 'black', width: '100%', marginTop: 5, marginBottom: 5 }}></Text>
              <HTMLView stylesheet={htmlstyles} value={lesson.ContentExtra == null ? "" :
                _renderHtml(lesson.ContentExtra)} />

            </ReactNativeZoomableView>
          </View>

        </ HeaderImageScrollView>

    }

    return mainReturn;
  }

  return (<>
    {_mainReturn()}
  </>
  );
}

Lesson.navigationOptions = () => ({
  headerShown: false
});

export default Lesson;

var htmlstyles = StyleSheet.create({

  h5: {
    fontWeight: 'bold',
    fontSize: 16
  },
  strong: {
    fontWeight: 'bold'
  },
  a: {
    color: 'blue'
  },
})