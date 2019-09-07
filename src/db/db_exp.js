import Snackbar from '../util/Snackbar';
import { onSignIn, onSignOut } from '../auth/auth';

class Database {
    mailer(email, subject, mail) {
        return new Promise((resolve, reject) => {
            const payload = {
                email,
                subject,
                mail,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/mailer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status !== 'OP-NOT-DONE') {
                        console.warn('Mail sent to ' + email);
                        resolve(true);
                    } else {
                        reject(false);
                    }
                })
                .catch(error => console.warn(error.message));
        });
    }

    getUser(uuid) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/getUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status !== 'NOT-FOUND') {
                        resolve({
                            username: jsonResponse.username,
                            email: jsonResponse.email,
                            name: jsonResponse.name,
                            uuid: jsonResponse.uuid,
                            validatedStatus: jsonResponse.validatedStatus,
                        });
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

    addUser(username, email, password, name) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                password,
                email,
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
                        resolve({
                            username,
                            password,
                            email,
                            name,
                            uuid: jsonResponse.uuid,
                        });
                    } else {
                        console.warn('SQL rejected alright!');
                        reject({
                            status: jsonResponse.status,
                            message: jsonResponse.message,
                        });
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    validateUser(username, email) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                email,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
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
            fetch('http://api-cine-digest.herokuapp.com/api/v1/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve({
                            username,
                            password,
                            uuid: jsonResponse.uuid,
                        });
                    } else if (jsonResponse.status === 'NOT-VALIDATED') {
                        reject({
                            status: jsonResponse.status,
                            email: jsonResponse.email,
                            uuid: jsonResponse.uuid,
                        });
                    } else {
                        reject({
                            status: jsonResponse.status,
                        });
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    reject(error.message);
                });
        });
    }

    updateProfile(username, uuid, newName, newUsername, newEmail) {
        return new Promise((resolve, reject) => {
            // console.warn('u, n, e!');
            console.warn(newUsername + ' username');
            console.warn(newName + ' name');
            console.warn(newEmail + ' email');

            if (newUsername !== null && newName !== null && newEmail !== null) {
                // u, n, e
                const payload = {
                    uuid,
                    newUsername,
                    newName,
                    newEmail,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                            // Update USER_KEY stored in AsyncStorage
                            onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                            onSignIn(newUsername).then(() => {
                                console.warn('Set USER_KEY ' + newUsername);
                                Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                            });
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status');
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername !== null && newName !== null && newEmail === null) {
                // u, n
                const payload = {
                    uuid,
                    newUsername,
                    newName,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                            // Update USER_KEY stored in AsyncStorage
                            onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                            onSignIn(newUsername).then(() => {
                                console.warn('Set USER_KEY ' + newUsername);
                                Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                            });
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername !== null && newName === null && newEmail !== null) {
                // u, e
                const payload = {
                    uuid,
                    newUsername,
                    newEmail,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                            // Update USER_KEY stored in AsyncStorage
                            onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                            onSignIn(newUsername).then(() => {
                                console.warn('Set USER_KEY ' + newUsername);
                                Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                            });
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername === null && newName !== null && newEmail !== null) {
                // n, e
                const payload = {
                    uuid,
                    newName,
                    newEmail,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername !== null && newName === null && newEmail === null) {
                // u
                const payload = {
                    uuid,
                    newUsername,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                            // Update USER_KEY stored in AsyncStorage
                            onSignOut().then(() => console.warn('Removed USER_KEY ' + username));
                            onSignIn(newUsername).then(() => {
                                console.warn('Set USER_KEY ' + newUsername);
                                Snackbar.showSnackBar('Refresh Movies and Shows sections', 'always', '#3fc380', 'ok');
                            });
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername === null && newName !== null && newEmail === null) {
                // n
                const payload = {
                    uuid,
                    newName,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            } else if (newUsername === null && newName === null && newEmail !== null) {
                // e
                const payload = {
                    uuid,
                    newEmail,
                };
                const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                fetch('http://api-cine-digest.herokuapp.com/api/v1/updateProfile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formBody,
                })
                    .then(response => response.json())
                    .then(jsonResponse => {
                        if (jsonResponse.status === 'success') {
                            resolve(true);
                        } else {
                            console.warn(jsonResponse.status + ' is the reject status')
                            reject({
                                status: jsonResponse.status,
                                message: jsonResponse.message,
                            });
                        }
                    })
                    .catch(error => {
                        console.warn(error.message);
                        reject(error.message);
                    });
            }
        });
    }

    changePassword(username, newPassword) {
        return new Promise((resolve, reject) => {
            const payload = {
                username,
                newPassword,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/changePassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status === 'success') {
                        resolve(true);
                    } else {
                        reject(jsonResponse.status);
                    }
                })
                .catch(error => {
                    console.warn(error.status);
                    reject(error);
                });
        });
    }

    addMovieToWishList(request) {
        // Inserts into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                uuid: request.uuid,
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
                uuid: request.uuid,
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
                uuid: request.uuid,
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
                uuid: request.uuid,
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
                uuid: request.uuid,
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
        // Removes into 'History' Table
        return new Promise((resolve, reject) => {
            const payload = {
                uuid: request.uuid,
                listType: request.listType,
                titleId: request.titleId,
                titleType: request.titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/removeFromList', {
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

    getHistory(uuid, listType, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
                listType,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
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

    getStats(uuid) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/getStats', {
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

    isInList(listType, titleId, uuid, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
                listType,
                titleId,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
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

    getRecentTitles(uuid, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/getRecentTitles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            })
                .then(response => response.json())
                .then(jsonResponse => {
                    if (jsonResponse.status !== 'NOT-FOUND') {
                        return resolve(jsonResponse);
                    } else {
                        return reject(false);
                    }
                })
                .catch(error => {
                    console.warn(error.message);
                    return reject(error.message);
                });
        });
    }

    getTitleRecommendations(uuid, titleType) {
        return new Promise((resolve, reject) => {
            this.getRecentTitles(uuid, titleType)
                // Get last 5 entries to history table
                .then((result) => {
                    if (result.length > 2) {
                        // Proceed only if atleast 3 titles have been added to lists
                        let recoms = [];
                        let titleIds = [];
                        let getRecomPath = titleType === 'movie' ? 'getmr' : 'getsr';

                        // Iterate through recommendations for the 3 recently listed titles
                        for (let i = 0; i < 3; i++) {
                            titleIds.push(result[i].titleId);
                            fetch(`https://api-cine-digest.herokuapp.com/api/v1/${getRecomPath}/${titleIds[i]};`)
                                .then(response => response.json())
                                .then(jsonResponse => {
                                    let index = 0;
                                    let upperLimit = jsonResponse.titleIds.length < 3 ?
                                        jsonResponse.titleIds.length : 3;
                                    const payload = {
                                        uuid,
                                        titleType,
                                        titleId: jsonResponse.titleIds[index],
                                    };
                                    const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
                                    // Check if movie is already in a list
                                    fetch('http://api-cine-digest.herokuapp.com/api/v1/isInList', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                        body: formBody,
                                    })
                                        .then(response => response.json())
                                        .then(jsonRes => {
                                            while (true) {
                                                if (jsonRes.status === 'NOT-FOUND') {
                                                    // Title is not in any list of the user                                    
                                                    recoms.push({
                                                        title: jsonResponse.titles[index],
                                                        titleId: jsonResponse.titleIds[index],
                                                        posterPath: jsonResponse.posterPaths[index],
                                                    });
                                                }
                                                if (index >= upperLimit) {
                                                    // Break if index crosses the upper limit
                                                    break;
                                                }
                                                ++index;
                                            }
                                            // Recommend non-repeating titles only
                                            recoms = recoms.filter((item, pos) => {
                                                return recoms.indexOf(item) === pos;
                                            });
                                        })
                                        .catch(error => {
                                            console.warn(error);
                                        });
                                })
                                .catch(error => console.warn('404 for ' + titleIds[i]));
                        }
                        resolve(recoms);
                    } else {
                        reject(false);
                    }
                });
        });
    }

    deleteAllListItems(uuid, listType, titleType) {
        return new Promise((resolve, reject) => {
            const payload = {
                uuid,
                listType,
                titleType,
            };
            const formBody = Object.keys(payload).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key])).join('&');
            fetch('http://api-cine-digest.herokuapp.com/api/v1/removeFromList', {
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
}

const db = new Database();
export default db;
