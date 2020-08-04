import * as ENG from './english';
import * as IND from './indonesia';

export const intlMessage = (lang) => {
    if (lang === 'en') {
        return ENG;
    } else {
        return IND;
    }
};
