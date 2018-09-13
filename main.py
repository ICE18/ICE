import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from user import User
from project import Project

cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()











