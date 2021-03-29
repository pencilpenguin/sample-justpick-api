const AWS = require("aws-sdk")

AWS.config.update({ region: process.env.AWS_REGION })

const dynamoDB = new AWS.DynamoDB.DocumentClient()

updateUserPickList = async (primaryKey, pickList) => {
    try {
        let response = await dynamoDB
        .update({
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                email: primaryKey,
            },
            UpdateExpression: `set 
                my_picks = :my_picks
            `,
            ExpressionAttributeValues: {
                ":my_picks": pickList,
            },
        })
        .promise()
        console.log(response)
        return response.$response
    } catch (err) {
        console.log(err);
        throw err
    }
}
module.exports.updateUserPickList = updateUserPickList;
