
// const path_signupAdmin={
//     "/api/auth/admin/signup": {
//         "post": {
//           "responses": {
//             "200": {
//               "description": "user created successfully",
//               "schema": {
//                 "$ref": "#/definitions/Users"
//               }
//             }
//           },
//           "tags": ["Users"],
//           "description": "Create user model",
//           "parameters": [
//             {
//               "name": "body",
//               "in": "body",
//               "description": "new User values",
//               "schema": {
//                 "$ref": "#/definitions/AddUsers"
//               }
//             }
//           ],
//         }
//       }
// }

// const path_signout={
//     "/api/auth/user/signout": {
//         "post": {
//           "responses": {
//             "200": {
//               "description": "user signOut successfully",
//             }
//           },  
//            "tags": ["Users"],
//         }
//       }
// }

const path_signin={
    "/api/auth/user/signin": {
        "post": {
          "responses": {
            "200": {
              "description": "user logged in successfully",
              "schema": {
                "$ref": "#/definitions/loginUsers"
              }
            }
          },
          "tags": ["Users"],
          "description": "login in user",
          "parameters": [
            {
              "name": "body",
              "in": "body",
              "description": "Login user",
              "schema": {
                "$ref": "#/definitions/loginUsers"
              }
            }
          ],
        }
      }
}

const path_updateUser={
    "/api/user/student/update/{id}": {
      "parameters": [
        {
          "name": "id",
          "in": "path",
          "required": true,
          "description": "ID of user that we want to find",
          "type": "string"
        },
        { name: "authorization", in: "header", type: "string", description: "auth token" }
      ],
        "put": {
          "responses": {
            "200": {
              "description": "user updated successfully",
              "schema": {
                "$ref": "#/definitions/UserUpdate"
              }
            }
          },
          "tags": ["Users"],
          "description": "Update user model",
          "parameters": [
            {
              "name": "body",
              "in": "body",
              "description": "Upadate User values",
              "schema": {
                "$ref": "#/definitions/UserUpdate"
              }
            }
          ],
        }
      }
}
const path_restPassword={
    "/api/auth/user/restPassword": {
      "parameters": [
        { name: "authorization", in: "header", type: "string", description: "auth token" }
      ],
        "post": {
          "responses": {
            "200": {
              "description": "password user updated successfully",
              "schema": {
                "$ref": "#/definitions/UserUpdate"
              }
            }
          },
          "tags": ["Users"],
          "description": "Update user model",
          "parameters": [
            {
              "name": "body",
              "in": "body",
              "description": "Upadate User values",
              "schema": {
                "$ref": "#/definitions/restPassword"
              }
            }
          ],
        }
      }
}
const path_resetEmail={
    "/api/auth/user/resetEmail": {
      "parameters": [
        { name: "authorization", in: "header", type: "string", description: "auth token" }
      ],
        "post": {
          "responses": {
            "200": {
              "description": "email user updated successfully",
              "schema": {
                "$ref": "#/definitions/UserUpdate"
              }
            }
          },
          "tags": ["Users"],
          "description": "Update user model",
          "parameters": [
            {
              "name": "body",
              "in": "body",
              "description": "Upadate User values",
              "schema": {
                "$ref": "#/definitions/updateEmail"
              }
            }
          ],
        }
      }
}


// const path_getAllStudent={
//     "/api/user/students": {
//         "get": {
//           "responses": {
//             "200": {
//               "description": "users getted successfully",
//               "schema": {
//                 "$ref": "#/definitions/Users"
//               }
//             }
//           },
//           "tags": ["Users"],
//           "description": "list all users",
//         }
//       }
// }
// const path_deleteUser={
//     "/api/user/userDelete/{id}": {
//         "parameters": [
//             {
//               "name": "id",
//               "in": "path",
//               "required": true,
//               "description": "ID of user that we want to find",
//               "type": "string"
//             },
//             { name: "authorization", in: "header", type: "string", description: "auth token" }
//           ],
//         "delete": {
//           "summary": "Delete user with given ID",
//           "responses": {
//             "200": {
//               "description": "users deleted successfully",
//             }
//           },
//           "tags": ["Users"],
//           "description": "delete selected user",
//         }
//       }
// }

