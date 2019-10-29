import React, {Component} from 'react';
import * as firebase from 'firebase'


export const moveFirebase= (userid, reportKey)=> {

  oldRef = firebase.database().ref('users/'+userid+'/ReportsMade/'+ reportKey)
  newRef = firebase.database().ref('users/'+userid+'/ReportsCompleted/')

     return new Promise((resolve, reject) => {
          oldRef.once('value').then(snap => {
               return newRef.update({
                 [reportKey]:snap.val()
               });
          }).then(() => {
               return oldRef.remove()
          }).then(() => {
               console.log('Done!');
               resolve();
          }).catch(err => {
               console.log(err.message);
               reject();
          });
     })
}

export const moveAuthFirebase= (userid, reportKey)=> {

  oldRef = firebase.database().ref('users/'+userid+'/ReportsReceived/'+ reportKey)
  newRef = firebase.database().ref('users/'+userid+'/ReportsReceivedCompleted/')

     return new Promise((resolve, reject) => {
          oldRef.once('value').then(snap => {
               return newRef.update({
                 [reportKey]:snap.val()
               });
          }).then(() => {
               return oldRef.remove()
          }).then(() => {
               console.log('Done!');
               resolve();
          }).catch(err => {
               console.log(err.message);
               reject();
          });
     })
}

export const initUser = (details) => {
  //console.log(details.name)
  return new Promise ((resolve, reject)=>{
    firebase.database().ref('users/'+details.userid).set({
        name: ' ',
        Name: ' ',
        email : details.email,
        photoURL : ' ',
        userid : details.userid,
        gender: ' ',
        phone : ' ',
        age : ' ',
        city : ' ',
        address: ' ',
        lastActive: ' ',
        birthday: ' ',
        points: 200,
        details: ' ',
        authority:'undefined',
      }
    ).then(()=> {
      firebase.database().ref('users/'+details.userid+'/Subscribed').set({
        Subscribed: 0,
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
      reject(error)
    })
    }).catch((error)=>{
      reject(error)
    })
    })
}

export const saveDetails = (details) => {
  //console.log(details.name)
  return new Promise ((resolve, reject)=>{
    firebase.database().ref('users/'+details.userid).update({
        name: details.name,
        email : details.email,
        photoURL : details.photoURL,
        userid : details.userid,
        /*
        gender: 'details.gender',
        phone : 'details.phone',
        age : 'details.age',
        address: 'details.address',
        lastActive: 'details.lastActive',
        birthday: 'details.birthday',
        */
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
      reject(error)
    })
    })
}

export const updateDetail = (param, detail, userid) => {
  return new Promise ((resolve, reject)=>{
    firebase.database().ref('users/'+ userid).update({
        [param] : detail
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
    })
  })
}

export const updateAuthDetail = async(param, detail, userid) => {
  const user = await getUserDetails(userid)
  return new Promise ((resolve, reject)=>{
    if (user.authority === true){
      firebase.database().ref('authority/'+ userid).update({
          [param] : detail
        }
      ).then(()=> {
        console.log("INSERTED")
        resolve(true)
      }).catch((error)=>{
      })
    }else{
      resolve(true)
    }
  })
}

export const getUserDetails = (userid) => {
  //console.log(userid)
  return new Promise ((resolve)=>{
    firebase.database().ref('users/'+userid).once('value',(data)=>{
        //console.log(data.val())
        resolve(data.val())
        console.log(data.val())
    })
  })
}

export const addClaim = (userid, followid) =>{
  return new Promise ((resolve)=>{
    firebase.database().ref('users/'+userid+'/Claim').update({
      [followid]: firebase.database.ServerValue.TIMESTAMP,
    }).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
      console.log(error)
    })
  })
}

export const deleteClaim = (userid, followid) =>{
  return new Promise ((resolve)=>{
    ref = firebase.database().ref('users/'+userid+'/Claim/'+followid)
    ref.remove().then(()=> {
      console.log("INSERTED")
      resolve(true)
    })
  })
}

export const searchClaim = (userid, search) => {
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('users/'+userid+'/Claim').orderByKey().startAt(search).endAt(search+"\uf8ff")
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      childKey.push(childSnapshot.val());
      })
      resolve(childKey[0]);
    })
  })
}

export const onFollowPress = (userid, followid) =>{
  var n
  console.log("Press")
  return new Promise ((resolve)=>{
  firebase.database().ref('users/'+userid+'/Subscribed/Subscribed').once('value',(data)=>{
    n = data.val()
    console.log(n)
    firebase.database().ref('users/'+userid+'/Subscribed/').update({
      [n+1] : followid,
      Subscribed: n+1,
    }).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
      console.log(error)
      })
    })
  })
}

