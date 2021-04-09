export default function buildUpdateSetsFrom<T>(data: T) {
    let columns: string[] = [];
    for (const key in data) {
        if(data.hasOwnProperty(key)) {
            columns.push(`${key} = @${key}`);
        }
    }
    return columns;
}