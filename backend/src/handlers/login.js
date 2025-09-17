'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      username: requestBody.username
    }
  };

  try {
    const data = await dynamoDb.get(params).promise();

    if (!data.Item || data.Item.password !== requestBody.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid username or password' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};