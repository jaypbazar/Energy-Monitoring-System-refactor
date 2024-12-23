import hashlib

def increment_id(prefix, id):
    '''
    A function that auto-increments the ID for adding new data.

    Parameters:
        prefix - the category of data to be adde(E=Equipment, O-Operators, C-Company, AL-Alerts)
        id - the current id number

    Returns:
        - the incremented ID prefixed by category
    '''
    if id is not None:
        num = id[-3:]

        num = int(num) + 1
        num = str(num).zfill(3)

        return prefix + num
    
    return prefix + '001'

def encrypt(password: str) -> str:
    '''
    A function that hash the passed argument usring sha-256 hashing.

    Parameters:
        password - the password of user to be encrypted

    Returns:
        - the encrypted password 
    '''
    return hashlib.sha256(password.encode()).hexdigest()