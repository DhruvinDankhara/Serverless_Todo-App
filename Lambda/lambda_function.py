import json
import boto3

USERS_TABLE_NAME = 'Users'
dynamoDB = boto3.resource('dynamodb')
users_table = dynamoDB.Table(USERS_TABLE_NAME)

def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = json.loads(event["body"])
    email = body['email']
    password = body['password']
    try:
        user = get_user_by_email(email)
        print(user)
        if not user:
            return {
                "statusCode" : 401,
                "body" : json.dumps({
                    'error': 'Invalid credentials' 
                })
            }
        password_match = check_password_hash(user['password'], password)
        print(password_match)
        if not password_match:
            return {"statusCode":400, "body":json.dumps({ 'error': 'Invalid credentials' })}
        return {
                'statusCode': 200,
                "body": json.dumps({
                    'message': 'Login successful',
                    'data': {
                        **user,
                        'password': '',
                    },
                    'token': "dummy token"
                })
        }
    except Exception as e:
        print("Error logging in:", str(e))
        return { 'statusCode': 500, "body":json.dumps({'error': 'Failed to log in' })}
    
def get_user_by_email(email):
    response = users_table.get_item(Key={'email': email})
    return response.get('Item')
    
def check_password_hash(hashed_password, password_attempt):
    # Convert the hashed password from bytes to string
    # hashed_password_str = hashed_password.decode('utf-8')
    # return bcrypt.checkpw(password_attempt.encode('utf-8'), hashed_password_str)
    return hashed_password == password_attempt

