class Api {
    constructor(objectString) {
        this._url = objectString.baseUrl;
        this._token = localStorage.getItem('jwt');
        this._headers = {
            authorization: `Bearer ${this._token}`,
            'Content-type': 'application/json',
        }
    }

    //making a request to the server
    checkResponse = (res) => {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Frontend Api Error: 
    ${res.status} ${res.statusText}`);
        }
    };

    // 1. Loading user information from the server
    async getData() {
        const res = await fetch(`${this._url}/users/me`, {
            method: 'GET', //default
            headers: this._headers,
        })
        return this.checkResponse(res);
    }

    // 2. Loading cards from the server
    async getInitialCards() {
        const res = await fetch(`${this._url}/cards`, {
            method: 'GET',
            headers: this._headers,
        });
        return this.checkResponse(res);
    }

    // 3. Editing the profile
    async editUserInfo(name, about) {
        console.log ({name, about})
        const res = await fetch(`${this._url}/users/me`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: name,
                about: about,
            }),
        });
        return this.checkResponse(res);
    }

    // 4. Adding a new card
    async addPlaceCard({name, link}) {
        console.log (name, link)
        const res = await fetch(`${this._url}/cards`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(
                {name: name,
                link: link,}
            ),
        });
        return this.checkResponse(res);
    }

    // 7. Deleting a card
    async deleteCard(id) {
        console.log (id, "==deleted card id")
        const res = await fetch(`${this._url}/cards/${id}`, {
            method: 'DELETE',
            headers: this._headers,
        });
        return this.checkResponse(res);
    }

    // 8a. Adding likes
    async likeCard(id) {
        const res = await fetch(`${this._url}/cards/likes/${id}`, {
            method: 'PUT',
            headers: this._headers,
        });
        return this.checkResponse(res);
    }

    // 8b. Removing likes
    async dislikeCard(id) {
        const res = await fetch(`${this._url}/cards/likes/${id}`, {
            method: 'DELETE',
            headers: this._headers,
        });
        return this.checkResponse(res);
    }

    // 9. Updating profile picture
    async editAvatar(link) {
        const res = await fetch(`${this._url}/users/me/avatar`, {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({ avatar: link }),
        });
        return this.checkResponse(res);
    }
}

//**-->> API <<--*/
const api = new Api({
    // baseUrl: "https://around.nomoreparties.co/v1/group-12",
    // token: "b211c19a-1dd2-41b6-b48a-d98d5e63db67",
    // baseUrl: "https://api.sarawsmn.students.nomoredomainssbs.ru"
    baseUrl: "http://localhost:4000"
});

export default api;
