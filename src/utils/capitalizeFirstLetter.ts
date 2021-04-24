export default function capitalizeFirstLetter([ first, ...rest ]: string, locale?: string) {
    return [ first.toLocaleUpperCase(locale), ...rest ].join('');
}