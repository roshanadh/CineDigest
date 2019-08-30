import SQLite from 'react-native-sqlite-storage';
import {
    Alert,
} from 'react-native';
import bcrypt from 'react-native-bcrypt';

import Snackbar from '../util/Snackbar';
import { onSignIn, onSignOut } from '../auth/auth';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

class Database {
    getUser(username) {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql('SELECT * FROM users WHERE username=?;', [username], (tx, results) => {
                            // Get user details
                            let len = results.rows.length;
                            if (len > 0) {
                                let details = {};
                                let row = results.rows.item(0);
                                resolve({
                                    username,
                                    name: row.name,
                                });
                            } else {
                                reject(false);
                            }
                        });
                    });
                })
                .catch(error => {
                    console.warn(error.message);
                });
        });
    }

    addUser(username, password, name) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                password,
                name,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(payload);
                    } else {
                        reject(jsonResponse.status);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    verifyUser(username, password) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                password,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(payload);
                    } else {
                        reject(jsonResponse.status);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    updateProfile(username, newName, newUsername) {
        return new Promise((resolve, reject) => {
            if (newUsername === null && newName !== null) {
                console.warn('Name not null, username  null!');
                SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                    .then(DB => {
                        let db = DB;
                        console.warn('Database OPEN');
                        db.transaction((tx) => {
                            console.warn('Transaction started..');
                            tx.executeSql('UPDATE users SET name=? WHERE username=?;', [newName, username]);
                        }, error => reject(error), success => resolve(true));
                    })
                    .catch(error => {
                        console.warn(error.message);
                    });
            } else if (newUsername !== null && newName !== null) {
                console.warn('Name not null, username not null!');
                SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                    .then(DB => {
                        let db = DB;
                        console.warn('Database OPEN');
                        // Update users table
                        db.transaction((tx) => {
                            console.warn('Transaction started..');
                            tx.executeSql('UPDATE users SET name=?, username=? WHERE username=?;', [newName, newUsername, username]);
                        }, error => reject(error));
                        // Update history table
                        db.transaction((tx) => {
                            console.warn('Transaction started..');
                            tx.executeSql('UPDATE history SET username=? WHERE username=?;', [newUsername, username]);
                        }, error => reject(error), success => {
                            resolve(true);
                            console.warn('Updated second table too!');
                        });

                        // Update USER_KEY stored in AsyncStorage
                        onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                        onSignIn(newUsername).then(() => {
                            console.warn('Set USER_KEY ' + newUsername);
                            Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                        });
                    })
                    .catch(error => {
                        console.warn(error.message);
                    });
            } else if (newUsername !== null && newName === null) {
                console.warn('Name null, username not null!');
                SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                    .then(DB => {
                        let db = DB;
                        console.warn('Database OPEN');
                        // Update users table
                        db.transaction((tx) => {
                            console.warn('Transaction started..');
                            tx.executeSql('UPDATE users SET username=? WHERE username=?;', [newUsername, username]);
                        }, error => reject(error));
                        // Update history table
                        db.transaction((tx) => {
                            console.warn('Transaction started..');
                            tx.executeSql('UPDATE history SET username=? WHERE username=?;', [newUsername, username]);
                        }, error => reject(error), success => {
                            resolve(true);
                            console.warn('Updated second table too!');
                        });

                        // Update USER_KEY stored in AsyncStorage
                        onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                        onSignIn(newUsername).then(() => {
                            console.warn('Set USER_KEY ' + newUsername);
                            Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                        });
                    })
                    .catch(error => {
                        console.warn(error.message);
                    });
            }
        });
    }

    changePassword(username, newPassword) {
        let db;
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    db = DB;
                    db.transaction((tx) => {
                        tx.executeSql('UPDATE users SET password=? WHERE username=?;', [newPassword, username]);
                    }, error => {
                        reject(false);
                        console.warn(error.message);
                    }, success => {
                        resolve(true);
                        console.warn('Password changed!');
                    });
                })
                .catch(error => {
                    console.warn('Could not open DB ' + error.message);
                });
        });
    }

    addMovieToWishList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                username: request.username,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
                titleName: request.titleName,
                titleOverview: request.titleOverview,
                titleVoteAverage: request.titleVoteAverage,
                titleVoteCount: request.titleVoteCount,
                titlePosterPath: request.titlePosterPath,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/addMovieToWishList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    addMovieToWatchedList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                username: request.username,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
                titleName: request.titleName,
                titleOverview: request.titleOverview,
                titleVoteAverage: request.titleVoteAverage,
                titleVoteCount: request.titleVoteCount,
                titlePosterPath: request.titlePosterPath,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/addMovieToWatchedList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    addShowToWishList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                username: request.username,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
                titleName: request.titleName,
                titleOverview: request.titleOverview,
                titleVoteAverage: request.titleVoteAverage,
                titleVoteCount: request.titleVoteCount,
                titlePosterPath: request.titlePosterPath,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/addShowToWishList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    addShowToWatchingList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                username: request.username,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
                titleName: request.titleName,
                titleOverview: request.titleOverview,
                titleVoteAverage: request.titleVoteAverage,
                titleVoteCount: request.titleVoteCount,
                titlePosterPath: request.titlePosterPath,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/addShowToWatchingList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    addShowToWatchedList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                username: request.username,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
                titleName: request.titleName,
                titleOverview: request.titleOverview,
                titleVoteAverage: request.titleVoteAverage,
                titleVoteCount: request.titleVoteCount,
                titlePosterPath: request.titlePosterPath,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/addShowToWatchedList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    removeFromList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    db.transaction(tx => {
                        tx.executeSql(
                            'DELETE FROM history WHERE listType=? AND titleId=? AND username=?;',
                            [request.listType, request.titleId, request.username],
                            (tx, results) => {
                                resolve(true);
                            });
                    });
                    db.transaction(tx => {
                        tx.executeSql(
                            'SELECT * FROM history WHERE listType=? AND titleId=? AND username=?;',
                            [request.listType, request.titleId, request.username],
                            (tx, results) => {
                                let len = results.rows.length;
                                console.warn('OH OH len: ' + len);
                            });
                    });
                })
                .catch(error => {
                    resolve(error.message);
                });
        });
    }

    getHistory(username, listType, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                listType,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/getHistory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status !== 'NOT-FOUND') {
                        resolve(jsonResponse);
                    } else {
                        reject(jsonResponse.status);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    getStats(username) {
        let db;
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    db = DB;
                    db.transaction((tx) => {
                        tx.executeSql('SELECT * FROM \'history\' WHERE username=?;', [username], (tx, results) => {
                            console.warn('SQL executed..');
                            let len = results.rows.length;
                            if (len > 0) {
                                let listedMovies = 0;
                                let listedShows = 0;
                                let listedInWishMovies = 0;
                                let listedInWishShows = 0;
                                let listedInWatchedMovies = 0;
                                let listedInWatchedShows = 0;
                                let listedInWatchingShows = 0;

                                for (let i = 0; i < len; i++) {
                                    let row = results.rows.item(i);
                                    if (row.titleType === 'movie') {
                                        listedMovies++;
                                        if (row.listType === 'wishList') {
                                            listedInWishMovies++;
                                        } else if (row.listType === 'watchedList') {
                                            listedInWatchedMovies++;
                                        }
                                    } else if (row.titleType === 'show') {
                                        listedShows++;
                                        if (row.listType === 'wishList') {
                                            listedInWishShows++;
                                        } else if (row.listType === 'watchedList') {
                                            listedInWatchedShows++;
                                        } else if (row.listType === 'watchingList') {
                                            listedInWatchingShows++;
                                        }
                                    }
                                }
                                resolve({
                                    listedMovies,
                                    listedShows,
                                    listedInWishMovies,
                                    listedInWishShows,
                                    listedInWatchedMovies,
                                    listedInWatchedShows,
                                    listedInWatchingShows,
                                });
                            } else {
                                reject(false);
                            }
                        });
                    })
                        .catch(error => {
                            console.warn(error.message);
                        });
                })
                .catch(error => console.warn(error.message));
        });
    }

    isInList(listType, titleId, username, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                listType,
                titleId,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            console.warn(formBody);
            fetch('http://api-cine-digest.herokuapp.com/api/v1/isInList', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status !== 'NOT-FOUND') {
                        resolve(jsonResponse);
                    } else {
                        reject(jsonResponse.status);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    deleteAll() {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql('DELETE FROM history WHERE 1;', [], (tx, results) => {
                            console.warn('SQL executed..');
                        });
                    });
                })
                .catch(error => {
                    console.warn(error.message);
                });
        });
    }

    getRecentTitles(username, titleType) {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql('SELECT * FROM history WHERE titleType=? AND username=?;', [titleType, username], (tx, results) => {
                            // Get recent five additions to history
                            let len = results.rows.length;
                            if (len > 0) {
                                let recentTitles = [];
                                let lowerLimit = 0;
                                switch (len) {
                                    case len <= 5:
                                        lowerLimit = 0;
                                        break;
                                    case len > 6:
                                        lowerLimit = len - 6;
                                        break;
                                    default: null;
                                }

                                for (let i = len - 1; i >= lowerLimit; i--) {
                                    let row = results.rows.item(i);
                                    recentTitles.push({
                                        title: row.titleName,
                                        titleId: row.titleId,
                                        posterPath: row.titlePosterPath,
                                    });
                                }
                                resolve(recentTitles);
                            } else {
                                reject(false);
                            }
                        });
                    });
                })
                .catch(error => {
                    console.warn(error.message);
                });
        });
    }

    getTitleRecommendations(username, titleType) {
        return new Promise((resolve, reject) => {
            this.getRecentTitles(username, titleType)
                // Get last 5 entries to history table
                .then((result) => {
                    if (result.length > 2) {
                        // Proceed only if atleast 3 titles have been added to lists
                        let recoms = [];
                        let titleIds = [];
                        let getRecomPath = titleType === 'movie' ? 'getmr' : 'getsr';

                        SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                            .then(DB => {
                                // Iterate through recommendations for the 3 recently listed titles
                                for (let i = 0; i < 3; i++) {
                                    titleIds.push(result[i].titleId);
                                    fetch(`https://api-cine-digest.herokuapp.com/api/v1/${getRecomPath}/${titleIds[i]};`)
                                        .then(response => response.json())
                                        .then(jsonResponse => {
                                            let db = DB;

                                            db.transaction((tx) => {
                                                let index = 0;
                                                let upperLimit = jsonResponse.titleIds.length < 3 ?
                                                    jsonResponse.titleIds.length : 3;

                                                // Check if movie is already in a list
                                                tx.executeSql('SELECT * FROM \'history\' WHERE username=? AND titleId=? AND titleType=?;', [username, jsonResponse.titleIds[index], titleType], (tx, results) => {
                                                    let len = results.rows.length;
                                                    while (true) {
                                                        if (len === 0) {
                                                            // Movie is not in a list, can be recommended
                                                            recoms.push({
                                                                title: jsonResponse.titles[index],
                                                                titleId: jsonResponse.titleIds[index],
                                                                posterPath: `https://image.tmdb.org/t/p/original/${jsonResponse.posterPaths[index]}`,
                                                            });
                                                        }

                                                        if (index >= upperLimit) {
                                                            // Break if index crosses the upper limit
                                                            break;
                                                        }
                                                        ++index;
                                                    }
                                                });
                                            });
                                        })
                                        .catch(error => console.warn('404 for ' + titleIds[i]));
                                }
                                resolve(recoms);
                            })
                            .catch(error => {
                                console.warn(error);
                            });
                    } else {
                        reject(false);
                    }
                });
        });
    }

    deleteAllListItems(username, listType, titleType) {
        return new Promise((resolve, reject) => {
            SQLite.openDatabase({ name: 'CineDigest.db', createFromLocation: '~CineDigest.db', location: 'Library' })
                .then(DB => {
                    let db = DB;
                    console.warn('Database OPEN');
                    db.transaction((tx) => {
                        console.warn('Transaction started..');
                        tx.executeSql('DELETE FROM history WHERE username=? AND listType=? AND titleType=?;', [username, listType, titleType], (tx, results) => {
                            console.warn('DELETED all ' + listType + ' items for ' + username + '/' + titleType);
                            resolve(true);
                        });
                    })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    console.warn(error.message);
                });
        });
    }
}

const db = new Database();
export default db;
