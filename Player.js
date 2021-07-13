import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import Video from 'react-native-video';

const Player = ({autoStart, src}) => {
  const videoRef = React.createRef();
  const [state, setState] = useState({
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: false,
    loading: true,
  });

  useEffect(() => {
    Orientation.addOrientationListener(handleOrientation);

    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          <Video
            ref={videoRef}
            source={{
              uri: src,
            }}
            style={state.fullscreen ? styles.fullscreenVideo : styles.video}
            controls={false}
            resizeMode={'contain'}
            onLoad={onLoadEnd}
            onBuffer={onBuffer}
            onLoadStart={onLoadStart}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
          />
          {state.loading && (
            <ActivityIndicator
              animating={true}
              color="#fff"
              size={60}
              style={state.fullscreen ? styles.loadingFull : styles.loading}
            />
          )}
          {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                onPress={handleFullscreen}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={styles.fullscreenButton}>
                {state.fullscreen ? (
                  <Icon name="fullscreen-exit" color="#fff" size={30} />
                ) : (
                  <Icon name="fullscreen" color="#fff" size={30} />
                )}
              </TouchableOpacity>

              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={false}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <ScrollView>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus enim
          suscipit ipsa impedit laboriosam saepe, sapiente excepturi molestiae
          laudantium, non tempora cumque, quam assumenda deserunt? Similique
          eaque voluptas itaque corporis. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Sequi unde iusto vel facere quibusdam nisi placeat,
          debitis veritatis autem deserunt at voluptas nam ut mollitia qui fugit
          minus minima quod.
        </Text>
      </ScrollView>
    </View>
  );

  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({...s, fullscreen: true})), StatusBar.setHidden(true))
      : (setState(s => ({...s, fullscreen: false})),
        StatusBar.setHidden(false));
  }

  function handleFullscreen() {
    state.fullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft();
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    }

    setState({...state, play: true});
    setTimeout(() => setState(s => ({...s, showControls: false})), 2000);
  }

  function skipBackward() {
    videoRef.current.seek(state.currentTime - 15);
    setState({...state, currentTime: state.currentTime - 15});
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 15);
    setState({...state, currentTime: state.currentTime + 15});
  }

  function onSeek(data) {
    videoRef.current.seek(data.seekTime);
    setState({...state, currentTime: data.seekTime});
  }

  function onLoadStart(data) {
    setState(s => ({
      ...s,
    }));
  }

  function onLoadEnd(data) {
    setState(s => ({
      ...s,
      play: autoStart,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onBuffer(data) {
    alert(JSON.stringify(data));
    data.isBuffering
      ? setState(s => ({
          ...s,
          loading: true,
        }))
      : setState(s => ({
          ...s,
          loading: false,
        }));
  }

  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({...state, play: false});
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
  loading: {
    position: 'absolute',
    top: (Dimensions.get('window').width * (9 / 16)) / 2 - 30,
    left: Dimensions.get('window').width / 2 - 30,
  },
  loadingFull: {
    position: 'absolute',
    top: Dimensions.get('window').width / 2 - 30,
    left: Dimensions.get('window').height / 2 - 30,
  },
});

export default Player;
