import { AzureFunction, Context } from "@azure/functions"
import { Container, CosmosClient } from "@azure/cosmos";
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob"


const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {

    const numberOfUsers = parseInt(process.env.TOP_USER_COUNT) || 10;
    const visitedInTheLastDays = parseInt(process.env.VISITED_LAST_DAYS) || 10;
    const topN = getBlobClient(numberOfUsers);

    try {
        const topUserData = JSON.stringify(await getTopUsers(numberOfUsers, visitedInTheLastDays));
        const uploadBlobResponse = await topN.upload(topUserData, topUserData.length);
    } catch (err) {
        console.error('Failed to get or update top user data.');
        console.error(err);
    }
    console.log(`Succesfully updated top${numberOfUsers} file.`);
};

const getTopUsers = async function (numberOfUsers: number, pastDays: number) {
    let container = getUsersContainer();
    const topN = await container.items
        .query(
            {
                query: "SELECT TOP @numberOfUsers c.username, c.visited FROM c WHERE GetCurrentTimestamp()/1000-c._ts < @pastDays ORDER BY c.visited DESC",
                parameters: [
                    { name: "@numberOfUsers", value: numberOfUsers },
                    { name: "@pastDays", value: pastDays * 86400 }
                ]
            })
        .fetchNext();

    return topN.resources;
}

const getBlobClient = function (numberOfUsers: number): BlockBlobClient {

    const containerName = "statistics"
    const blobName = `top${numberOfUsers}.json`
    const blobStorageConnectionString = process.env.STATISTICS_CONTAINER_SAS;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        blobStorageConnectionString
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const topN = containerClient.getBlockBlobClient(blobName);

    return topN;
}

const getUsersContainer = function (): Container {

    const database = 'reddit-up';
    const container = 'users';
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    return new CosmosClient({ endpoint: endpoint, key: key }).database(database)
        .container(container);
}

export default timerTrigger;
