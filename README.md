Contents
   # Setting Up a Serverless Angular Project
   # Branch Management Guidelines
   # Structure

# Setting Up a Serverless Angular Project

This guide will help you set up a serverless application with an Angular frontend and a serverless backend hosted on AWS using AWS Lambda and DynamoDB.

## Prerequisites

Before you start, ensure you have the following:

- **AWS Account**: Create an account on [AWS](https://aws.amazon.com/) if you don’t have one.
- **AWS CLI**: Install and configure the AWS Command Line Interface with your account details. Instructions can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
- **AWS CLI CONFIGURE**: set the region for AWS CLI to us-east-1.
- **Node.js and npm**: Install Node.js and npm from [here](https://nodejs.org/).
- **Angular CLI**: Install the Angular Command Line Interface. Instructions are available [here](https://angular.dev/tools/cli).

## Inital Setup

### Step 1: Setup the Repository

Download the project repository created for your class to your local machine if not already done.

- Command: `git clone https://github.com/ucmo-cs/Senior_Project_Team_Name.git`

Download this base project repo.

- Command: `git clone https://github.com/risen-one-technologies/senior-project-template.git`

Copy the contents to your project folder and push them to your repo.

- Command: `cp LICENSE /path/to/your/Senior_Project_Team_Name`
- Command: `cp README.md /path/to/your/Senior_Project_Team_Name`
- Command: `cp -r backend/ /path/to/your/Senior_Project_Team_Name`
- Command: `cp -r frontend/ /path/to/your/Senior_Project_Team_Name`
- Command: `cd /path/to/your/Senior_Project_Team_Name`
- Command: `git add .`
- Command: `git commit -m "Initial commit"`

## Backend Setup

### Step 1: Navigate to the backend folder

Navigate to the backend folder.

- Command: `cd backend`

### Step 2: Install Serverless Framework

Install the Serverless Framework Version 3.38.0, which will help you manage the serverless backend.
IMPORTANT: do not use version ^4. this will complicate the process and requre integration with Serverless website

- Command: `npm install -g serverless@3.38.0`

### Step 3: Install Project Dependencies

Install the necessary dependencies.

- Command: `npm install`

### Step 4: Configure Serverless Framework

1. Open the `serverless.yml` file in the backend directory.
2. Update the file with your AWS account details and configure the DynamoDB table if needed.
3. Ensure the table name in `serverless.yml` matches the table name used in your Lambda functions.

### Step 5: Deploy the Backend

Deploy the serverless application to AWS. This will set up the necessary AWS Lambda functions and DynamoDB tables.

- Command: `serverless deploy`

After deployment, note the API endpoints provided by the Serverless Framework.

### Step 6: Set Up Login Functionality

Follow these steps to configure the login functionality:

1. **Create the DynamoDB Table**:
   - The table is created with the name `users` and it has `username` as the primary key. This is defined in the `resources` section of the `serverless.yml` file.

2. **Add Users to the Table**:
   - Sample users are added to the DynamoDB table with predefined usernames and passwords. This ensures that you have users to test the login functionality.

3. **Lambda Function for Login**:
   - The Lambda function defined in `src/handlers/login.js` handles the login requests. It checks if the provided username and password match an existing user in the DynamoDB table.

### Lambda Function Code Explanation:

The Lambda function is responsible for handling login requests. Here's a breakdown of the code in [login.js](./backend/src/handlers/login.js):
- The function uses the AWS SDK to interact with DynamoDB.
- It reads the username and password from the request body.
- It retrieves the user from the DynamoDB table using the username.
- It checks if the user exists and if the password matches.
- It returns a success message if the login is successful or an error message if the login fails.
  
## Frontend Setup

### Step 1: Navigate to the frontend folder

Navigate to the frontend folder

- Command: `cd ../frontend`

### Step 2: Install Angular Project Dependencies

Navigate to the frontend directory of the project and install the necessary dependencies.

- Command: `npm install`

### Step 3: Develop and Build the Frontend

#### Run the Development Server

Start the development server to preview the Angular application locally.

- Command: `ng serve`

#### Build the Project

Build the project to prepare it for deployment. The build artifacts will be stored in the `dist/frontend` directory.

- Command: `ng build --prod`

### Step 4: Deploy the Frontend

#### Configure Backend Integration

Ensure that the build output directory (`dist/frontend`) is correctly set up in the backend serverless configuration. Refer to the backend README for more details on deploying the frontend with the backend.

#### Deploy to AWS S3

1. Create an S3 Bucket

Go to the AWS Management Console and navigate to the S3 service. Create a new bucket for your frontend files.

2. Upload Build Artifacts

After building the Angular project, upload the contents of the `dist/frontend` directory to the S3 bucket.

3. Configure Bucket Permissions

Set the appropriate permissions for the S3 bucket to allow public access to the files.

4. Enable Static Website Hosting

Enable static website hosting for the S3 bucket.

### Accessing Your Application

After deploying the frontend to S3 and setting up the backend on AWS, you can access your application through the S3 bucket URL provided in the static website hosting settings.

## Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs)
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Angular CLI Documentation](https://angular.io/cli)
- [Angular Documentation](https://angular.io/docs)

Following these steps will help you set up and deploy a serverless Angular application with a backend hosted on AWS. If you encounter any issues, refer to the additional resources provided for detailed documentation.

# Branch Management Guidelines
## Purpose
Branch management helps maintain code quality, facilitate parallel development, and streamline the integration process in GitHub repositories.

## Main Branches
main : The primary branch where production-ready code resides. (All presentations should be done from here)
develop: A branch for integration of features, where code is merged before going into main.

## Feature Branches
Branch Naming: Use descriptive names like feature/new-login-system or bugfix/fix-404-error.
Creation: Branch off from develop for new features or bug fixes.
Lifetime: Delete after merging if no longer needed.

## Workflow
Create a Branch: 
For new features or bugs, branch from develop.
Example: git checkout -b feature/new-feature develop
Work on Your Branch:
Make commits with clear messages.
Push your branch to GitHub.
Open a Pull Request:
From your feature branch to develop.
Include a description of changes, related issues, and screenshots if applicable.
Code Review:
Peers review the code before merging.
Address comments and feedback.
Merge to develop:
After approval, merge your branch into develop.
Use merge commits or squash commits as per project convention.
Update main:
Periodically merge develop into main for release.

## Rules
Do not commit directly to main or develop.
Use Pull Requests for all changes going into develop or main.
Keep branches short-lived to avoid divergence.


# Structure
## Frontend (Angular):
- Components: These are the building blocks of the UI. Each component in Angular represents a part of the user interface and interacts with the user. For instance, a form component might collect user data.
- Services: Angular services are used to share code across components. Here, you'd have a service that handles HTTP requests to the backend. This service would use Angular's HttpClient to send and receive data from the API.

## Backend (AWS Lambda & DynamoDB):
- API Gateway: This AWS service acts as the entry point for API requests from the Angular application. It routes HTTP requests to the appropriate Lambda function.
- AWS Lambda Functions: These are serverless compute services that run your backend code in response to HTTP requests from the API Gateway. Each Lambda function can correspond to different operations like CRUD (Create, Read, Update, Delete) on data. The functions are typically written in Node.js, Python, or another supported runtime.
- Example: A Lambda function might handle a POST request to create a new item in DynamoDB, or a GET request to retrieve data.
- Amazon DynamoDB: Used as the database for storing and retrieving data. Lambda functions interact with DynamoDB to perform database operations:
   - Create: New entries are added when the user submits data via a form in the Angular app.
   - Read: Data is fetched to populate views or lists in the frontend.
   - Update/Delete: Modifications or deletions are made based on user actions.

## Integration Flow:
- User Interaction: A user interacts with an Angular component (e.g., submits a form).
- Service Call: The component uses an Angular service to make an HTTP request.
- API Gateway: The request goes through API Gateway, which routes it to the correct Lambda function.
- Lambda Function: This function processes the request, potentially interacting with DynamoDB.
- DynamoDB: Reads from or writes to the database.
- Response: The Lambda function sends back a response via API Gateway to the Angular application.
- Data Handling: The Angular service receives this data and updates the component's view accordingly.