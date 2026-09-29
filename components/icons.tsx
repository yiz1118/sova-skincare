import {
  ArrowLeft as LucideArrowLeft,
  ArrowRight as LucideArrowRight,
  ArrowUpRight as LucideArrowUpRight,
  Check as LucideCheck,
  Github as LucideGithub,
  Linkedin as LucideLinkedin,
  Mail as LucideMail,
  Menu as LucideMenu,
  MessageCircle as LucideMessageCircle,
  Minus as LucideMinus,
  Plus as LucidePlus,
  RotateCcw as LucideRotateCcw,
  ShoppingBag as LucideShoppingBag,
  Trash2 as LucideTrash2,
  X as LucideX,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

// UI controls own their accessible names. Their SVGs are decorative and never
// enter the tab order. Keep Lucide's existing size/stroke defaults; callers
// retain the optical sizes and the lighter bag stroke used by SOVA.
function decorativeIcon(Icon: LucideIcon) {
  return function DecorativeIcon({ size = 24, strokeWidth = 2, ...props }: LucideProps) {
    return <Icon {...props} size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
  };
}

export const ArrowLeft = decorativeIcon(LucideArrowLeft);
export const ArrowRight = decorativeIcon(LucideArrowRight);
export const ArrowUpRight = decorativeIcon(LucideArrowUpRight);
export const Check = decorativeIcon(LucideCheck);
export const Github = decorativeIcon(LucideGithub);
export const Linkedin = decorativeIcon(LucideLinkedin);
export const Mail = decorativeIcon(LucideMail);
export const Menu = decorativeIcon(LucideMenu);
export const MessageCircle = decorativeIcon(LucideMessageCircle);
export const Minus = decorativeIcon(LucideMinus);
export const Plus = decorativeIcon(LucidePlus);
export const RotateCcw = decorativeIcon(LucideRotateCcw);
export const ShoppingBag = decorativeIcon(LucideShoppingBag);
export const Trash2 = decorativeIcon(LucideTrash2);
export const X = decorativeIcon(LucideX);
