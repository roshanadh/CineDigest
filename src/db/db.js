import SQLite from 'react-native-sqlite-storage';
import {
    Alert,
} from 'react-native';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class Database {
    addUser(username, password, name) {
        let db;
        return new Promise((resolve, reject) => {
            console.warn('Plugin integrity check ...');
            SQLite.echoTest()
                .then(() => {
                    console.warn('Integrity check passed ...');
                    console.warn('Opening database ...');

                    SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: 1 })
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
                        .catch(error => console.warn('Echo test error: ' + error.message));
                });
        });
    }
}

const db = new Database();
export default db;
