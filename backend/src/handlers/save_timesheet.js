'use strict';

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);

    const { projectName, timeframe, employeeName, day, hours } = requestBody;    

    if (!projectName || !timeframe || !employeeName || !day || typeof hours !== 'number') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing or invalid parameters' })
        };
    }

    const updateParams = {
        TableName: process.env.TIMESHEET_TABLE,
        Key: {
            project_name: projectName,
            timeframe: timeframe
        },
        UpdateExpression: 'SET #employees.#employeeName.#day = :hours',
        ExpressionAttributeNames: {
            '#employees': 'Employees',
            '#employeeName': employeeName, 
            '#day': day                   
        },
        ExpressionAttributeValues: {
            ':hours': hours
        },
        ReturnValues: 'ALL_NEW' 
    };

    try {
        const data = await DynamoDB.update(updateParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: 'Timesheet updated successfully', 
                timesheet: data.Attributes 
            })
        };
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException' || error.code === 'ResourceNotFoundException') {
             return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Timesheet not found or cannot be updated' })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: String(error?.message || error) })
        };
    }
};



module.exports.massUpdate = async (event) => {
    const requestBody = JSON.parse(event.body)

    // Formulation from the json parse
    const {projectName, timeframe, employees} = requestBody;

    if (!projectName || !timeframe || !employees || typeof employees !== 'object') {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing or invalid parameters' })
        };
    }

    // Basic validation to make sure everything is looking right
    for (const [emp, days] of Object.entries(employees)){
        if (days === null){
            employees[emp] = {};
            continue;
        }
        
        
        if (typeof days !== 'object' || days === null){
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Invalid Parameters'})
            }
        }
        for (const [day, hours] of Object.entries(days)){
            if (typeof hours !== 'number' || !Number.isFinite(hours)){
                return{ statusCode: 400, body: JSON.stringify({ message: `Invalid hours at ${emp}.${day}` }) };
            }
        }
    }

    const updateParams = {
        TableName: process.env.TIMESHEET_TABLE,
        Key: {
            project_name: projectName,
            timeframe: timeframe
        },
        UpdateExpression: 'SET #employees = :employees',
        ExpressionAttributeNames:{
            '#employees': 'Employees',
        },
        ExpressionAttributeValues:{
            ':employees' : employees
        },
        ReturnValues: 'ALL_NEW'
    }


    try {
        const data = await DynamoDB.update(updateParams).promise();

        return{
            statusCode: 200,
            body: JSON.stringify({
                message: "Timesheet mass update successfully",
                timesheet: data.Attributes
            })
        };
    }catch(error){
        if (error.code === 'ConditionalCheckFailedException' || error.code === 'ResourceNotFoundException') {
             return {
                statusCode: 404,
                body: JSON.stringify({ message: 'Timesheet not found or cannot be updated' })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: String(error?.message || error) })
        };
    }
}