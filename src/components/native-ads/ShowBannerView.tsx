import React from 'react';
import Banner from './CTKAdManagerBanner';
import NativeAdsManager from './NativeAdsManager';
import Interstitial from './CTKAdManagerInterstitial';

class ShowBannerView extends React.Component {
  render() {
    const { adUnitID, adSizes }: any = this.props;
    const adsManager = new NativeAdsManager(adUnitID, [Interstitial.simulatorId]);

    return (
      <Banner
        adsManager={adsManager}
        adSize="banner"
        validAdSizes={adSizes}
        adUnitID={adUnitID}
        targeting={
          {
            // customTargeting: {group: 'nzme_user_test'},
            // categoryExclusions: ['media'],
            // contentURL: 'nzmetest://',
            // publisherProvidedID: 'provider_id_nzme',
          }
        }
        onAdFailedToLoad={(error) => console.log('Ad failed to load.', error)}
        onAdLoaded={this.onAdLoaded}
      />
    );
  }
}
export default ShowBannerView;
