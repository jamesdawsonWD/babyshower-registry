//https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: "server",
  compatibilityDate: "2025-01-16",
  publicAssets: [
    {
      dir: "public", // Directory containing your built frontend files
      baseURL: "/", // Serve assets from the root URL
    },
  ],
});
