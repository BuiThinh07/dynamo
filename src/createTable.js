require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({
   region: process.env.AWS_DEFAULT_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   }
});

// Set the parameters
const params = {
   AttributeDefinitions: [
      {
         AttributeName: "id", //ATTRIBUTE_NAME_1
         AttributeType: "N", //ATTRIBUTE_TYPE
      },
      {
         AttributeName: "email", //ATTRIBUTE_NAME_2
         AttributeType: "S", //ATTRIBUTE_TYPE
      },
   ],
   KeySchema: [
      {
         AttributeName: "id", //ATTRIBUTE_NAME_1
         KeyType: "HASH",
      },
      {
         AttributeName: "email", //ATTRIBUTE_NAME_2
         KeyType: "RANGE",
      },
   ],
   ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
   },
   TableName: "User", //TABLE_NAME
   StreamSpecification: {
      StreamEnabled: false,
   },
};

const run = async () => {
   try {
      const data = await ddbClient.send(new CreateTableCommand(params));
      console.log("Table Created", data);
      return data;
   } catch (err) {
      console.log("Error", err);
   }
};

run();
