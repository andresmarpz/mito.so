"use server";

import { aiService } from "~/services";

export const generateImageAction = async (prompt: string) => {
  return await aiService.generateImage(prompt);
};
