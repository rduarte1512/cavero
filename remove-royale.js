// Remove CAVERO Royale from the live storefront before the catalog is initialized.
// This keeps the product out of collection, search, recommendations and cart migration.
const royaleCatalogIndex = families.findIndex(f => f.key === 'royale');
if (royaleCatalogIndex >= 0) families.splice(royaleCatalogIndex, 1);
