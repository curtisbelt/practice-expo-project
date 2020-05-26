import { arrayOf, func, number, object, shape, string } from 'prop-types';
import React, { Component } from 'react';
import { findNodeHandle, requireNativeComponent, UIManager, ViewPropTypes } from 'react-native';
import { createErrorFromErrorData } from '../utils';

class Banner extends Component {
  constructor(props: any) {
    super(props);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleAppEvent = this.handleAppEvent.bind(this);
    this.handleAdFailedToLoad = this.handleAdFailedToLoad.bind(this);
    this.state = {
      style: {},
    };

    this.handleOnAdLoaded = ({ nativeEvent }) => {
      this.props.onAdLoaded && this.props.onAdLoaded(nativeEvent);
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      Object.entries(this.state.style).toString() === Object.entries(nextState.style).toString() &&
      Object.entries(this.props).toString() === Object.entries(nextProps).toString()
    ) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.loadBanner();
  }

  loadBanner() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this._bannerView),
      UIManager.getViewManagerConfig('CTKBannerView').Commands.loadBanner,
      null,
    );
  }

  handleSizeChange({ nativeEvent }) {
    const { height, width } = nativeEvent;
    this.setState({ style: { width, height } });
    if (this.props.onSizeChange) {
      this.props.onSizeChange(nativeEvent);
    }
  }

  handleAppEvent(event) {
    if (this.props.onAppEvent) {
      const { name, info } = event.nativeEvent;
      this.props.onAppEvent({ name, info });
    }
  }

  handleAdFailedToLoad(event) {
    if (this.props.onAdFailedToLoad) {
      this.props.onAdFailedToLoad(createErrorFromErrorData(event.nativeEvent.error));
    }
  }

  render() {
    return (
      <CTKBannerView
        {...this.props}
        style={[this.props.style, this.state.style]}
        onSizeChange={this.handleSizeChange}
        onAdLoaded={this.handleOnAdLoaded}
        onAdFailedToLoad={this.handleAdFailedToLoad}
        onAppEvent={this.handleAppEvent}
        ref={(el) => (this._bannerView = el)}
      />
    );
  }
}

Banner.simulatorId = 'SIMULATOR';

Banner.propTypes = {
  ...ViewPropTypes,
  adSize: string,
  validAdSizes: arrayOf(string),
  adUnitID: string,
  testDevices: arrayOf(string),
  onSizeChange: func,
  onAdLoaded: func,
  onAdFailedToLoad: func,
  onAdOpened: func,
  onAdClosed: func,
  onAdLeftApplication: func,
  onAppEvent: func,
  targeting: shape({
    customTargeting: object,
    categoryExclusions: arrayOf(string),
    keywords: arrayOf(string),
    contentURL: string,
    publisherProvidedID: string,
    location: shape({
      latitude: number,
      longitude: number,
      accuracy: number,
    }),
    correlator: string,
  }),
};

const CTKBannerView = requireNativeComponent('CTKBannerView', Banner);

export default Banner;
