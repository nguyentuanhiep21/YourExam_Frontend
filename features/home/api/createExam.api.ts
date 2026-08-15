import { createClient } from "@/lib/supabase/client";
import { GenerateExerciseRequestDto, CreateBlueprintRuleDto } from "../types/createExam.types";

export const createExamApi = {
  async fetchBlueprints(userId: string) {
    const supabase = createClient();
    return supabase
      .from("ExamBlueprints")
      .select("*, BlueprintRules(*)")
      .eq("AuthorId", userId)
      .order("Id", { ascending: false });
  },

  async deleteBlueprint(id: number) {
    const supabase = createClient();
    return supabase.from("ExamBlueprints").delete().eq("Id", id);
  },

  async updateBlueprint(id: number, name: string) {
    const supabase = createClient();
    return supabase.from("ExamBlueprints").update({ Name: name }).eq("Id", id);
  },

  async deleteBlueprintRules(blueprintId: number) {
    const supabase = createClient();
    return supabase.from("BlueprintRules").delete().eq("BlueprintId", blueprintId);
  },

  async createBlueprint(name: string, userId: string) {
    const supabase = createClient();
    return supabase.from("ExamBlueprints").insert({
      Name: name,
      IsSystemProvided: false,
      AuthorId: userId
    }).select().single();
  },

  async createBlueprintRules(rules: CreateBlueprintRuleDto[]) {
    const supabase = createClient();
    return supabase.from("BlueprintRules").insert(rules);
  },

  async generateExercises(payload: GenerateExerciseRequestDto) {
    const res = await fetch("https://yourexam-backend.onrender.com/api/exercises/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }
};
