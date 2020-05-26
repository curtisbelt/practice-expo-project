import Config from 'react-native-config';
export const parentEnabled = Boolean(JSON.parse(Config.parentEnabled));
export const childEnabled = Boolean(JSON.parse(Config.childEnabled));
export const useStaticLable = Boolean(JSON.parse(Config.useStaticLable));
