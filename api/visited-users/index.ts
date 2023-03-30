import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Container, CosmosClient, ExistingKeyOperation, ItemResponse } from "@azure/cosmos"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

  const username = req.query.username.toLowerCase();

  if (!username) {
    context.res = {
      status: 400
    }
    return;
  }

  const responseCode = await createOrUpdateUserVisited(context, username);

  context.res = {
    status: responseCode
  }

};

const createUser = function (context: Context, username: string, usersContainer: Container): Promise<number> {

  return usersContainer.items.create({
    id: username,
    username: username,
    visited: 1
  }).then(
    () => {
      context.log(`${username} created.`); return 201;
    },
    err => {
      context.log(err); return 500;
      }
    );
}

const increaseVisited = function (context: Context, username: string, usersContainer: Container): Promise<number> {

  const increaseVisitedOp: ExistingKeyOperation =
    { op: "incr", path: "/visited", value: 1 };

  return usersContainer.item(username, username).patch([increaseVisitedOp]).then(
    () => {
      context.log(`${username} updated.`); return 204;
    },
    err => {
      context.log(err); return 500;
    }
  )
}

const createOrUpdateUserVisited = function (context: Context, username: string): Promise<number> {

  const usersContainer = getUsersContainer();

  return usersContainer.item(username, username).read().then(
    data => {
      if (data.statusCode === 404) {
        return createUser(context, username, usersContainer);
      }
      else if (data.statusCode === 200) {
        return increaseVisited(context, username, usersContainer);
      } else {
        context.log(`Unknown response from CosmosDB statuscode ${data.statusCode}`);
        return 500;
      }
    },
    err => {
      context.log(err); return 500;
    }
  )
}

const getUsersContainer = function (): Container {

  const database = 'reddit-up';
  const container = 'users';
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;

  return new CosmosClient({ endpoint: endpoint, key: key }).database(database)
    .container(container);
}

export default httpTrigger;