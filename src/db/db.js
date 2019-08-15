import SQLite from 'react-native-sqlite-storage';
import {
    Alert,
} from 'react-native';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class Database {
    getGenresTable() {
        let db;
        return new Promise((resolve, reject) =>{
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library'})
                .then(DB => {
                    db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM \'genres\'', [], (tx, results) => {
                            let len = results.rows.length;
                            for (let i = 0; i < len; i++) {
                                let row = results.rows.item(i);
                                console.warn(row.genre);
                            }
                        });
                    });
                });
        });
    }

    addUser(username, password, name) {
        let db;
        return new Promise((resolve, reject) => {
            console.warn('Plugin integrity check ...');
            SQLite.echoTest()
                .then(() => {
                    console.warn('Integrity check passed ...');
                    console.warn('Opening database ...');

                    SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library'})
                        .then(DB => {
                            db = DB;
                            console.warn('Database OPEN');
                            db.transaction((tx) => {
                                tx.executeSql(`CREATE TABLE IF NOT EXISTS "users" (
										"username"	TEXT NOT NULL UNIQUE,
										"password"	TEXT NOT NULL,
										"name"	TEXT NOT NULL,
										PRIMARY KEY("username")
                                    )`);
                                console.warn('Table users Created!');
                            })
                                .catch((error) => console.warn('Table users was not created! ' + error.message))
                                .then(() => {
                                    db.transaction((tx) => {
                                        tx.executeSql(`INSERT INTO users VALUES ('${username}', '${password}', '${name}')`);
                                    })
                                        .then(() =>
                                        {
                                            db.close();
                                            resolve({
                                                status: 'ok',
                                                username,
                                                password,
                                                name,
                                            });
                                        })
                                        .catch(error => {
                                            db.close();
                                            console.warn('Error in INSERT: ' + error.message);
                                            reject({
                                                status: 'not ok',
                                                username,
                                                password,
                                                name,
                                            });
                                        });
                                });
                        })
                        .catch(error => {
                            db.close();
                            console.warn('Echo test error: ' + error.message);
                        });
                });
        });
    }

    verifyUser(username, password) {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library'})
                .then(DB => {
                    let db = DB;
                    db.transaction(tx => {
                        // Check if user exists
                        tx.executeSql(
                            `SELECT name FROM users WHERE username='${username}'`, [], (tx, results) => {
                                console.warn('SELECT completed');
                                let len = results.rows.length;
                                if (len > 0) {
                                    console.warn('YES USER FOUND YAY!');

                                    // Check if user exists for given password
                                    tx.executeSql(
                                        `SELECT name FROM users WHERE username='${username}'AND password='${password}'`,
                                        [], (tx, results) => {
                                            let len = results.rows.length;
                                            if (len > 0) {
                                                resolve({
                                                    status: 'ok',
                                                    username,
                                                    password,
                                                });
                                            } else {
                                                // User exists but incorrect password
                                                reject({
                                                    status: 'password mismatch',
                                                    username,
                                                    password,
                                                });
                                            }
                                    });
                                } else {
                                    // User doesn't exist
                                    reject({
                                        status: 'user mismatch',
                                        username,
                                        password,
                                    });
                                }
                            }
                        )
                            .catch(error => {
                                Alert.alert('Error', error.message);
                            });
                    });
                })
                .catch(error => {
                    Alert.alert('Error', 'Couldn\'t open database!' + error.message);
                });
        });
    }

    addToWishList(request) {
    // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library'})
                .then(DB => {
                    let db = DB;
                    db.transaction(tx => {
                        tx.executeSql(`CREATE TABLE IF NOT EXISTS "history" (
                            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                            "titleId"	TEXT NOT NULL,
                            "titleType"	INTEGER NOT NULL,
                            "username"	TEXT NOT NULL,
                            "listType"	TEXT NOT NULL
                        )`)
                        .catch(error => Alert.alert('Error', error.message));
                    })
                    .then(() => {
                        db.transaction(tx => {
                            tx.executeSql(
                                'INSERT INTO history(listType, titleId, titleName,titleOverview, titleVoteCount, titleVoteAverage,titlePosterPath, titleType, username) VALUES (?,?,?,?,?,?,?,?,?)',
                                [request.listType, request.titleId, request.titleName, request.titleOverview, request.titleVoteCount, request.titleVoteAverage, request.titlePosterPath, request.titleType, request.username],
                                (tx, results) => {
                                    resolve(true);
                                })
                            .catch(error => resolve(false));
                        });
                    });
                });
            });
    }

    getHistory(username) {
        let db;
        // console.warn(username);
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql(`SELECT * FROM 'history' WHERE username='${username}'`, [], (tx, results) => {
                            console.warn('SQL executed..');
                            let len = results.rows.length;
                            let rows = [];
                            // console.warn('Results row length' + len);
                            for (let i = 0; i < len; i++)
                                {rows.push(results.rows.item(i));}
                            resolve(rows);
                        });
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
        });
    }

    isInList(listType, titleId, username) {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql('SELECT * FROM \'history\' WHERE username=? AND listType=? AND titleId=?', [username, listType, titleId], (tx, results) => {
                            console.warn('SQL executed..');
                            let len = results.rows.length;
                            console.warn('Check if is in list len: ' + len);
                            for (let i = 0; i < len; i++) {
                                let row = results.rows.item(i);
                                console.warn(row + ' is here!');
                            }
                            len > 0 ? resolve(true) : reject(false);
                        });
                    })
                    .catch(error => {
                        console.log(error.message);
                    });
                });
            });
        }
}

const db = new Database();
export default db;
