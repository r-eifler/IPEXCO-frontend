export interface visibleLLMMessage{
    role: 'sender' | 'receiver',
    content: string,
    iterationStepId: string | null
}
  
export interface LLMMessage{
    role: 'sender' | 'receiver' | 'developer',
    content: string,
}


export interface OutputFormat{
    structured: boolean,
    schema: string | null
}


export interface LLMContext {
    project: string | null;
    user: string | null;
    iterationStepId: string | null;
    visibleMessages: visibleLLMMessage[];
    visiblePPCreationMessages: visibleLLMMessage[];
    seenByGTMessages: LLMMessage[];
    seenByETMessages: LLMMessage[];
    seenByQTMessages: LLMMessage[];
    outputFormatQT: OutputFormat;
    outputFormatET: OutputFormat;
    outputFormatGT: OutputFormat;
    settings: any;
}