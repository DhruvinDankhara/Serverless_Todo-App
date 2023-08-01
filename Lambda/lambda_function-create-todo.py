import json
import boto3
import datetime

TODO_TABLE_NAME = 'Todos'
dynamoDB = boto3.client('dynamodb')

def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = json.loads(event["body"])
    taskId = body['id']
    task = body['task']
    userId = body['userId']
    status = body.get('status', 'PENDING')
    try:
        dynamoDB.put_item(TableName=TODO_TABLE_NAME,Item= {
            'id': {
                'S':taskId
            },
            'task': {'S':task},
            'status': {'S': status},
            'userId': {'S': userId},
            'createdAt': { 'S': datetime.datetime.now().isoformat() },
            'updatedAt': { 'S': datetime.datetime.now().isoformat() },
        })
        
        print("Task added successfully")
        
        todos = get_todos_by_user_id(userId)
        print(todos)
        
        python_data = []
        for item in todos:
            python_data.append({
                'id': item["id"]["S"],
                'task': item["task"]["S"],
                'status':  item["status"]["S"],
                'userId': item["userId"]["S"],
                'createdAt': item["createdAt"]["S"],
                'updatedAt': item["updatedAt"]["S"],
            })
        print(python_data)
        return {
          "statusCode" : 200,
          "body" : json.dumps({
                'status': True,
                'data': python_data
          })
        }
    except Exception as e:
        print("Error creating todo:", str(e))
        return {
          "statusCode" : 500,
          "body" : json.dumps({ 'error': 'Failed to create todo' })
        }

        
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
