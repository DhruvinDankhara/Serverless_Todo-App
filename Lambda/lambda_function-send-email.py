import json
import boto3
import os
sns_client = boto3.client('sns')

def lambda_handler(event, context):
    # TODO implement
    print(event)
    email = event['email']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']
    print(sns_topic_arn)
    topic_arn = sns_topic_arn
    endpoint = email
    protocol = 'email'  # Possible values: 'sms', 'email', 'http', 'https', 'application', 'lambda'

    try:
        
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol=protocol,
            Endpoint=endpoint
        )
        print(response)

        subscription_arn = response['SubscriptionArn']
        print(f"Subscription created with ARN: {subscription_arn}")

        return {
            'statusCode': 200,
            'body': 'Subscription created successfully.'
        }
    except Exception as e:
        print(f"Error creating subscription: {str(e)}")
        return {
            'statusCode': 500,
            'body': 'Failed to create subscription.'
        }