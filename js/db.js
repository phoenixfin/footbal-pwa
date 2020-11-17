let dbPromised = idb.open("football", 1, function (upgradeDb) {
    let footballObjectStore = upgradeDb.createObjectStore("teams", {keyPath: "id"});
    footballObjectStore.createIndex("id", "id", {
        unique: false
    });
});

function saveForLater(team) {
    dbPromised
        .then(function (db) {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.put(team);
            return tx.complete;
        })
        .then(function () {
            console.log("Data tim berhasil di simpan.");
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (teams) {
                console.log(teams);
                resolve({'teams':teams});
            });
    });
}

function checkExist(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const tx = db.transaction("teams", "readonly");
                const store = tx.objectStore("teams");
                return store.getAllKeys();
            })
            .then(function (keys) {
                resolve((keys.includes(parseInt(id))));
            });
    });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(parseInt(id));
            })
            .then(function (team) {
                resolve(team);
            });
    });
}

function destroyById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                const tx = db.transaction("teams", "readwrite");
                const store = tx.objectStore("teams");
                const item = store.get(id);
                store.delete(id);
                return item;
            })
            .then(function (team) {
                console.log(team);
                resolve(team);
            });
    });
}