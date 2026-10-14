// The tags in the homepage Toolbox, shared by the physics toy and the static
// list rendered for the server, for no-JS readers and for reduced motion.

export const TAG_SIZES = {
  sm: { width: 96, height: 34, fontSize: 11 },
  md: { width: 124, height: 40, fontSize: 13 },
  lg: { width: 150, height: 46, fontSize: 15 },
} as const;

export interface SkillTag {
  id: number;
  en: string;
  zh: string;
  size: keyof typeof TAG_SIZES;
  variant: "filled" | "outlined";
}

export const SKILL_TAGS: SkillTag[] = [
  { id: 1, en: "Engineer", zh: "工程師", size: "lg", variant: "filled" },
  { id: 2, en: "Marketer", zh: "行銷人", size: "lg", variant: "filled" },
  { id: 3, en: "Event Planner", zh: "活動企劃", size: "lg", variant: "filled" },
  { id: 4, en: "Designer", zh: "設計師", size: "lg", variant: "filled" },
  { id: 5, en: "React", zh: "React", size: "md", variant: "outlined" },
  { id: 6, en: "Next.js", zh: "Next.js", size: "md", variant: "outlined" },
  { id: 7, en: "TypeScript", zh: "TypeScript", size: "md", variant: "outlined" },
  { id: 8, en: "React Native", zh: "React Native", size: "md", variant: "outlined" },
  { id: 9, en: "Expo", zh: "Expo", size: "sm", variant: "outlined" },
  { id: 10, en: "n8n", zh: "n8n", size: "sm", variant: "outlined" },
  { id: 11, en: "UI/UX", zh: "使用者體驗", size: "md", variant: "outlined" },
  { id: 12, en: "Branding", zh: "品牌行銷", size: "md", variant: "outlined" },
  { id: 13, en: "Social Media", zh: "社群經營", size: "md", variant: "outlined" },
  { id: 14, en: "Partnerships", zh: "異業合作", size: "md", variant: "outlined" },
  { id: 15, en: "Vibe Coding", zh: "Vibe Coding", size: "md", variant: "outlined" },
  { id: 16, en: "Growth", zh: "成長", size: "sm", variant: "outlined" },
  { id: 17, en: "Open Minds", zh: "開放思維", size: "sm", variant: "outlined" },
];
