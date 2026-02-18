import ImageKit from '@imagekit/nodejs';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

console.log("ImageKit config:", {
  hasPublicKey: !!process.env.IMAGEKIT_PUBLIC_KEY,
  hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY,
  hasUrlEndpoint: !!process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit