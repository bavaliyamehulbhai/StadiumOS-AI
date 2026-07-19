import UserLanguagePreference from '../../models/UserLanguagePreference.js';

export const getPreferences = async (userId) => {
  let pref = await UserLanguagePreference.findOne({ user: userId });
  if (!pref) {
    pref = await UserLanguagePreference.create({ user: userId });
  }
  return pref;
};

export const updatePreferences = async (userId, data) => {
  return await UserLanguagePreference.findOneAndUpdate(
    { user: userId },
    { $set: data },
    { new: true, upsert: true }
  );
};
