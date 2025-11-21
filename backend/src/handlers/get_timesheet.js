'use strict'

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();


module.exports.handler = async (event) => {
    const requestBody = JSON.parse(event.body);
    
    // Grabbing the Specific Timesheet
    var params = {
        TableName: process.env.TIMESHEET_TABLE,
        Key:{
            project_name: requestBody.projectName,
            timeframe: requestBody.timeframe
        }
    };


    var returnValue = {
        Employees:{},
        project_name: requestBody.projectName,
        timeframe: requestBody.timeframe
    }


    // Trying to grab the timesheet
    try{
        const data = await DynamoDB.get(params).promise();

        // See if anything is brought back
        if(!data.Item){
            // Grab the employees within the other projects table
            params = {
                TableName: process.env.PROJECTS_TABLE,
                Key:{
                    project_name: requestBody.projectName
                }
            }

            // Try to make a connection with the Projects Table
            try{
                const result = await DynamoDB.get(params).promise()
                
                // See if it has Employees if not then we just return nothing is happening
                if (!result.Item?.Employees){
                    return {
                        statusCode: 401,
                        body: JSON.stringify({message: "No Employees Assigned to Project"})
                    }
                }

                // Grab the Employee Array
                const employeeArray = result.Item?.Employees;


                // Go through the entire Employee Array adding them to the return Value with nothing initialized
                employeeArray.map((employee) => {
                    returnValue.Employees[employee] = {}
                })

            }catch(error){
                throw new Error("Failed Connection to Projects table")
            }
        }
        else{
            returnValue = data.Item;
        }

        return {
            statusCode:200,
            body: JSON.stringify(returnValue)
        }
    }
    catch(error){
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error',error: String(error?.message || error)})
        };
    }
};