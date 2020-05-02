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
import { MainImageUrl, MainSoundUrl } from '../../utilities/url';
import { getLesson } from '../../assets/api/api';
import Spinner from 'react-native-loading-spinner-overlay';

function Lesson(props) {

  Sound.setCategory('Playback');
  const [lessonId, setLessonId] = useState(props.navigation.state.params.Id);
  const [fileName] = useState(lessonId + ".mp3");
  const [soundUrl] = useState(MainSoundUrl + "/" + fileName);
  const [imageUrl] = useState({ uri: MainImageUrl + "/" + lessonId + ".jpg" });

  const [whoosh] = useState(new Sound(soundUrl, null, (error) => {
    if (error) {
      console.log('error')
      Toast.show('Error to Load', ErrorStyle);
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
  const [title, setTitle] = useState("");
  const [showTitle, setShowTitle] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [lesson, SetLesson] = useState({});
  const [loadEnd, SetLoadEnd] = useState(false);

  useEffect(() => {
    Animated.timing(
      fadeAnim, { useNativeDriver: true }
    ).start();

    fetchData();
  }, []);

  function fetchData() {
    let params = { Id: lessonId }
    getLesson(params).then((res) => {
      SetLesson(res);
      SetLoadEnd(true);
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

  function handleDownload() {

    RNFS.existsRes(`${RNFS.DownloadDirectoryPath}/${fileName}`).then((exist) => {
      console.log(exist)
      if (exist) {
        Toast.show(`file exists in ${RNFS.DownloadDirectoryPath}/${fileName}`, ErrorStyle
        );
      }
      else {
        setIsDownloaded(true);
        SetLoadEnd(false);

        RNFS.downloadFile({
          fromUrl: `${MainSoundUrl}/${fileName}`,
          toFile: `${RNFS.DownloadDirectoryPath}/${fileName}`,
          progress: (v) => { downloadFileProgress(v) }
          , progressDivider: 10
        }).promise.then(() => {
          setDownloadPercentage(100);
          setIsDownloaded(false);
          SetLoadEnd(true);
        }).catch(() => {
          setIsDownloaded(false);
          SetLoadEnd(true);
          Toast.show('error to connect to server', ErrorStyle);
        });
      }
    })

  }

  function downloadFileProgress(data) {
    const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
    setDownloadPercentage(percentage);
    console.log(percentage)
    if (percentage >= 100) {
      setDownloadPercentage(100);
      setIsDownloaded(false);
      SetLoadEnd(true);
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
    SetLoadEnd(false);
    setLessonId(2);
    fetchData();
  }

  function handlePreve() {
    SetLoadEnd(false);
    setLessonId(1);
    fetchData();
  }

  function _download() {
    let download = <TouchableOpacity onPress={() => { handleDownload() }}>
      <Icon android="download" size={25}
        color="#fff" />
    </TouchableOpacity>

    RNFS.existsRes(`${RNFS.DownloadDirectoryPath}/${fileName}`).then((exist) => {
      if (exist) {
        download = <Icon android="download" size={25}
          color="green" />
      }
    })

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

  function _like() {
    let like = <TouchableOpacity>
      <Icon android="heart" size={25}
        color="#fff" />
    </TouchableOpacity>

    if (isLiked) {
      like = <Icon android="heart" size={25}
        color="red" />
    }

    return like;
  }

  function _repeated() {
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
        {_repeated()}
      </View>

      <View style={Styles.playerOprationLike}>
        {_like()}
      </View>

      <View style={Styles.playerOprationDownload}>
        {_download()}
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
    if (showTitle)
      return (
        <View>
          <TouchableOpacity onPress={(v) => { backToList(v) }} style={Styles.backButton}>
            <Icon android="arrow-back-circle-sharp" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginTop: 40 }}>
            {_smallPlayer()}
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
          <TriggeringView onBeginHidden={() => { showTitles('test') }}
            onDisplay={() => { hideTitle() }}>
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