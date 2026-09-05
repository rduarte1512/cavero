// Clean hero/cover imagery for CAVERO models.
// Keep clean cover images for cards/hero, but NEVER collapse a family into one photo.
const CAVERO_CLEAN_IMAGES = {
  chronos: 'https://static.wixstatic.com/media/eb5ec1_ec87cb0fa40841dc9fa4613af69c4bac~mv2.jpg',
  royale: 'https://static.wixstatic.com/media/eb5ec1_86b27e53c13e4ca8b830110f63498eb5~mv2.jpg',
  ocean: 'https://static.wixstatic.com/media/eb5ec1_45e21215a6f64a57badcc967caddc29b~mv2.jpg',
  velocity: 'https://static.wixstatic.com/media/eb5ec1_ad79dbda21cf4672b8c6211f6757e693~mv2.jpg',
  prestige: 'https://static.wixstatic.com/media/eb5ec1_8c425e0abcef493e9bc6cba2615f759b~mv2.jpg',
  apex: 'https://static.wixstatic.com/media/eb5ec1_d47ea3ebb9624674a14cf6a4632a33d8~mv2.jpg'
};

families.forEach(f => {
  const clean = CAVERO_CLEAN_IMAGES[f.key];
  if (!clean) return;
  f.cleanImage = clean;

  // Add one clean editorial image to the gallery, but preserve every
  // original variant image so each colour/acabamento remains visually distinct.
  f.gallery = [clean, ...(f.gallery || []).filter(src => src !== clean)];
});
