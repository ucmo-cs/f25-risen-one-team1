'use strict';

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// This is what is being ran in the Lambda function
module.exports.handler = async (event) => {
    // This makes everything into a json object instead of a string
    const requestBody = JSON.parse(event.body);

    // Checks to see if those data are set if not returns back missing data
    if (requestBody.password == '' || requestBody.username == '' || requestBody.name == ''){
        return {
            statusCode: 400,
            body:JSON.stringify({message: 'Missing Data'}) 
        }
    }
    

    // parameters for inserting new items
    const params = {
        // Table name within parameters
        TableName: process.env.USERS_TABLE,

        // Item being inserted
        Item: {
            username: requestBody.username,
            password: requestBody.password,
            name: requestBody.name
        }
    };
    

    // Try and Catch Block
    try {

        // Send Request for Insert
        await dynamoDb.put(params).promise();

        // Return correct reponse
        return {
            statusCode : 201,
            body: JSON.stringify({message: 'User Created'})
        }

    } 
    // Catches the error and printing it off
    catch (error){
        console.error('Error:', error );
        return {
            statusCode:500,
            body:JSON.stringify({message: 'Internal server error',
                error: error
            })
        }
    }
}