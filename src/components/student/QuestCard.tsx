import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Target, Clock, Zap } from 'lucide-react';

interface QuestCardProps {
  questId: string;
  questNumber: string;
  title: string;
  description: string;
  skill: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  xpReward: number;
  estimatedTime: string;
  isRecommended?: boolean;
}

export function QuestCard({
  questId,
  questNumber,
  title,
  description,
  skill,
  difficulty,
  progress,
  xpReward,
  estimatedTime,
  isRecommended = false,
}: QuestCardProps) {
  return (
    <div className={`card p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform border-line ${
      isRecommended ? 'border-l-4 border-l-success' : 'quest-card'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
            {isRecommended ? (
              <span className="text-success flex items-center gap-1"><Target className="w-3 h-3" /> RECOMMENDED QUEST</span>
            ) : (
              `QUEST ${questNumber}`
            )}
          </div>
          <div className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-surface border border-line text-muted">
            {skill}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
            difficulty === 'Beginner' ? 'bg-success-dim text-success' :
            difficulty === 'Intermediate' ? 'bg-warning-dim text-warning' :
            'bg-danger-dim text-danger'
          }`}>
            {difficulty}
          </span>
          <span className="text-[10px] px-2 py-1 bg-surface border border-line rounded text-muted font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> {estimatedTime}
          </span>
          <span className="text-[10px] px-2 py-1 bg-highlight-dim border border-highlight-dim rounded text-highlight font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> +{xpReward} XP
          </span>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-[10px] font-bold text-muted mb-2 uppercase tracking-wide">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="bar bg-bg-base">
            <span style={{ width: `${progress}%` }} className={progress === 100 ? '!bg-success' : '!bg-primary'}></span>
          </div>
        </div>
      </div>
      
      <Link href={`/student/codelab?quest=${questId}`} className={`btn w-full text-sm ${progress === 100 ? 'btn-ghost' : 'btn-primary'}`}>
        {progress === 100 ? 'ทบทวนภารกิจ' : progress > 0 ? 'ทำภารกิจต่อ' : 'เริ่มภารกิจ'} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
