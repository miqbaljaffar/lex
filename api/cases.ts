import { getDb, DEFAULT_USER_ID } from "./utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = await getDb();
  const userCases = db.cases.filter((item: any) => item.userId === DEFAULT_USER_ID);
  res.status(200).json(userCases);
}
