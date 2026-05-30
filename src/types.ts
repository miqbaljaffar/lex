export interface LegalArticle {
  undangUndang: string;
  pasal: string;
  isiPasal: string;
  alasanPemilihan: string;
}

export interface LegalElement {
  unsur: string;
  terpenuhi: boolean;
  analisisFakta: string;
}

export interface LegalReasoning {
  ringkasan: string;
  klasifikasi: string;
  pasalTerkait: LegalArticle[];
  analisisUnsur: LegalElement[];
  pertimbanganHukum: string[];
  potensiSanksi: string;
  kesimpulan: string;
  confidenceScore: number;
}

export interface AnalysisCase {
  id: string;
  userId: string;
  title: string;
  chronology: string;
  category: string;
  evidence?: string;
  createdAt: string;
  result: LegalReasoning | null;
  isBookmarked: boolean;
}

export interface AppDatabase {
  cases: AnalysisCase[];
  history: {
    id: string;
    caseId: string;
    userId: string;
    action: string; // e.g., "created", "viewed", "bookmarked"
    timestamp: string;
  }[];
}
