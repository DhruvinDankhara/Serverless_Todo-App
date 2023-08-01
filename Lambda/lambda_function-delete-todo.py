import json
import boto3
import datetime

TODO_TABLE_NAME = 'Todos'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(TODO_TABLE_NAME)

def lambda_handler(event, context):
    # TODO implement
    print(event)
    querystring = event['queryStringParameters']
    todoId = querystring['todoId']
    try:
        
        response = delete_todo_by_id(todoId)
        print(response)
        # Process the delete response
        deleted_item = response.get('Attributes', {})


        return {
          "statusCode" : 200,
          "body" : json.dumps({
              'status': True,
              'message': 'Task deleted successfully',
              'data': deleted_item
          })
        }
    except Exception as e:
        print("Error deleting todo:", str(e))
        return {
          "statusCode" : 500,
          "body" : json.dumps({ 'error': 'Failed to delete todo' })
        }
        
def delete_todo_by_id(todoId):
    response = table.delete_item(
        Key={
            'id': todoId
        },
        ReturnValues="ALL_OLD"
    )
    return response
