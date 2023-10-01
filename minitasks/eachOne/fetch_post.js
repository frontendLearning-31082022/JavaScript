// Реализуйте сохранение пользователя на ресурсе reqres.in
if (typeof fetch === 'undefined') fetch = function () {
    // npm install node-fetch // npm install node-fetch@2
    try { return require("node-fetch"); }
    catch { }
}();

async function saveUserData(usrObj) {
    try {
        const response = await fetch("https://reqres.in/api/users", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usrObj),
        });

        const result = await response.json();
        return Promise.resolve(result);
    } catch (error) {
        throw new Error(error);
    }
}

const data = [
    {
        "name": "John Doe",
        "job": "unknown"
    },
    1];

data.forEach((user) => {
    saveUserData(user).then((echo) => {
        console.log('User data saved successfull\n' + JSON.stringify(echo));
    }).catch(error => {
        console.log(error.message);
    });
});