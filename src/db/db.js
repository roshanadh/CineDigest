import SQLite from 'react-native-sqlite-storage';
import {
    Alert,
} from 'react-native';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class Database {
    addUser(username, password, name) {
        let db;
        return new Promise((resolve) => {
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
                            })
                                .then(() => console.warn('Table users Created!'))
                                .catch((error) => console.warn('Table users was not created! ' + error.message))
                                .then(() => {
                                    db.transaction((tx) => {
                                        tx.executeSql(`INSERT INTO users VALUES ('${username}', '${password}', '${name}')`);
                                        // Alert.alert(`Successful`, `${username} has been registered!`);
                                        Alert.alert(
                                            'Successful',
                                            `${username} has been registered!`,
                                        );
                                    })
                                        .catch(error => {
                                            console.warn('Error in INSERT: ' + error.message);
                                            Alert.alert(`Oops`, `Username ${username} already exists!`);
                                        });
                                })
                                .then(() => {
                                    db.transaction((tx) => {
                                        tx.executeSql('SELECT u.name, u.username, u.password FROM users u', [])
                                            .then(([tx, results]) => {
                                                console.log('Query completed');
                                                var len = results.rows.length;
                                                for (let i = 0; i < len; i++) {
                                                    let row = results.rows.item(i);
                                                    console.warn(
                                                        `Name: ${row.name}, Username: ${row.username},
															Password: ${row.password}`);
                                                }
                                                resolve({
                                                    status: 'ok',
                                                    name,
                                                    username,
                                                    password,
                                                });
                                            })
                                            .catch(error => console.warn('Error in SELECT, ' + error.message));
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
