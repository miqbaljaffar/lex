import { getDb, DEFAULT_USER_ID } from "./utils.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = await getDb();
  const userHistory = db.history
    .filter((item: any) => item.userId === DEFAULT_USER_ID)
    .map((item: any) => {
      const relatedCase = db.cases.find((c: any) => c.id === item.caseId);
      return {
        ...item,
        caseTitle: relatedCase ? relatedCase.title : "Kasus Dihapus"
      };
    })
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  res.status(200).json(userHistory);
}
