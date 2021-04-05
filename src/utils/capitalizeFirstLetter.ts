import { app } from "electron";

export default function capitalizeFirstLetter([ first, ...rest ]: any, locale = app.getLocale()) {
    return [ first.toLocaleUpperCase(locale), ...rest ].join('');
}