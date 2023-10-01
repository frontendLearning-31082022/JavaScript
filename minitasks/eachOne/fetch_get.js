// Реализуйте запрос пользователя с reqres.in
if (typeof fetch === 'undefined')fetch=function(){
    // npm install node-fetch   // npm install node-fetch@2
    try { return require("node-fetch"); }
    catch { }
}();

async function getUserData(ID) {
    const url = 'https://reqres.in/api/users/' + ID;
    const responce = await fetch(url);

    let resLoad = null;
    if (!responce.ok) resLoad = await responce.text().then(allText => { return `Error - can't get user. Status ${responce.status} - ${allText}`; });
    if (responce.ok) resLoad = await responce.json();

    return responce.ok ? Promise.resolve(resLoad.data) : Promise.reject(resLoad);
}

const usrExist = getUserData('2');
usrExist.then(user => { console.log(user); })
    .catch(err => { console.log(err); })

const usrNo = getUserData('23');
usrNo.then(user => { console.log(user); })
    .catch(err => { console.log(err); })