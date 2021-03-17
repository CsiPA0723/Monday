import { contextBridge, ipcRenderer } from "electron";

declare global {
    interface Window { login: {
        authenticate: (username: string, password: string, rememberMe: boolean) => void
        onAuthenticated: (func: Function) => void,
        tryRememberMe: () => void
    }; }
}

contextBridge.exposeInMainWorld("login", {
    authenticate(username: string, password: string, rememberMe: boolean) {
        ipcRenderer.send("authenticated", username, password, rememberMe);
    },

    onAuthenticated(func: Function) {
        ipcRenderer.on("authenticated", (event, isAuthenticated: boolean) => {
            if(isAuthenticated) func();
            else alert("Username or Password not matching");
        });
    },
    tryRememberMe() {
        ipcRenderer.send("tryRememberMe");
    }
});