export class TranslateTextResponse {
    // The translated text
    translatedText: string;
  
    // The language of the translated text
    targetLanguageCode: string;
  
    // The language of the source text. If auto, this is the identified language
    sourceLanguageCode: string;
  }