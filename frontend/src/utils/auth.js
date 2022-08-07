class Auth {
    constructor(object) {
        this._BASE_URL = object.BASE_URL;
    }

    checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Auth Error Type: 
    ${res.status} ${res.statusText}`);
        }
    }

    signup(email, password) {
        return fetch(`${this._BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then(this.checkResponse);
    }

    signin(email, password) {
        return fetch(`${this._BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        })
            .then(this.checkResponse)
            .then((data) => {
                localStorage.setItem('jwt', data.jwt);
                return data;
            });
    }

    checkToken(token) {
        console.log(token);
        return fetch(`${this._BASE_URL}/users/me`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`,
            },
        })
            .then(this.checkResponse)
            .then((data) => data);
    }
}

const auth = new Auth({
    BASE_URL: "https://api.sarawsmn.students.nomoredomainssbs.ru"
    // BASE_URL: 'http://localhost:3000'
});

export default auth;
