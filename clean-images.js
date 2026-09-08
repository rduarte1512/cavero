// Clean hero/cover imagery for active CAVERO models.
const CAVERO_CLEAN_IMAGES = {
  chronos: 'https://static.wixstatic.com/media/eb5ec1_ec87cb0fa40841dc9fa4613af69c4bac~mv2.jpg',
  ocean: 'https://static.wixstatic.com/media/eb5ec1_45e21215a6f64a57badcc967caddc29b~mv2.jpg',
  velocity: 'https://static.wixstatic.com/media/eb5ec1_ad79dbda21cf4672b8c6211f6757e693~mv2.jpg',
  prestige: 'https://static.wixstatic.com/media/eb5ec1_8c425e0abcef493e9bc6cba2615f759b~mv2.jpg',
  apex: 'https://static.wixstatic.com/media/eb5ec1_d47ea3ebb9624674a14cf6a4632a33d8~mv2.jpg'
};

// Exclude the exact supplier photo requested for removal.
const CAVERO_REMOVED_IMAGES = new Set([
  'https://static.wixstatic.com/media/eb5ec1_121e2c103951455bb0b505eba590c0d7~mv2.jpeg'
]);

families.forEach(f => {
  const clean = CAVERO_CLEAN_IMAGES[f.key];
  if (clean) f.cleanImage = clean;
  const gallery = clean ? [clean, ...(f.gallery || [])] : (f.gallery || []);
  f.gallery = [...new Set(gallery)].filter(src => !CAVERO_REMOVED_IMAGES.has(src));
});
