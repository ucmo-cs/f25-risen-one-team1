'use strict';

const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
    // Make the paramaters for the request
    const params = {
        // Table name
        TableName: process.env.PROJECTS_TABLE,
        // Grabbing just project_names
        ProjectionExpression: "project_name"
    };

    // try catch

    try {
        const data = await DynamoDB.scan(params).promise();
        // console.log(data)
        
        if (data.Count == 0){
            console.log("No items")

            return {
                statusCode: 401,
                body: JSON.stringify({message: 'No Projects Found'})
            }
        }
        const gottenProjects = data.Items
        let projects = []


        gottenProjects.map(project => (
            projects.push(project?.project_name)
        ))
        return{
            statusCode: 200,
            body: JSON.stringify({projects})
        }
    
    }catch(error){

        return{
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error',error:error?.message})
        }
    }

    // 





}
