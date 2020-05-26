import React from 'react';
import { StyleSheet } from 'react-native';
import PDFView from 'react-native-view-pdf';

export interface Props {
  resourceUrl: String;
  accessible: any;
  accessibilityLabel: any;
  testID: any;
}

const PDFViewComponent = (props: any) => {
  const { resourceUrl } = props;
  return (
    <PDFView
      fadeInDuration={250.0}
      style={styles.container}
      resource={resourceUrl}
      resourceType={'url'}
      onLoad={() => {}}
      onError={() => {}}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PDFViewComponent;
