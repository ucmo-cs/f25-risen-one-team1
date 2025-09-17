## Frontend Setup

### Step 1: Clone the Repository

Download the project repository to your local machine if not already done.

- Command: `git clone https://github.com/risen-one-technologies/base-senior-project.git`
- Command: `cd frontend`

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
