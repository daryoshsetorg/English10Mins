import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Slider, Animated, NativeModules, dev } from 'react-native'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-ionicons'
import Sound from 'react-native-sound'
import RNFS from 'react-native-fs'
import Styles from '../../assets/styles/lesson'
import Toast from 'react-native-root-toast';
import { ErrorStyle, SuccessStyle, infoStyle } from '../../assets/styles/toast'
import HTMLView from 'react-native-htmlview';
import { MainImageUrl, MainSoundUrl } from '../../utilities/url';
import { getLesson, likeLesson } from '../../assets/api/api';
import Spinner from 'react-native-loading-spinner-overlay';

const locale = NativeModules.I18nManager.localeIdentifier//language

function Lesson(props) {

  Sound.setCategory('Playback');
  const [lessonId, setLessonId] = useState(props.navigation.state.params.Id);
  const [fileName] = useState(lessonId + ".mp3");
  const [soundUrl] = useState(MainSoundUrl + "/" + fileName);
  const [imageUrl, setImageUrl] = useState({ uri: MainImageUrl + "/" + lessonId + ".jpg" });

  const [whoosh] = useState(new Sound(soundUrl, null, (error) => {
    if (error) {
      Toast.show('Error to Load mp3', ErrorStyle);
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

  useEffect(() => {
    Animated.timing(
      fadeAnim, { useNativeDriver: true }
    ).start();

    fetchData();
  }, []);

  function fetchData() {
    let params = { Id: lessonId }
    getLesson(params).then((res) => {
      setLesson(res);
      setImageUrl({ uri: MainImageUrl + "/" + lessonId + ".jpg" });
      setLoadEnd(true);
      RNFS.exists(`${RNFS.DocumentDirectoryPath}/${fileName}`).then((exist) => {
        if (exist) {
          setFileExist(true);
        }
      })
    }).catch(()=>{
      Toast.show('error to connect to server',ErrorStyle)
    });
  }

  var timeInterVal = setInterval(() => {
    whoosh.getCurrentTime((seconds) => {
      setCurrent(seconds);
    });
  }, 5000);
  clearInterval(timeInterVal);
  timeInterVal = null;

  function backToList() {
    clearInterval(timeInterVal);
    timeInterVal = null;
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
        SetLoadEnd(false);

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
          Toast.show('error to connect to server', ErrorStyle);
        });
      }
    })

  }

  function downloadFileProgress(data) {
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    console.log(percentage)
    setDownloadPercentage(percentage);
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

    let tt = whoosh.getDuration();
    setDuration(tt);

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
    setLessonId(2);
    fetchData();
  }

  function handlePreve() {
    setLoadEnd(false);
    setLessonId(1);
    fetchData();
  }

  function handleLike(isLike) {
    let params = { IsLike: isLike, Id: lessonId }
    likeLesson(params).then(() => {
      if (isLike)
        setIsLiked(true)
      else
        setIsLiked(false)
    }).catch(()=>{
      Toast.show('error to connect to server',ErrorStyle);
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
    let like = <TouchableOpacity onPress={() => { handleLike(true) }}>
      <Icon android="heart" size={25}
        color="#fff" />
    </TouchableOpacity>

    if (isLiked) {
      like = <TouchableOpacity onPress={() => { handleLike(false) }}>
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
          <Text style={Styles.playerSliderText}>
            {Math.round((duration / 60 + Number.EPSILON) * 100) / 100}
          </Text>
        </View>

      </View>

      <View style={Styles.playerRepeat}>
        {_repeatButton()}
      </View>

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
          maxHeight={200}
          minHeight={80}
          headerImage={imageUrl}
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
              <Text style={Styles.titleText}>{lesson.Title} </Text>
            </View>

            <View style={Styles.htmlView}>
              <HTMLView value={lesson.Content} />
            </View>

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