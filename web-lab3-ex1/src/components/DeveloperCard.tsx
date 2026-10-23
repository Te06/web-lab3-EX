import { Fragment } from 'react';
import { SkillBadge } from './SkillBadge';
// Tạm thời chưa import CSS, để commit 2 làm

interface Metrics {
  commits: number;
  vdomNodes: number;
  a11yScore: number;
}

interface Skill {
  id: string;
  name: string;
  tier: string;
}

interface DeveloperCardProps {
  fullName?: string;
  role?: string;
  avatarUrl?: string;
  metrics?: Metrics;
  skills?: Skill[];
}

export function DeveloperCard({
  fullName = 'Pham Ngoc Thach',
  role = 'Student hihi',
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240', 
  metrics = { commits: 512, vdomNodes: 0, a11yScore: 100 },
  skills = [{ id: 'sk-1', name: 'React 19 Fiber', tier: 'Core' }],
}: DeveloperCardProps) {
  return (
    <article aria-labelledby="dev-heading">
      <header>
        <img src={avatarUrl} alt={fullName} width="64" height="64" />
        <hgroup>
          <h2 id="dev-heading">{fullName}</h2>
          <p>{role}</p>
        </hgroup>
      </header>

      <dl>
        {Object.entries(metrics).map(([k, v]) => (
          <Fragment key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </Fragment>
        ))}
      </dl>

      <ul aria-label="Engineered Skills">
        {skills.map((s) => (
          <SkillBadge key={s.id} name={s.name} tier={s.tier} />
        ))}
      </ul>
    </article>
  );
}