export interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Step {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  label: string;
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}
