import { getAvatarColor } from '../utils';
import { OWNER_COLORS, AVATAR_COLORS } from '../constants';

describe('getAvatarColor', () => {
  it('should return explicit color if provided', () => {
    const color = getAvatarColor('Test User', '#FFFFFF');
    expect(color).toBe('#FFFFFF');
  });

  it('should return owner color if name matches a preset owner', () => {
    const ownerName = Object.keys(OWNER_COLORS)[0];
    const color = getAvatarColor(ownerName);
    expect(color).toBe(OWNER_COLORS[ownerName]);
  });

  it('should return a deterministic color based on name if no explicit or preset color is found', () => {
    const name1 = 'Unique User 1';
    const name2 = 'Unique User 2';
    const name3 = 'Unique User 1'; // Same as name1

    const color1 = getAvatarColor(name1);
    const color2 = getAvatarColor(name2);
    const color3 = getAvatarColor(name3);

    expect(AVATAR_COLORS).toContain(color1);
    expect(AVATAR_COLORS).toContain(color2);
    expect(color1).not.toBe(color2); // Should be different for different names
    expect(color1).toBe(color3);     // Should be the same for the same name
  });

  it('should return a color from AVATAR_COLORS array', () => {
    const color = getAvatarColor('Random Name');
    expect(AVATAR_COLORS).toContain(color);
  });

  it('should handle empty string name gracefully', () => {
    const color = getAvatarColor('');
    expect(AVATAR_COLORS).toContain(color);
  });
});
