import { Account, Balance, Transaction, InventoryItem } from "@/types/finance";
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

function getClient(): MongoClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  if (!client) {
    client = new MongoClient(databaseUrl);
  }
  return client;
}

const SHARED_DATA_ID = "GLOBAL_DEALERSHIP_DATA";

export async function getUserCloudData(userId: string): Promise<{ accounts: Account[]; balances: Balance[]; transactions: Transaction[]; inventory: InventoryItem[] } | null> {
  const client = getClient();
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  const userCollection = db.collection<{ userId: string; accounts: Account[]; balances: Balance[]; transactions: Transaction[]; inventory: InventoryItem[] }>("user_data");

  // 1. Try to find the shared dealership data
  let userData = await userCollection.findOne({ userId: SHARED_DATA_ID });

  // 2. MIGRATION LOGIC: If shared data is missing but the requesting user has private data,
  // promote their data to be the shared dealership data.
  if (!userData && userId) {
    const privateData = await userCollection.findOne({ userId });
    if (privateData) {
      console.warn(`Migrating private data for user ${userId} to shared dealership storage`);
      await userCollection.updateOne(
        { userId: SHARED_DATA_ID },
        { $set: { 
            accounts: privateData.accounts, 
            balances: privateData.balances, 
            transactions: privateData.transactions,
            inventory: (privateData as any).inventory || []
          } 
        },
        { upsert: true }
      );
      // Fetch it again to be safe
      userData = await userCollection.findOne({ userId: SHARED_DATA_ID });
    }
  }

  if (!userData) {
    return null;
  }

  return {
    accounts: userData.accounts || [],
    balances: userData.balances || [],
    transactions: userData.transactions || [],
    inventory: userData.inventory || [],
  };
}

export async function saveUserCloudData(accounts: Account[], balances: Balance[], transactions: Transaction[], inventory: InventoryItem[]): Promise<void> {
  const client = getClient();
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  const userCollection = db.collection<{ userId: string; accounts: Account[]; balances: Balance[]; transactions: Transaction[]; inventory: InventoryItem[] }>("user_data");

  await userCollection.updateOne(
    { userId: SHARED_DATA_ID },
    { $set: { accounts, balances, transactions, inventory } },
    { upsert: true }
  );
}


export async function deleteUserCloudData(): Promise<void> {
  const client = getClient();
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME);
  const userCollection = db.collection<{ userId: string; accounts: Account[]; balances: Balance[]; transactions: Transaction[] }>("user_data");

  await userCollection.deleteOne({ userId: SHARED_DATA_ID });
}