const definition_model_UpdateUser={
  "UserUpdate": {
     
      "properties": {
        "role": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        },
        "firstName": {
          "type": "string"
        },
        "password": {
          "type": "string"
        },
        "email": {
          "type": "string"
        },
      }
  }
}
const definition_model_restPassword={
  "restPassword": {
      "properties": {
        "email": {
          "type": "string"
        },
      }
  }
}
const definition_model_updateEmail={
  "updateEmail": {
      "properties": {
        "newEmail": {
          "type": "string"
        },
      }
  }
}

// const definition_model_user={
//     "Users": {
//         "required": ["firstName", "lastName", "email","password","role"],
//         "properties": {
//           "role": {
//             "type": "string"
//           },
//           "lastName": {
//             "type": "string"
//           },
//           "firstName": {
//             "type": "string"
//           },
//           "password": {
//             "type": "string"
//           },
//           "email": {

//             "type": "string"

//           },
//         }
//     }
// }
const definition_model_login={
    "loginUsers": {
        "required": [ "email","password"],
        "properties": {

          "email": {
             "type": "string"
        },
        "password": {
          "type": "string"
        },
    }
}
}
// const definition_model_AddUser={
//     "AddUsers": {
//         "required": ["firstName", "lastName", "email","password","role","password_confirmation"],
//         "properties": {
//           "role": {
//             "type": "string"
//           },
//           "lastName": {
//             "type": "string"
//           },
//           "firstName": {
//             "type": "string"
//           },
//           "password": {
//             "type": "string"
//           },
//           "password_confirmation": {
//             "type": "string"
//           },
//           "email": {
//               "type": "string"
           
//           },
//         }
//     }
// }

module.exports ={
    swagger: {
    "swagger": "2.0",
    "info": {
      "version": "1.0.0", //version of the OpenAPI Specification
      "title": "Swagger for my CRUD Project ",
      "description": "My Application APIs",
      "license": {
        "name": "MIT",
        "url": "http://localhost:5000"
      }
    },
    "host": "localhost:5000",
    "basePath": "/",
    "securityDefinitions": {
        "bearerAuth": {
          "type": 'apiKey',
          "name": 'Authorization',
          "scheme": 'bearer',
          "in": 'header',
        }
    },
    "tags": [
      {
        "name": "Users",
        "description": "user API"
      }
    ],
    "schemes": ["http"],
    "consumes": ["application/json"],
    "produces": ["application/json"],
    "apis":["./routes/*.js"],
    "paths": {
        // "/api/auth/admin/signup": path_signupAdmin["/api/auth/admin/signup"],
        // "/api/user/students": path_getAllStudent[ "/api/user/students"],
        // "/api/user/userDelete/{id}": path_deleteUser[ "/api/user/userDelete/{id}"],
        "/api/user/student/update/{id}": path_updateUser[ "/api/user/student/update/{id}"],
        "/api/auth/user/restPassword": path_restPassword[ "/api/auth/user/restPassword"],
        "/api/auth/user/resetEmail": path_resetEmail[ "/api/auth/user/resetEmail"],
        "/api/auth/user/signin": path_signin[ "/api/auth/user/signin"],
        // "/api/auth/user/signout": path_signout[ "/api/auth/user/signout"],

      },
      "definitions": {
        // "Users": definition_model_user["Users"],
        // "AddUsers": definition_model_AddUser["AddUsers"],
        "loginUsers": definition_model_login["loginUsers"],
        "UserUpdate": definition_model_UpdateUser["UserUpdate"],
        "restPassword": definition_model_restPassword["restPassword"],
        "updateEmail": definition_model_updateEmail["updateEmail"],

        },
        "Users": {
          "type": "array",
          "$ref": "#/definitions/Users"
        }
      }
  }


  

