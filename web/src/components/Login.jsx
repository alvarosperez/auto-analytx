import React from 'react';
import clsx from 'clsx';
import Button from './Button';
import Input, { INPUT_TYPES } from './Input';
import styles from './Login.module.scss';
import logo from '../assets/img/logo.png';

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };

        this.onUserChange = this.onUserChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onUserChange = (event) => {
        this.setState({ username: event.target.value });
    };

    onPasswordChange = (event) => {
        this.setState({ password: event.target.value });
    };

    onButtonClick = () => {
        const { onClick } = this.props;
        const { username, password } = this.state;
        if (onClick) onClick(username, password);
    };

    render() {
        const {
            customClassname, welcomeText, errorMessage,
        } = this.props;

        return (
            <div
                className={clsx(styles.Container, customClassname)}
            >
                <div className={styles.LogoContainer}>
                    <object className={styles.Logo} data="https://alvarosperez.github.io/auto-analytx/static/media/logo.png" type="image/png">
                        <img className={styles.Logo} src={logo} alt="logo" />
                    </object>
                    <div className={styles.WelcomeText}>{ welcomeText }</div>
                </div>

                <div className={styles.InputContainer}>
                    <div className={styles.Titles}>Email:</div>
                    <Input onChange={this.onUserChange} />

                    <div className={styles.Titles}>Contraseña:</div>
                    <Input onChange={this.onPasswordChange} type={INPUT_TYPES.PASSWORD} />

                    {errorMessage.map((error) => (
                        <div className={styles.ErrorMessage}>{ error }</div>
                    ))}
                </div>

                <div className={styles.ButtonContainer}>
                    <Button onClick={this.onButtonClick}>
                        Login
                    </Button>
                </div>

                <div className={styles.InputContainer}>
                    <div className={styles.CredentialsMessage}>
                        <span>Registro</span>
                        <span>|</span>
                        <span>Recuperar contraseña</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
