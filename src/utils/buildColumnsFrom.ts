import { DataTypes, ModelAttributes } from "../systems/database/datatypes";

export default function buildColumnsFrom(modelAttributes: ModelAttributes<any>) {
    let tableArrString: string[] = [];
    let foreignKeys: string[] = [];
    let foreignReferences: string[] = [];
    for (const key in modelAttributes) {
        if (Object.prototype.hasOwnProperty.call(modelAttributes, key)) {
            const { type, allowNull, defaultValue, primaryKey, autoIncrement, unique, references } = modelAttributes[key];
            let string = `${key} ${type}`;
            if(primaryKey) string += " PRIMARY KEY";
            if((autoIncrement || primaryKey) && type === DataTypes.INTEGER) string += " AUTOINCREMENT";
            if(unique) string += " UNIQUE";
            if(!allowNull) string += " NOT NULL";
            if(defaultValue !== undefined && defaultValue !== null) string += ` DEFAULT(${defaultValue})`;
            if(references) {
                const { foreignKey, table } = references;
                foreignKeys.push(key);
                foreignReferences.push(`${table} (${foreignKey})`);
            }
            tableArrString.push(string);
        }
    }
    if(foreignKeys.length > 0) {
        for (let i = 0; i < foreignKeys.length; i++) {
            tableArrString.push(`FOREIGN KEY (${foreignKeys[i]}) REFERENCES ${foreignReferences[i]}`);
        }
    }
    return tableArrString;
}