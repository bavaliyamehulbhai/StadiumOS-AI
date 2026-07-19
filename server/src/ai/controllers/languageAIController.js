import { detectLanguage } from '../services/languageDetectionService.js';
import { translateText } from '../services/translationService.js';
import { getPreferences, updatePreferences } from '../services/languageService.js';
import { SUPPORTED_LANGUAGES } from '../services/localizationService.js';

export const handleTranslate = async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;
    if (!text || !targetLanguage) {
      return res.status(400).json({ success: false, message: 'Text and targetLanguage are required' });
    }
    const translated = await translateText(text, targetLanguage);
    res.status(200).json({ success: true, data: { translatedText: translated } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Translation failed', error: error.message });
  }
};

export const handleDetect = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }
    const langCode = await detectLanguage(text);
    res.status(200).json({ success: true, data: { language: langCode } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Detection failed', error: error.message });
  }
};

export const getLanguages = (req, res) => {
  res.status(200).json({ success: true, data: SUPPORTED_LANGUAGES });
};

export const getUserPreferences = async (req, res) => {
  try {
    const prefs = await getPreferences(req.user._id);
    res.status(200).json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch preferences', error: error.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const { preferredLanguage, fallbackLanguage, autoDetect } = req.body;
    const prefs = await updatePreferences(req.user._id, { preferredLanguage, fallbackLanguage, autoDetect });
    res.status(200).json({ success: true, data: prefs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update preferences', error: error.message });
  }
};
