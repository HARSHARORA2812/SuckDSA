const express = require('express');

const router = express.Router();

// DSA Topics Data
const DSA_TOPICS = [
  {
    name: "Arrays",
    description: "Basic data structure to store elements",
    savage_intro: "Arrays: Not your cricket team lineup, but close enough",
    difficulty: "Beginner",
    icon: "📊"
  },
  {
    name: "Stacks",
    description: "LIFO data structure",
    savage_intro: "Stacks: Like your mom's paratha pile - last in, first out",
    difficulty: "Beginner",
    icon: "📚"
  },
  {
    name: "Trees",
    description: "Hierarchical data structure",
    savage_intro: "Trees: Not the ones outside, idiot. These grow upside down",
    difficulty: "Intermediate",
    icon: "🌳"
  },
  {
    name: "Graphs",
    description: "Connected nodes and edges",
    savage_intro: "Graphs: Like your social network, but actually useful",
    difficulty: "Advanced",
    icon: "🕸️"
  }
];

// Get all topics
router.get('/', (req, res) => {
  res.json(DSA_TOPICS);
});

module.exports = router;
