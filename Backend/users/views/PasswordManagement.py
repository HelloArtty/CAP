import bcrypt 

#checking password strongness
def CheckPasswordStrength(password):
    isUpper = False
    isLower = False
    isDigit = False
    isSpecial = False
    
    specialArray = ['!','@','#','$','%','^','&','*']
    
    message = ''
    
    for i in password:
        if i.isupper():
            isUpper = True
        if i.islower():
            isLower = True
        if i.isdigit():
            isDigit = True
        if i in specialArray:
            isSpecial = True
            
    if isUpper & isLower & isDigit & isSpecial & len(password) >= 6:
        return None #password is strong : no message to be send
    if len(password) < 6:  
        message += "Password must be at least 6 characters long\n"  
    if not isUpper:
        message += "Password must contain at least one uppercase letter\n"
    if not isLower:
        message += "Password must contain at least one lowercase letter\n"
    if not isDigit:
        message += "Password must contain at least one number\n"
    if not isSpecial:
        message += "Password must contain at least one special character\n"
    #return required message
    return message

#hashing password
def HashingPassword (password):
    # converting password to array of bytes 
    bytes = password.encode('utf-8') 
    # generating the salt 
    salt = bcrypt.gensalt() 
    # Hashing the password 
    hash = bcrypt.hashpw(bytes, salt).decode('utf-8')
    return hash

def MatchingPassword (password,hashedPassword):
    # encoding user password to array of bytes
    userBytes = password.encode('utf-8') 
    hashedPassword = hashedPassword.encode('utf-8')
    # checking password 
    result = bcrypt.checkpw(userBytes, hashedPassword) 
    #return as boolean
    return result 

