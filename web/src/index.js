import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from 'prop-types';
import {
    RecoilRoot, useRecoilState, useRecoilValue,
} from 'recoil';
import {
    BrowserRouter, useNavigate, Navigate, Routes, Route, useLocation, useSearchParams,
} from 'react-router-dom';
import clsx from 'clsx';

import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import Header from './components/Header';
import Profile from './components/Profile';

import { authState } from './atoms/auth';

import commonStyles from './utilities/common.module.scss';
import './index.scss';

import { PROJECT_NAME, PROJECT_PATH } from './utilities/variables';
import { validateEmail } from './utilities/format';
import Main from './Main';


const RequireAuth = ({ children }) => {
    const auth = useRecoilValue(authState);
    const location = useLocation();
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login
    if (!auth.user?.email) {
        return <Navigate to={`${PROJECT_PATH}/login`} state={{ from: location }} replace />;
    }
    return children;
};
RequireAuth.propTypes = {
    children: PropTypes.node.isRequired,
};

const App = () => {
    const [auth, setAuthState] = useRecoilState(authState);
    const [errorMessage, setErrorMessage] = useState('loading');
    const navigate = useNavigate();
    const { state, pathname } = useLocation();
    const prevPathname = state?.from?.pathname || PROJECT_PATH;

    const submitLogin = (username, password) => {
        const newErrors = [];

        if (!validateEmail(username)) {
            newErrors.push('Please enter a valid email address');
        }
        if (password.length < 6) {
            newErrors.push('Invalid / empty password');
        }
        setErrorMessage(newErrors);
        if (newErrors.length > 0) {
            return;
        }

        if (password === 'aula23') {
            localStorage.setItem('email', username);
            localStorage.setItem('name', username.split('@')[0]);
            // localStorage.setItem('authToken', token);
            setAuthState({
                user: {
                    email: username,
                    name: username.split('@')[0],
                },
                // token:
            });
            navigate(prevPathname);
        }
    };

    const checkLogin = () => {
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        // const token = localStorage.getItem('authToken');

        if (email && name) {
            setAuthState({
                user: {
                    email,
                    name,
                },
                // token,
            });
            navigate(prevPathname);
        } else {
            setErrorMessage([]);
        }
    };

    useEffect(() => {
        if (pathname === `${PROJECT_PATH}/login`) checkLogin();
    }, [pathname]);

    return (
        <>
            <Header title={PROJECT_NAME} ExtraComponent={auth.user && Profile} confidentialWarning />
            <div className={clsx(commonStyles.MainContainer)}>
                <Routes>
                    <Route
                        path={`${PROJECT_PATH}/login`}
                        element={
                            errorMessage === 'loading'
                                ? <LoadingSpinner />
                                : (
                                    <Login
                                        welcomeText={PROJECT_NAME}
                                        onClick={submitLogin}
                                        errorMessage={errorMessage}
                                    />
                                )
                        }
                    />
                    {/* default redirect to home page */}
                    <Route
                        path="*"
                        element={
                            <RequireAuth><Main /></RequireAuth>
                        }
                    />
                </Routes>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <RecoilRoot>
                <App />
            </RecoilRoot>
        </BrowserRouter>
    </React.StrictMode>,
);

