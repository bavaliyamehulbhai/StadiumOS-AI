import Groq from 'groq-sdk';
import VolunteerTask from '../../models/VolunteerTask.js';
import { VolunteerSocketService } from '../../services/volunteerSocketService.js';
import NotificationService from '../../services/notificationService.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateTaskGuidance = async (taskId) => {
  try {
    const task = await VolunteerTask.findById(taskId)
      .populate('stadium', 'name')
      .populate('incident', 'title type');

    if (!task || !task.description) return null;

    const prompt = `
    You are an expert stadium operations AI assistant. A volunteer has just been assigned the following task:
    Title: ${task.title}
    Category: ${task.category}
    Priority: ${task.priority}
    Location: ${task.location} (${task?.stadium?.name})
    Description: ${task.description}

    Provide a concise operational brief formatted EXACTLY as a JSON object with no markdown wrappers or extra text.
    {
      "summary": "A 1-2 sentence executive summary of the action required.",
      "safetyTips": ["Tip 1", "Tip 2"],
      "equipment": ["Item 1", "Item 2"],
      "etaMinutes": 10
    }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const aiData = JSON.parse(responseContent);

    task.aiSummary = aiData.summary;
    task.aiSafetyTips = aiData.safetyTips;
    task.aiEquipment = aiData.equipment;
    task.aiEtaMinutes = aiData.etaMinutes;
    await task.save();

    // Re-populate to get full refs before socket emit
    const updatedTask = await VolunteerTask.findById(task._id)
      .populate('assignedVolunteer', 'name email')
      .populate('assignedBy', 'name role')
      .populate('stadium', 'name');

    VolunteerSocketService.emitTaskAIGenerated(updatedTask);

    // Notify Volunteer that AI help is ready
    if (task.assignedVolunteer) {
      await NotificationService.sendNotification({
        recipient: task.assignedVolunteer,
        title: 'AI Guidance Ready',
        message: `AI generated instructions for: ${task.title}`,
        type: 'INFO',
        category: 'AI',
        priority: 'NORMAL',
        actionUrl: `/volunteer/tasks/${task._id}`
      });
    }

    return updatedTask;
  } catch (error) {
    console.error('Failed to generate AI Task Guidance:', error.message);
    return null;
  }
};
