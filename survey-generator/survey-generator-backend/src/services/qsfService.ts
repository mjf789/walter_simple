interface QSFSurvey {
  SurveyEntry: {
    SurveyID: string;
    SurveyName: string;
    SurveyDescription: string;
    SurveyOwnerID: string;
    SurveyBrandID: string;
    DivisionID: string | null;
    SurveyLanguage: string;
    SurveyActiveResponseSet: string;
    SurveyStatus: string;
    SurveyStartDate: string;
    SurveyExpirationDate: string | null;
    SurveyCreationDate: string;
    CreatorID: string;
    LastModified: string;
    LastAccessed: string;
    LastActivated: string | null;
    Deleted: string | null;
  };
  SurveyElements: Array<{
    SurveyID: string;
    Element: string;
    PrimaryAttribute: string;
    SecondaryAttribute: string | null;
    TertiaryAttribute: string | null;
    Payload: any;
  }>;
}

interface ScaleItem {
  question: string;
  responseOptions?: string[];
  responseType: 'likert' | 'multiple_choice' | 'text' | 'numeric';
  scaleRange?: { min: number; max: number; labels?: string[] };
}

class QSFService {
  generateQSF(
    scaleName: string,
    items: ScaleItem[],
    instructions?: string
  ): QSFSurvey {
    const surveyId = `SV_${this.generateId()}`;
    const timestamp = new Date().toISOString();

    const survey: QSFSurvey = {
      SurveyEntry: {
        SurveyID: surveyId,
        SurveyName: scaleName,
        SurveyDescription: instructions || `Generated survey for ${scaleName}`,
        SurveyOwnerID: 'UR_XXXXXXXXX',
        SurveyBrandID: 'BRD_XXXXXXXXX',
        DivisionID: null,
        SurveyLanguage: 'EN',
        SurveyActiveResponseSet: 'RS_XXXXXXXXX',
        SurveyStatus: 'Inactive',
        SurveyStartDate: timestamp,
        SurveyExpirationDate: null,
        SurveyCreationDate: timestamp,
        CreatorID: 'UR_XXXXXXXXX',
        LastModified: timestamp,
        LastAccessed: timestamp,
        LastActivated: null,
        Deleted: null
      },
      SurveyElements: []
    };

    // Add survey flow
    survey.SurveyElements.push({
      SurveyID: surveyId,
      Element: 'FL',
      PrimaryAttribute: 'Survey Flow',
      SecondaryAttribute: null,
      TertiaryAttribute: null,
      Payload: {
        Type: 'Root',
        FlowID: 'FL_1',
        Flow: [
          {
            Type: 'Standard',
            ID: 'BL_1',
            FlowID: 'FL_2'
          }
        ]
      }
    });

    // Add survey block
    const blockPayload = {
      Type: 'Default',
      Description: scaleName,
      ID: 'BL_1',
      BlockElements: items.map((_, index) => ({
        Type: 'Question',
        QuestionID: `QID${index + 1}`
      }))
    };

    survey.SurveyElements.push({
      SurveyID: surveyId,
      Element: 'BL',
      PrimaryAttribute: 'Survey Blocks',
      SecondaryAttribute: null,
      TertiaryAttribute: null,
      Payload: {
        '1': blockPayload
      }
    });

    // Add questions
    items.forEach((item, index) => {
      const questionId = `QID${index + 1}`;
      const questionPayload = this.createQuestionPayload(item, questionId);

      survey.SurveyElements.push({
        SurveyID: surveyId,
        Element: 'SQ',
        PrimaryAttribute: questionId,
        SecondaryAttribute: null,
        TertiaryAttribute: null,
        Payload: questionPayload
      });
    });

    return survey;
  }

  private createQuestionPayload(item: ScaleItem, questionId: string): any {
    const basePayload = {
      QuestionID: questionId,
      QuestionText: item.question,
      DataExportTag: `Q${questionId}`,
      QuestionType: 'MC',
      Selector: 'SAVR',
      Configuration: {
        QuestionDescriptionDisplay: 'UseText'
      },
      QuestionDescription: item.question,
      Validation: {
        Settings: {
          ForceResponse: 'OFF',
          Type: 'None'
        }
      },
      Language: []
    };

    if (item.responseType === 'likert' && item.scaleRange) {
      const choices: any = {};
      const choiceOrder: number[] = [];

      for (let i = item.scaleRange.min; i <= item.scaleRange.max; i++) {
        choices[i] = {
          Display: item.scaleRange.labels ? 
            item.scaleRange.labels[i - item.scaleRange.min] : 
            i.toString()
        };
        choiceOrder.push(i);
      }

      return {
        ...basePayload,
        Choices: choices,
        ChoiceOrder: choiceOrder,
        Selector: 'SAVR',
        SubSelector: 'TX'
      };
    } else if (item.responseType === 'multiple_choice' && item.responseOptions) {
      const choices: any = {};
      const choiceOrder: number[] = [];

      item.responseOptions.forEach((option, index) => {
        const choiceId = index + 1;
        choices[choiceId] = { Display: option };
        choiceOrder.push(choiceId);
      });

      return {
        ...basePayload,
        Choices: choices,
        ChoiceOrder: choiceOrder,
        Selector: 'SAVR'
      };
    } else if (item.responseType === 'text') {
      return {
        ...basePayload,
        QuestionType: 'TE',
        Selector: 'SL',
        Configuration: {
          ...basePayload.Configuration,
          QuestionDescriptionDisplay: 'UseText'
        }
      };
    }

    return basePayload;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  exportToFile(survey: QSFSurvey): string {
    return JSON.stringify(survey, null, 2);
  }

  validateQSF(survey: QSFSurvey): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!survey.SurveyEntry?.SurveyID) {
      errors.push('Missing SurveyID');
    }

    if (!survey.SurveyElements || survey.SurveyElements.length === 0) {
      errors.push('No survey elements defined');
    }

    const hasFlow = survey.SurveyElements.some(el => el.Element === 'FL');
    const hasBlock = survey.SurveyElements.some(el => el.Element === 'BL');
    const hasQuestions = survey.SurveyElements.some(el => el.Element === 'SQ');

    if (!hasFlow) errors.push('Missing survey flow');
    if (!hasBlock) errors.push('Missing survey block');
    if (!hasQuestions) errors.push('No questions defined');

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default new QSFService();