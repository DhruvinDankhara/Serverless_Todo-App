import json
import boto3
import datetime

TODO_TABLE_NAME = 'Todos'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TODO_TABLE_NAME)

def lambda_handler(event, context):
    # TODO implement
    print(event)
    status = json.loads(event["body"])['status']
    querystring = event['queryStringParameters']
    todoId = querystring['todoId']
    try:
        
        response = update_todo_status(todoId, status)

        print(response['Attributes'])
        return {
          "statusCode" : 200,
          "body" : json.dumps({
                'status': True,
                'message': 'Task Updated successfully',
                'data': response['Attributes']
        })
        }

    except Exception as e:
        print("Error logging in:", str(e))
        return {
          "statusCode" : 500,
          "body" : json.dumps({ 'error': 'Failed to update todo' })
        }
        
def update_todo_status(todoId, status):
    response = table.update_item(
        Key={
            'id': todoId
        },
        UpdateExpression="SET #statusAlias = :bit, updatedAt = :updatedAt",
        ExpressionAttributeNames={
            "#statusAlias": "status"
        },
        ExpressionAttributeValues={
            ":bit": status,
            ":updatedAt": datetime.datetime.now().isoformat()
        },
        ReturnValues="ALL_NEW"
    )
    return response
