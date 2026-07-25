async function run() {
  try {
    console.log("Loading @xenova/transformers...");
    const { pipeline } = await import("@xenova/transformers");
    
    console.log("Initializing Xenova all-MiniLM-L6-v2 pipeline (will download if not cached)...");
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    
    console.log("Generating test embedding...");
    const output = await extractor("Hello world, testing Schengen visa", { 
      pooling: "mean", 
      normalize: true 
    });
    
    const embedding = Array.from(output.data);
    console.log("Embedding generated successfully!");
    console.log("Dimensions:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
    process.exit(0);
  } catch (err) {
    console.error("Xenova embedding generation failed:", err);
    process.exit(1);
  }
}

run();
