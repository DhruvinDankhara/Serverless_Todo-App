import json
import boto3
import os

USERS_TABLE_NAME = 'Users'
dynamoDB = boto3.resource('dynamodb')
lambda_client = boto3.client('lambda')
users_table = dynamoDB.Table(USERS_TABLE_NAME)

def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = json.loads(event["body"])
    Send_verification_mail = os.environ['SendEmailFunction']
    try:
        user_exists = get_user_by_email(body["email"])
        print(user_exists)
        if user_exists:
            return {'error': 'User with this email already exists' }
        users_table.put_item(TableName=USERS_TABLE_NAME,Item={
            'email': body['email'],
            'password': body['password'],
            'firstName':body['firstName'],
            'lastName': body['lastName'],
            'userId': body['userId'],
            'IsEmailVerified': False
        })

        # Send Verification mail
        lambda_client.invoke(
            FunctionName= Send_verification_mail,
            InvocationType='Event',
            Payload = json.dumps({'email': body["email"]})
        )
        
        
        inserted_data = get_user_by_email(body["email"])
        print(inserted_data)
        return {
          "statusCode" : 200,
          "body" : json.dumps({
                'status': True,
                'message': 'User created successfully',
                'data': inserted_data
        })
        }
    except Exception as e:
        print("Error logging in:", str(e))
        return {
          "statusCode" : 401,
          "body" : json.dumps({
              'error': 'Failed to sign up' 
          })
        }
    
def get_user_by_email(email):
    response = users_table.get_item(Key={'email': email})
    return response.get('Item')