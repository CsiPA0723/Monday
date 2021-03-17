import { DataTypes, ModelAttributes } from "../systems/database/types";

export default function getTableCreateString(modelAttributes: ModelAttributes) {
    let tableArrString: string[] = [];
    let foreignString: string = "";
    for (const key in modelAttributes) {
        if (Object.prototype.hasOwnProperty.call(modelAttributes, key)) {
            const { type, allowNull, defaultValue, primaryKey, autoIncrement, references } = modelAttributes[key];
            let string = `${key} ${type}`;
            if(primaryKey) string += " PRIMARY KEY";
            if((autoIncrement || primaryKey) && type === DataTypes.INTEGER) string += " AUTOINCREMENT";
            if(!allowNull) string += " NOT NULL";
            if(defaultValue !== undefined && defaultValue !== null) string += ` DEFAULT(${defaultValue})`;
            if(references) {
                const { foreignKey, table } = references;
                foreignString = ` FOREIGN KEY (${key}) REFERENCES ${table} (${foreignKey})`;
            }
            tableArrString.push(string);
        }
    }
    if(foreignString.length > 0) tableArrString.push(foreignString);
    console.log(tableArrString.join(", "));
    return tableArrString;
}