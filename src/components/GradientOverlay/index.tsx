import React from 'react';
import {View, StyleSheet} from 'react-native';

const GradientOverlay = () => {
  return (
    <View style={styles.overlay}>
      <View style={styles.gradient} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100, // Adjust the height as needed
  },
  gradient: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Adjust the alpha (4th value) to control the gradient's transparency
  },
});

export default GradientOverlay;
