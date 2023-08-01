import json
import boto3
import os
TODO_TABLE_NAME = 'Todos'
USERS_TABLE_NAME = 'Users'
dynamoDB = boto3.client('dynamodb')
sns_client = boto3.client('sns')

def send_email_to_sns(sns_topic_arn,subject, message):
    
    sns_client.publish(
        TopicArn=sns_topic_arn,
        Subject=subject,
        Message=json.dumps(message)
    )
    print("Email send succesfully")

def get_todos_by_user_id(userId):
    response = dynamoDB.scan(
        TableName=TODO_TABLE_NAME,
        FilterExpression='#userId = :v1',
        ExpressionAttributeValues={
            ':v1': {
                'S': userId
            }
        },
        ExpressionAttributeNames={
          '#userId': 'userId'
        }
    )
    return response.get('Items', [])
    
def get_user_by_user_id(userId):
    response = dynamoDB.scan(
        TableName=USERS_TABLE_NAME,
        FilterExpression='#userId = :v1',
        ExpressionAttributeValues={
            ':v1': {
                'S': userId
            }
        },
        ExpressionAttributeNames={
          '#userId': 'userId'
        }
    )
    print(response)
    return response.get('Items', [])
def lambda_handler(event, context):
    # TODO implement
    print(event)
    querystring = event['queryStringParameters']
    userId = querystring['userId']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']
    print(sns_topic_arn)
    topic_arn = sns_topic_arn
    protocol = 'email'  # Possible values: 'sms', 'email', 'http', 'https', 'application', 'lambda'

    try:
        user = get_user_by_user_id(userId)
        print("user",user[0]['email']['S'])
        endpoint = user[0]['email']['S']
        todos = get_todos_by_user_id(userId)
        python_data = []
        for item in todos:
            python_data.append({
                'task': item["task"]["S"],
                'status':  item["status"]["S"],
                'createdAt': item["createdAt"]["S"],
            })
        sorted_data = sorted(python_data, key=lambda x: x['createdAt'], reverse=True)
        print(sorted_data)
        send_email_to_sns(sns_topic_arn,"Your Tasks from Todo Application", sorted_data)
        return {
          "statusCode" : 200,
          "body" : json.dumps({
                'status': True,
                'data': "Email Sent Succesfully"
          })
        }
    except Exception as e:
        print(f"Error creating subscription: {str(e)}")
        return {
            'statusCode': 500,
            'body': 'Failed to create subscription.'
        }