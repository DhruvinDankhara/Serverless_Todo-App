import json
import boto3
import datetime

TODO_TABLE_NAME = 'Todos'
dynamoDB = boto3.client('dynamodb')

def lambda_handler(event, context):
    # TODO implement
    print(event)
    # event = json.loads(event)
    querystring = event['queryStringParameters']
    userId = querystring['userId']
    try:
        
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
        sorted_data = sorted(python_data, key=lambda x: x['createdAt'], reverse=True)
        print(sorted_data)
        return {
          "statusCode" : 200,
          "body" : json.dumps({
                'status': True,
                'data': sorted_data
          })
        }
        
    except Exception as e:
        print("Error fetching todos:", str(e))
        return {
          "statusCode" : 500,
          "body" : json.dumps({ 'error': 'Failed to fetch todos' })
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
