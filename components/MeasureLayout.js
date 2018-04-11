import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, View } from "react-native";
import { Constants } from "expo";

export default class MeasureLayout extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };

  state = {
    layout: null
  };

  handleLayout = (event) => {
    const { nativeEvent: { layout } } = event;
    const statusBarHeight = Platform.OS === "android" ? Constants.statusBarHeight : 0;

    this.setState({
      layout: {
        ...layout,
        y: layout.y + statusBarHeight
      }
    });
  }

  render() {
    const { children } = this.props;
    const { layout } = this.state;

    if (!layout) {
      return <View onLayout={this.handleLayout} style={styles.container} />;
    }

    return children(layout);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
