try:
    from secrets import token_hex
except ImportError:
    from os import urandom
    def token_hex(nbytes=None):
        return urandom(nbytes).hex()

def generateId(name):
    token = token_hex(9) 
    return name+'-'+token

