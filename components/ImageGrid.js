import React from "react";
import PropTypes from "prop-types";
import { Permissions } from "expo";
import { CameraRoll, Image, StyleSheet, TouchableOpacity } from "react-native";

import Grid from "./Grid";

export default class ImageGrid extends React.Component {
  static propTypes = {
    onPressImage: PropTypes.func
  };
  static defaultProps = {
    onPressImage: () => {}
  };

  state = {
    images: [],
  };

  loading = false;
  cursor = null;

  componentDidMount() {
    this.getImages();
  }

  getImages = async (after) => {
    if (this.loading) return;
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status !== "granted") {
      console.log("Camera roll permission denied");
      return;
    }

    this.loading = true;

    const results = await CameraRoll.getPhotos({
      first: 20,
      after
    });
    const { edges, page_info: { has_next_page, end_cursor } } = results;
    const loadedImages = edges.map((item) => item.node.image);

    this.setState({
      images: this.state.images.concat(loadedImages)
    }, () => {
      this.loading = false,
      this.cursor = has_next_page ? end_cursor : null;
    });
  };

  getNextImages = () => {
    if (!this.cursor) return;
    this.getImages(this.cursor);
  }

  renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
    const { onPressImage } = this.props;

    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop
    };

    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}
      >
        <Image source={{ uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;

    return (
      <Grid
        data={images}
        renderItem={this.renderItem}
        keyExtractor={({ uri }) => uri}
        onEndReached={this.getNextImages}
      />
    );
  }
}
const styles = StyleSheet.create({
  image: {
    flex: 1
  }
});
