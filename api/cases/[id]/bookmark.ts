import { getDb, saveDb, DEFAULT_USER_ID } from "../../utils";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const caseId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!caseId) {
    return res.status(400).json({ error: "Case ID is required." });
  }

  const db = await getDb();
  const index = db.cases.findIndex((item: any) => item.id === caseId && item.userId === DEFAULT_USER_ID);
  if (index === -1) {
    return res.status(404).json({ error: "Kasus tidak ditemukan" });
  }

  db.cases[index].isBookmarked = !db.cases[index].isBookmarked;
  db.history.push({
    id: "h_" + Math.random().toString(36).substring(2, 11),
    caseId,
    userId: DEFAULT_USER_ID,
    action: db.cases[index].isBookmarked ? "bookmarked" : "unbookmarked",
    timestamp: new Date().toISOString()
  });

  await saveDb(db);
  res.status(200).json(db.cases[index]);
}
