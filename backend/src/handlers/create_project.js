'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    // Basic validation
    if (!requestBody.name || requestBody.name.trim() === '') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Project name is required' })
        };
    }

    const timestamp = new Date().toISOString();
    const projectId = requestBody.projectId || "";

    const params = {
        TableName: process.env.PROJECTS_TABLE,
        Item: {
            projectId: projectId,
            project_name: requestBody.name,
            description: requestBody.description || '',
            createdAt: timestamp,
            members: []
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: 'Project created', projectId })
        };
    } catch (error) {
        console.error('Error creating project:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error })
        };
    }
};