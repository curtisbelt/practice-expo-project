//import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';

const en = require('./i18n/en.json');

I18n.locale = 'en-US';

I18n.fallbacks = true;
I18n.translations = {
  en,
};

const translate = (key: string) => I18n.t(key);

export default translate;
