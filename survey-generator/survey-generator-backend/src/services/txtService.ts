interface SurveyItem {
  question: string;
  responseType: 'likert' | 'multiple_choice' | 'text';
  scaleRange?: {
    min: number;
    max: number;
    labels?: string[];
  };
  options?: string[];
}

interface SurveyData {
  scaleName: string;
  instructions?: string;
  items: SurveyItem[];
}

export class TXTService {
  /**
   * Generate Qualtrics Simple Format TXT from survey data
   */
  generateTXT(surveyData: SurveyData): string {
    const lines: string[] = [];
    
    // Add scale name as a text/graphic block at the beginning
    lines.push(`[[Block:${surveyData.scaleName}]]`);
    lines.push('');
    
    // Add instructions if present
    if (surveyData.instructions) {
      lines.push('Instructions.');
      lines.push(surveyData.instructions);
      lines.push('');
      lines.push('');
    }
    
    // Process each item
    surveyData.items.forEach((item, index) => {
      const questionNumber = index + 1;
      const exportTag = `Q${questionNumber}.`;
      
      // Add question with export tag
      lines.push(`${exportTag} ${item.question}`);
      lines.push('');
      
      // Add response options based on type
      if (item.responseType === 'likert' && item.scaleRange) {
        // Check if we have complete labels for ALL points
        const totalPoints = item.scaleRange.max - item.scaleRange.min + 1;
        const hasCompleteLabels = item.scaleRange.labels && 
          item.scaleRange.labels.length === totalPoints &&
          item.scaleRange.labels.every(label => label && label.trim() !== '');
        
        // For likert scales, list each scale point
        for (let i = item.scaleRange.min; i <= item.scaleRange.max; i++) {
          const labelIndex = i - item.scaleRange.min;
          let scalePoint: string;
          
          if (hasCompleteLabels && item.scaleRange.labels) {
            // If we have complete labels for ALL points, use labels
            scalePoint = item.scaleRange.labels[labelIndex];
          } else {
            // Otherwise, use numbers for ALL points (consistency)
            scalePoint = i.toString();
          }
          
          lines.push(scalePoint);
        }
      } else if (item.responseType === 'multiple_choice' && item.options) {
        // For multiple choice, list each option
        item.options.forEach(option => {
          lines.push(option);
        });
      }
      // For text entry, no choices needed - it will automatically become text entry
      
      // Add blank lines between questions
      lines.push('');
      lines.push('');
    });
    
    // Remove trailing blank lines
    while (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    
    return lines.join('\n');
  }

  /**
   * Generate a downloadable TXT file
   */
  generateFile(surveyData: SurveyData): Buffer {
    const txtContent = this.generateTXT(surveyData);
    return Buffer.from(txtContent, 'utf-8');
  }
}

export default new TXTService();