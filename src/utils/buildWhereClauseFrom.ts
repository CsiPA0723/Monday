export default function buildWhereClauseFrom<T>(whereClause: Array<Partial<T>|"OR"|"AND"|"NOT">) {
    let whereString = "";
    const data: Partial<T> = {};
    for (const field of whereClause) {
        if(typeof field === "string") whereString += `${field} `;
        else {
            Object.assign(data, field);
            whereString += `${Object.getOwnPropertyNames(field)[0]} = @${Object.getOwnPropertyNames(field)[0]} `;
        }
    }
    return { data, whereString };
}