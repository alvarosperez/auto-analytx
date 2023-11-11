import commonStyles from './common.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont, faHashtag } from '@fortawesome/free-solid-svg-icons';

export const PROJECT_NAME = 'Auto Analytx';
export const PROJECT_PATH = '/auto-analytx';

export const COLUMN_TYPES = {
    'number': <FontAwesomeIcon icon={faHashtag} className="fa-fw" />,
    'text': <FontAwesomeIcon icon={faFont} className="fa-fw" />,
    'date': <FontAwesomeIcon icon={faFont} className="fa-fw" />,
};

export const COLORS = {
    min: '#007a9c',
    max: '#ff6600',
    mean: 'black',
};

export const MIN_MAX_MEAN = [
    <div style={{ background: COLORS.min}} className={commonStyles.minMaxIcon}>Mín</div>,
    <div style={{ background: COLORS.max}} className={commonStyles.minMaxIcon}>Máx</div>,
    <div style={{ background: COLORS.mean}} className={commonStyles.minMaxIcon}>AVG</div>,
];

export const GRAPH_WIDTH = 370;
export const GRAPH_HEIGHT = 300;

// AWS
export const API_URL = 'http://ec2-13-39-155-245.eu-west-3.compute.amazonaws.com:20900'
// Docker
// export const API_URL = 'http://localhost:8088';
// local
// export const API_URL = 'http://localhost:3000';