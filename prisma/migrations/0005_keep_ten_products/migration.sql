DELETE FROM "CatalogueProduct"
WHERE "id" NOT IN (
  'AI-001',
  'ANL-001',
  'CRS-001',
  'CV-001',
  'DEV-001',
  'DSN-001',
  'EBK-001',
  'ECM-001',
  'FIN-001',
  'NOT-001'
);
