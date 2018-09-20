let addProject = (projectName, projectId) => {
    var db = firebase.firestore();

    db.collection("projects").add({
        name: projectName,
        last: projectId,
        timestamp: new Date().getTime()
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

}