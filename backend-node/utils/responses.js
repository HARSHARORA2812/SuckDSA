// Fallback response function when Gemini API is unavailable
function getFallbackResponse(message) {
  const messageLower = message.toLowerCase();
  
  // Basic topic responses
  if (messageLower.includes('array')) {
    return "Arre yaar! Arrays are like your hostel mess plates - all lined up in a row, numbered 0 to n-1. You can grab any plate instantly by its position, but shifting plates around? That's like rearranging the entire mess queue - O(n) headache! 🍽️\n\nBasic operations:\n- Access: O(1) - instant like Maggi\n- Insert/Delete: O(n) - slow like BSNL internet\n\nRemember: Arrays are fixed size, like your brain capacity! 😏";
  }
  
  if (messageLower.includes('stack')) {
    return "Stacks? Bhai, it's like your mom's paratha pile! Last paratha goes on top, first one you eat is also from the top - LIFO (Last In, First Out)! 🥞\n\nOperations:\n- Push: Add paratha on top - O(1)\n- Pop: Take paratha from top - O(1)\n- Peek: Check top paratha without eating - O(1)\n\nUse cases: Function calls, undo operations, browser history. Simple as chai-biscuit! ☕";
  }
  
  if (messageLower.includes('linked list')) {
    return "Linked Lists = Train compartments! Each compartment (node) has passengers (data) and is connected to the next one. But unlike trains, you can't jump to any compartment directly - you have to walk from the engine! 🚂\n\nTypes:\n- Singly: One-way connection (like your ex's contact)\n- Doubly: Two-way connection (like good friendship)\n- Circular: Last connects to first (like your daily routine!)\n\nPros: Dynamic size, easy insertion\nCons: No random access, extra memory for pointers";
  }
  
  if (messageLower.includes('queue')) {
    return "Queue = Railway ticket counter line! First person in line gets ticket first - FIFO (First In, First Out). No cutting allowed, unlike real Indian queues! 🚂\n\nOperations:\n- Enqueue: Join the line (rear)\n- Dequeue: Get served (front)\n- Front: Check who's first\n- Rear: Check who's last\n\nAll operations O(1) - faster than actual ticket booking! Use in BFS, scheduling, handling requests.";
  }
  
  // Default fallback
  return "Arre yaar! The savage teacher's internet is acting like BSNL today! 😅 But here's the deal - DSA is all about understanding patterns and problem-solving. Whatever you asked about, remember: practice makes perfect, and every algorithm has its time and place. Keep coding, keep learning, and don't let temporary setbacks stop you from becoming a coding champion! 🔥\n\n(Try asking again in a moment - the teacher will be back with full savage mode!)";
}

module.exports = { getFallbackResponse };
