interface SkillBadgeProps {
  name: string;
  tier: string;
}

export function SkillBadge({ name, tier }: SkillBadgeProps) {
  return (
    <li>
      {name} ({tier})
    </li>
  );
}