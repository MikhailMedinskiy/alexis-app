import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './Base/app';
import { history } from './Base/routers/AppRouter';
import configureStore from './Base/store/configureStore';
import { login } from './Login/actions/auth';

const store = configureStore();

const jsx = (
    <Provider store={store}>
      <App />
    </Provider>
);

let hasRenderred = false;
const renderApp = () => {
    if (!hasRenderred) {
        ReactDOM.render(jsx, document.getElementById('app'));
        hasRenderred = true;
    }
};

const user = JSON.parse(localStorage.getItem('userInfo'));
const currentPageUrl = history.location.pathname;

if (user) {
    store.dispatch(login({ ...user }));
    if (currentPageUrl === '/' || currentPageUrl === '/registration' ) {
        history.push('/wordgroups');
    }
    renderApp();
} else if (currentPageUrl !== '/registration') {
    history.push('/');
    renderApp();
} else {
    renderApp();
}
