import React, {Component} from 'react';
import * as firebase from 'firebase'

export const getUserDetails = (userid) => {
  //console.log(userid)
  return new Promise ((resolve)=>{
    return fetch('https://library-management-syste-771c4.firebaseio.com/users/'+userid+'.json')
        .then((response) => response.json())
        .then((responseJson) => {
          resolve(responseJson)
        })
        .catch((error) => {
          reject(error);
        });
  })
}
