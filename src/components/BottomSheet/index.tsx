import React, {useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const BottomSheet = ({isVisible, onDismiss, height, children}: any) => {
  const windowHeight = Dimensions.get('window').height;
  const translateY = useRef(
    new Animated.Value(height || windowHeight * 0.7),
  ).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
          backdropOpacity.setValue(gestureState.dy / windowHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.vy > 0.5 || gestureState.dy > 50) {
          hideBottomSheet();
        } else {
          resetBottomSheet();
        }
      },
    }),
  ).current;

  const showBottomSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [backdropOpacity, translateY]);

  const hideBottomSheet = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height || windowHeight * 0.7,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => onDismiss());
  };

  const resetBottomSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (isVisible) {
      showBottomSheet();
    }
  }, [isVisible, showBottomSheet]);

  return (
    <>
      <Animated.View
        style={[styles.backdrop, {opacity: backdropOpacity}]}
        pointerEvents={isVisible ? 'auto' : 'none'}>
        <TouchableOpacity
          style={{flex: 1}}
          activeOpacity={1}
          onPress={hideBottomSheet}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          {height: height || windowHeight * 0.7, transform: [{translateY}]},
        ]}
        {...panResponder.panHandlers}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  handle: {
    height: 5,
    width: 50,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 5,
    margin: 10,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
  },
});

export default BottomSheet;
