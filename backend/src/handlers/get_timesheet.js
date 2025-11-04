'use strict'

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();


module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    
    // Grabbing the Specific Timesheet
    const params = {
        TableName: process.env.TIMESHEET_TABLE,
        Key:{
            project_name: requestBody.projectName,
            timeframe: requestBody.timeframe
        }
    };


    // Trying to grab the timesheet
    try{
        const data = await DynamoDB.get(params).promise();

        if(!data.Item){
            return {
                statusCode: 401,
                body: JSON.stringify({message: "No visible Timesheets"})
            }
        }

        return {
            statusCode:200,
            body: JSON.stringify(data.Item)
        }
    }
    catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error',error: String(error?.message || error)})
        };
    }
};