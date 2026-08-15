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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${baseUrl}/exercises/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async exportToDocx(payload: { fileName: string, exercises: any[] }) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${baseUrl}/exercises/export/docx`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      if (res.status === 502 || res.status === 504) {
        throw new Error("Server đang khởi động (Cold Start) hoặc quá tải, vui lòng chờ 30-60 giây rồi thử lại.");
      }
      throw new Error(`Lỗi khi tạo file docx (Status: ${res.status})`);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      throw new Error("Server trả về trang lỗi HTML thay vì file. Khả năng cao do Server đang khởi động, vui lòng chờ thêm.");
    }

    return res.blob();
  }
};
