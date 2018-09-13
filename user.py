import time

class User:
    def __init__(self, db, userName = None, userId = None, projectId = None, status = None):
        self.db = db
        self.userName = userName
        self.userId = userId
        self.projectId = projectId
        self.status = status

    def setNewUser(self):
        userDocRef = self.db.collection(u'users').document(self.userId)
        userDocRef.set({
            u'userName':self.userName,
            u'userId':self.userId,
            u'projectId':self.projectId,
            u'status':self.status,
            u'timeStamp': time.time()
        })
    
    def getAllUsers(self):
        usersRef = self.db.collection(u'users')
        docs = usersRef.get()
        for doc in docs:
            print(u'{} => {}'.format(doc.id, doc.to_dict()))

    def getUserByUserId(self,userId):
        usersRef = self.db.collection(u'users')
        query = usersRef.where(u'userId', u'==', userId)
        for documentSnapshot in query.get(): 
            print(documentSnapshot.to_dict()) 

    def getUserByProjectId(self,projectId):
        usersRef = self.db.collection(u'users')
        query = usersRef.where(u'projectId', u'==', projectId)
        for documentSnapshot in query.get(): 
            print(documentSnapshot.to_dict())

    def removeUserByUserId(self,userId):
        self.db.collection(u'users').document(userId).delete()

    def setStatusOffline(self, userId):
        docRef = self.db.collection(u'users').document(userId)
        docRef.update({
            u'status':0
        })

    def setStatusOnline(self, userId):
        docRef = self.db.collection(u'users').document(userId)
        docRef.update({
            u'status':1
        })
    
    def setStatusIdeal(self, userId):
        docRef = self.db.collection(u'users').document(userId)
        docRef.update({
            u'status':2
        })
