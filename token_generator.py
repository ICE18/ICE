import secrets 
import string 
  
def generateId(name):
    alphabet = string.ascii_letters + string.digits 
    token = ''
    while True: 
        password = ''.join(secrets.choice(alphabet) for i in range(10)) 
        if (any(c.islower() for c in password) and any(c.isupper()  
        for c in password) and sum(c.isdigit() for c in password) >= 3): 
            token+=password 
            break
    return name+'-'+token


