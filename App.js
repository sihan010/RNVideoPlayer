import {StyleSheet, View} from 'react-native';

import Player from './Player';
import React from 'react';

const App = () => {
  return (
    <View style={styles.container}>
      <Player
        autoStart={true}
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
