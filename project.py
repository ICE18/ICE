import time

class Project:
    def __init__(self, db, projectName = None, projectId = None):
        self.db = db
        self.projectName = projectName
        self.projectId = projectId

    def setNewProject(self):
        projectDocRef = self.db.collection(u'projects').document(self.projectId)
        projectDocRef.set({
            u'projectName':self.projectName,
            u'projectId':self.projectId,
            u'timeStamp': time.time()
        })
    
    def getAllProjects(self):
        projectDocRef = self.db.collection(u'projects')
        docs = projectDocRef.get()
        for doc in docs:
            print(u'{} => {}'.format(doc.id, doc.to_dict()))

    def getProjectById(self,projectId):
        projectDocRef = self.db.collection(u'projects')
        query = projectDocRef.where(u'projectId', u'==', projectId)
        for documentSnapshot in query.get(): 
            print(documentSnapshot.to_dict()) 

    def getUserByProjectId(self,projectId):
        usersRef = self.db.collection(u'users')
        query = usersRef.where(u'projectId', u'==', projectId)
        for documentSnapshot in query.get(): 
            print(documentSnapshot.to_dict())