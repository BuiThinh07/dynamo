const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
   region: process.env.AWS_DEFAULT_REGION,
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'HarryPotter';
const getCharacters = async () => {
   let result, accumulated = [], ExclusiveStartKey;
   const params = {
      TableName: TABLE_NAME,
      IndexName: 'actor-gender-index',
      /* KeyConditionExpression: "actor = :ac and gender = :gender",
      ExpressionAttributeValues: {
         ":gender": 'male',
         ":al": false,
      }, */
      /*       ExclusiveStartKey, */
      TotalSegments: 4,
      Segment: 3,
      Limit: 50,
      Size: 40
   };
   accumulated = await dynamoClient.scan(params).promise();
   /* do {
      result = await dynamoClient.query(params).promise();
      params.ExclusiveStartKey = result.LastEvaluatedKey;
      accumulated = [...accumulated, ...result.Items];
      console.log(result.LastEvaluatedKey);
   } while (result.LastEvaluatedKey); */
   return accumulated;
};

const getCharacterById = async (id) => {
   const params = {
      TableName: TABLE_NAME,
      Key: {
         id,
      },
   };
   return await dynamoClient.get(params).promise();
};

const addOrUpdateCharacter = async (character) => {
   const params = {
      TableName: TABLE_NAME,
      Item: character,
   };
   return await dynamoClient.put(params).promise();
};

const deleteCharacter = async (id) => {
   const params = {
      TableName: TABLE_NAME,
      Key: {
         id,
      },
   };
   return await dynamoClient.delete(params).promise();
};

const getALlCharacterByActor = async (actor) => {
   const params = {
      TableName: TABLE_NAME,
      IndexName: 'actor-gender-index',
      KeyConditionExpression: "actor = :ac and gender = :gender",
      /*       FilterExpression: 'actor = :ac', */
      /*       ProjectionExpression: 'actor, alive', */
      ExpressionAttributeValues: {
         /*          ":id": '228', */
         ":ac": actor,
         ":gender": 'male',
      },
   };
   return await dynamoClient.query(params).promise();
};

module.exports = {
   dynamoClient,
   getCharacters,
   getCharacterById,
   addOrUpdateCharacter,
   deleteCharacter,
   getALlCharacterByActor
};
