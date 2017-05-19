import messages from '../mastodon/locales/io.json';
// TODO: react-intl doesn't support io, using en as fallback
import localeData from 'react-intl/locale-data/en';
import { setLocale } from '../mastodon/locales';
setLocale({messages, localeData});
