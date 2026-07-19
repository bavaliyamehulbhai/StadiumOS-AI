export const processAIRecommendation = (aiResponseText) => {
  try {
    // Attempt to extract JSON from the text in case AI added markdown
    const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Add mock pathData for MVP map rendering
    // In a real app, this would query a GIS service based on routeName
    if (parsedData.recommendations) {
      parsedData.recommendations = parsedData.recommendations.map(rec => ({
        ...rec,
        pathData: generateMockPathData(rec.routeName)
      }));
    }
    
    return parsedData;
  } catch (error) {
    console.error('Error processing AI recommendation:', error);
    throw new Error('Failed to parse AI navigation response');
  }
};

// Mock function to generate some GeoJSON-like path coordinates
const generateMockPathData = (routeName) => {
  // Return some dummy coordinates around a central stadium location
  // Offset them slightly based on the route string length to make them look distinct
  const offset = (routeName.length % 5) * 0.0005;
  const baseLat = 28.6139; // Example latitude
  const baseLng = 77.2090; // Example longitude
  
  return {
    type: "Feature",
    properties: {
      name: routeName
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [baseLng + offset, baseLat + offset],
        [baseLng + 0.001 + offset, baseLat + 0.001 + offset],
        [baseLng + 0.002, baseLat + 0.0015]
      ]
    }
  };
};
