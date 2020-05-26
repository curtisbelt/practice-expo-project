import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

// Import all reducers
import HomeReducer from '../reducers/HomeReducer';
import ForYouReducer from '../reducers/ForYouReducer';
import ForYou_MyFeedReducer from '../reducers/ForYou_MyFeedReducer';
import DigitalDailyReducer from '../reducers/DigitalDailyReducer';
import user from '../reducers/User';
import RunwayReducer from '../reducers/RunwayReducer';
import SectionsReducer from '../reducers/SectionsReducer';
import mySaga from '../sagas/index';
const sagaMiddleware = createSagaMiddleware();

const AppReducers = combineReducers({
  home: HomeReducer,
  foryou: ForYouReducer,
  myfeed: ForYou_MyFeedReducer,
  digitalDaily: DigitalDailyReducer,
  user: user,
  runway: RunwayReducer,
  sections: SectionsReducer,
});

const Store = createStore(AppReducers, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(mySaga);
export default Store;
