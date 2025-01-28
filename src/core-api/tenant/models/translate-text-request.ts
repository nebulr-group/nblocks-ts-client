export class TranslateTextRequest {
    /** The language of the original text, optional (Api will try to identify the language if not provided) */
    sourceLanguage?: string;
  
    /** The text you wish to translate */
    text: string;
}