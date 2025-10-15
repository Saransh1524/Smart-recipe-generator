const express = require('express');

module.exports = function imageRoutes(app, deps) {
  const { upload, stub, grpc } = deps;
  const router = express.Router();

  router.post('/api/ingredients/recognize-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + process.env.CLARIFAI_API_KEY);

    stub.PostModelOutputs(
      {
        user_app_id: { "user_id": "clarifai", "app_id": "main" },
        model_id: "food-item-recognition",
        inputs: [{ data: { image: { base64: req.file.buffer.toString('base64') } } }]
      },
      metadata,
      (err, response) => {
        if (err) {
          console.error("Clarifai API Error:", err);
          return res.status(500).json({ error: "Failed to analyze image." });
        }
        if (response.status.code !== 10000) {
          console.error("Clarifai non-OK status:", response.status);
          return res.status(500).json({ error: "Received non-OK status from Clarifai: " + response.status.description });
        }
        const concepts = response.outputs[0].data.concepts;
        const ingredients = concepts.slice(0, 7).map(concept => concept.name);
        res.json({ ingredients });
      }
    );
  });

  app.use(router);
};


