export default function buildUpsertSetsFrom<T>(data: T) {
    let columns: string[] = [];
    for (const key in data) {
        if(data.hasOwnProperty(key)) {
            if(!data[key]) columns.push(`${key} = excluded.${key}`);
            else columns.push(`${key} = @${key}`);
        }
    }
    return columns;
}