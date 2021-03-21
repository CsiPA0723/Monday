import { DataTypes, ModelAttributes } from "../systems/database/datatypes";

export default function buildColumnsFrom(modelAttributes: ModelAttributes<any>) {
    let tableArrString: string[] = [];
    let foreignString: string = null;
    for (const key in modelAttributes) {
        if (Object.prototype.hasOwnProperty.call(modelAttributes, key)) {
            const { type, allowNull, defaultValue, primaryKey, autoIncrement, unique, references } = modelAttributes[key];
            let string = `${key} ${type}`;
            if(primaryKey) string += " PRIMARY KEY";
            if((autoIncrement || primaryKey) && type === DataTypes.INTEGER) string += " AUTOINCREMENT";
            if(unique) string += "UNIQUE";
            if(!allowNull) string += " NOT NULL";
            if(defaultValue !== undefined && defaultValue !== null) string += ` DEFAULT(${defaultValue})`;
            if(references) {
                const { foreignKey, table } = references;
                foreignString = ` FOREIGN KEY (${key}) REFERENCES ${table} (${foreignKey})`;
            }
            tableArrString.push(string);
        }
    }
    if(foreignString !== null) tableArrString.push(foreignString);
    return tableArrString;
}