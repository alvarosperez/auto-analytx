import React from 'react';
import clsx from 'clsx';
import { useRecoilValue, } from 'recoil';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { authState } from '../atoms/auth';

import styles from './Profile.module.scss';

const Profile = ({ customClassname }) => {
    const auth = useRecoilValue(authState);
    const [showMenu, setShowMenu] = React.useState(false);

    const logout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <div className={clsx(styles.Container, customClassname)}>
            { auth.user.name }
            <span
                className={styles.UserIcon}
                onMouseEnter={() => setShowMenu(true)}
                onMouseLeave={() => setShowMenu(false)}
            >
                <FontAwesomeIcon icon={faUser} className="fa-fw" />
                {showMenu && (
                    <div className={styles.Menu}>
                        <div className={styles.MenuItem}>Perfil</div>
                        <div className={styles.MenuItem}>Configuración</div>
                        <div className={styles.MenuItem}>Ayuda</div>
                    </div>
                )}
            </span>
            <span className={styles.LogoutIcon} onClick={logout}>
                logout
            </span>
        </div>
    );
};

export default Profile;
