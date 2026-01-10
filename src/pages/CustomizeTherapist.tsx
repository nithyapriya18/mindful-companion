import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { CustomizationSlider } from '@/components/therapist/CustomizationSlider';
import { HumorSelector } from '@/components/therapist/HumorSelector';
import { useTherapist } from '@/contexts/TherapistContext';
import { ArrowLeft } from 'lucide-react';

export default function CustomizeTherapist() {
  const { selectedTherapist, settings, updateSettings } = useTherapist();
  const navigate = useNavigate();

  if (!selectedTherapist) {
    navigate('/therapist-selection');
    return null;
  }

  const generateSampleResponse = () => {
    const warmth = settings.warmth > 50 ? 'nurturing' : 'professional';
    const directness = settings.directness > 50 ? 'direct' : 'exploratory';
    const length = settings.responseLength > 50 ? 'detailed' : 'concise';
    
    const responses = {
      'nurturing-direct-detailed': "I hear you, and I'm sorry you're going through this. Work stress can really take a toll. Let's talk about what specifically happened today that made it difficult. What was the hardest part for you? Understanding the specifics can help us find practical strategies to manage these situations better.",
      'nurturing-direct-concise': "I'm sorry to hear that. What happened today that made it particularly hard?",
      'nurturing-exploratory-detailed': "It sounds like today was really challenging for you. I appreciate you sharing that with me. When you say it was difficult, I'm curious about what that felt like in the moment. Sometimes our bodies and emotions can tell us a lot about what we need.",
      'nurturing-exploratory-concise': "That sounds tough. How are you feeling about it right now?",
      'professional-direct-detailed': "Difficult days at work are something many people struggle with. Let's break down what happened. Can you walk me through the specific events or interactions that contributed to making today challenging? This will help us identify patterns and develop targeted coping strategies.",
      'professional-direct-concise': "I understand. What specifically made today difficult?",
      'professional-exploratory-detailed': "Thank you for sharing. Work-related stress is a common concern. I'd like to understand more about your experience. What aspects of today stood out to you as particularly challenging? And how do you typically respond when facing these situations?",
      'professional-exploratory-concise': "I see. What do you think contributed to the difficulty today?",
    };

    const key = `${warmth}-${directness}-${length}` as keyof typeof responses;
    return responses[key] || responses['nurturing-exploratory-concise'];
  };

  const handleSave = () => {
    navigate('/dashboard');
  };

  const handleUseDefaults = () => {
    updateSettings({
      warmth: 50,
      directness: 50,
      humor: 'occasional',
      responseLength: 50,
    });
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="section-container">
        <div className="mb-8">
          <Logo size="md" />
        </div>

        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/therapist-selection')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src={selectedTherapist.photoUrl}
                alt={selectedTherapist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <h1 className="text-2xl font-bold">Customize Your Experience</h1>
                <p className="text-muted-foreground">with {selectedTherapist.name}</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              These adjustments fine-tune how {selectedTherapist.name.split(' ')[0]} communicates 
              while maintaining their core therapeutic approach.
            </p>
          </div>

          <div className="card-elevated p-8 space-y-8">
            <CustomizationSlider
              label="Warmth & Tone"
              leftLabel="More Professional"
              rightLabel="More Nurturing"
              description="Adjusts how formal or warm the language feels"
              value={settings.warmth}
              onChange={(value) => updateSettings({ warmth: value })}
            />

            <CustomizationSlider
              label="Directness Level"
              leftLabel="Gentle & Exploratory"
              rightLabel="Direct & Action-Oriented"
              description="How directly suggestions and observations are communicated"
              value={settings.directness}
              onChange={(value) => updateSettings({ directness: value })}
            />

            <HumorSelector
              value={settings.humor}
              onChange={(value) => updateSettings({ humor: value })}
            />

            <CustomizationSlider
              label="Response Length"
              leftLabel="Concise"
              rightLabel="Detailed"
              description="Whether responses are brief and focused or more expansive"
              value={settings.responseLength}
              onChange={(value) => updateSettings({ responseLength: value })}
            />
          </div>

          {/* Preview */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Preview
            </h3>
            <div className="card-elevated p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">You</span>
                </div>
                <p className="text-muted-foreground bg-muted rounded-xl px-4 py-2">
                  I had a really difficult day at work
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <img
                  src={selectedTherapist.photoUrl}
                  alt={selectedTherapist.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="bg-surface rounded-xl px-4 py-3 border border-border/50">
                  <p className="text-foreground">{generateSampleResponse()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handleUseDefaults}
              className="flex-1"
            >
              Use Default Settings
            </Button>
            <Button
              onClick={handleSave}
              className="btn-primary flex-1"
            >
              Save Customization
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
