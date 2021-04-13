import { database } from "../database";

export default function randomBackupCode() {
    const codes = <string[]>database.prepare("SELECT backupCode FROM users;").all();
    let code = makeCode(6);
    while(codes.includes(code)) code = makeCode(6);
    return code;
}

function makeCode(length: number) {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}