import { OWNER_COLORS, AVATAR_COLORS } from "./constants";

// Deterministic color generator based on name
export const getAvatarColor = (name: string, explicitColor?: string) => {
    if (explicitColor) return explicitColor;
    if (OWNER_COLORS[name]) return OWNER_COLORS[name];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};
