# "Around the U.S." App, Authorization + Registration

### Handled by RESTful API and back-end server

## Links to files and live page:

* [Complete React application on Github](https://github.com/SaraW011/react-around-api-full)
* [Live page hosting API.](https://www.sarawsmn.students.nomoredomainssbs.ru)


## React App Project Utilities

Project methods and technologies include:
- [x]  Authentication: HASHING passwords before saving to the database
- [x]  Validation Method: Mongoose Joi celebrate npm for validation of inbound server data
- [x]  Authorization and registration [validator module](https://www.npmjs.com/package/validator)
- [x]  Authorization: JSON web token (JWT) 
- [x]  Centralized error handling using middleware for error Implementation 
- [x]  Error Logs: logging of requests and errors saved to .log file
- [x]  CORS requests enabled, using the cors npm module 
- [x]  ESLint


## App functionality: 
- editing the profile
- adding and deleting cards
- adding and removing likes
- Checking users rights: user is not able to delete other users' cards or edit other users' profiles.


## Remote cloud-server deploying API: 
- [x]  Hosting on Google Cloud VM (Ubuntu, SSH)
- [x]  Dealing With Ports: back end - front end connection using NGINX
- [x]  Data Encryption: HTTPS Protocol via Certbot
- [x]  PM2 Process Management

![Preview App](frontend\src\images\Around-the-US.jpg)


<span style="color:green">Author: Sara Weissman, 2022 Yandex-Practicum Masterschool</span>