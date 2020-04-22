import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = applyMiddleware(thunkMiddleware);

export const store = createStore(
    rootReducer,
    composeWithDevTools(compose(middleware)),
);