import * as firebase from 'firebase'
//if export default,  import savePostDetails
//if export const, import {savePostDetails}


//reference: https://firebase.google.com/docs/database/web/read-and-write Update specific fields Part
const uploadPost = (type,newPostKey,details) => {
	console.log("upload report")
    return new Promise ((resolve, reject)=>{


	var updates = {};
	//upload full details to Reports/
	updates['/Posts/' + newPostKey] = details;
	//upload reportKey to authority/PostMade
	console.log("title",details.title);
	updates['/users/' + details.userid + '/PostsMade/'+newPostKey] = details.title;
	//upload reportKey to authorityName/ReportsReceived
	//updates['/users/' + details.authorityid + '/ReportsReceived/'+newPostKey] = details.title;
	firebase.database().ref().update(updates
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT savePostDetails")
      reject(error)
    })

    })
}

//this is for editing details
const editPostDetails = (type,objectID,param,paramDetail) => {
	console.log("upload details")
  return new Promise ((resolve, reject)=>{

    firebase.database().ref(type+"/"+objectID+"/").update({
		//description: details.description,
        //publicSetting : details.publicSetting,
        //userid : details.userid,
		//authorityid: details.authorityid,
		[param] : paramDetail
      }
    ).then(()=> {
      console.log("INSERTED")
      resolve(true)
    }).catch((error)=>{
	  console.log("ERROR AT savePostDetails")
      reject(error)
    })

    })

}

export {editPostDetails,uploadPost};