export const getClaimDetails = async(myUserid) =>{
  var userid
  var users = []
  //console.log("test")
  userid = await getClaimId(myUserid)
  //console.log(userid.length)
  for (var i=0; i<userid.length;i++)
  {
    users.push(await getUserDetails(userid[i]))
  }
  //console.log(users)
  return new Promise ((resolve)=>{
    resolve(users)
  })
}

export const getClaimId = (userid) => {
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('users/'+userid+'/Claim')
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var currentTime = Date.now()
        var activeTime = childSnapshot.val()
        var offsetTime_ms = currentTime-activeTime
        var offsetTime_s = offsetTime_ms/1000
        var offsetTime_min = offsetTime_s/60
        if (offsetTime_min < 15){
          childKey.push(childSnapshot.key);
        }
      })
      resolve(childKey);
    })
  })
}



export const getFollowDetails = async(myUserid) =>{
  var userid
  var users = []
  //console.log("test")
  userid = await getFollowId(myUserid)
  //console.log(userid.length)
  for (var i=0; i<userid.length;i++)
  {
    users.push(await getUserDetails(userid[i]))
  }
  //console.log(users)
  return new Promise ((resolve)=>{
    resolve(users)
  })
}

export const getFollowId = async(myUserid) => {
  var user, n
  var userid = []
  var count = 0
  var users = []
  var detail = []
  //userid [0] = "Hello"
  return new Promise ((resolve)=>{
    firebase.database().ref('users/' +myUserid + '/Subscribed/Subscribed').once('value',(data)=>{
      n = data.val()
      if (n == 0){
        resolve('')
      }
      for (var i=1; i<=n; i++)
      {
            firebase.database().ref('users/' +myUserid + '/Subscribed/'+ i).once('value',(data)=>{
            userid.push(data.val().toString());
          }).then(()=> {
            //console.log(count)
            count = count + 1
            if (count ==n)
            //{console.log(userid)
              resolve(userid)
            //}
          }).catch((error)=>{
            //console.log(error)
          })
      }
    })
  })
}

export const checkFollowStatus = (userid, followid) => {
    var childKey
    var childData
    return new Promise ((resolve)=>{
    var ref= firebase.database().ref('users/'+userid+'/Subscribed').orderByValue().equalTo(followid)
    ref.once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      childKey = childSnapshot.key;
      childData = childSnapshot.val();
    });
    console.log(childData);
      if (childKey==null)
      {
        resolve(0)
        console.log("0")
      }else{
        resolve(childKey)
        console.log(childKey)
      }
    })
  })
}

export const searchAuth = (search) => {
  const searchText =  `${search.toUpperCase()}`
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('authority').orderByChild('Name').startAt(searchText).endAt(searchText+"\uf8ff");
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      childKey.push(childSnapshot.key);
      })
      resolve(childKey);
    })
  })
}

export const getAllAuth = () => {
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('authority');
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      childKey.push(childSnapshot.key);
      })
      resolve(childKey);
    })
  })
}

export const searchPost = (search) => {
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('Reports').orderByKey().startAt(search).endAt(search+"\uf8ff");
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      childKey.push(childSnapshot.val());
      })
      resolve(childKey);
    })
  })
}

export const searchSessionId = (sessionId) => {
  var childKey = []
  return new Promise ((resolve)=>{
    var ref= firebase.database().ref('sessionId').orderByKey().startAt(sessionId).endAt(sessionId+"\uf8ff");
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
      childKey.push(childSnapshot.val());
      })
      resolve(childKey);
    })
  })
}

export const updateSessionId = (sessionId, userid) => {
  var childKey = []
  return new Promise ((resolve, reject)=>{
    firebase.database().ref('sessionId/').update({
        [sessionId]: userid,
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
      reject(error)
    })
  })
}

export const deleteAuth = (userid, followid) =>{
  var childKey
  var childData
  var n, tempid
  return new Promise ((resolve)=>{
    firebase.database().ref('users/' +userid + '/Subscribed/Subscribed').once('value',(data)=>{
      n = data.val()
      firebase.database().ref('users/' +userid + '/Subscribed/'+ n).once('value',(data)=>{
      tempid = data.val()
      }).then(()=> {
        var ref= firebase.database().ref('users/'+userid+'/Subscribed').orderByValue().equalTo(followid)
        ref.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childKey = childSnapshot.key;
          childData = childSnapshot.val();
          console.log(childKey)
          console.log(tempid)
          firebase.database().ref('users/'+userid + '/Subscribed/').update({
              [childKey] : tempid,
              Subscribed : (n-1),
              [n] : null,
            }).then(()=> {
              resolve(true)
          })
        });
      })
    });
  })
})
}
