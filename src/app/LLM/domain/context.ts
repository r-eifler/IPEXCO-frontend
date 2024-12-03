export interface LLMContext {
    _id?: string;
    threadIdQT: string;
    threadIdGT: string;
    threadIdET: string;
    visibleMessages: visibleLLMMessage[];
    visiblePPCreationMessages: visibleLLMMessage[];
    seenByGTMessages: LLMMessage[];
    seenByETMessages: LLMMessage[];
    seenByQTMessages: LLMMessage[];
    project: string | null;
}

export interface visibleLLMMessage{
    role: 'sender' | 'receiver',
    content: string,
    iterationStepId: string | null
}
  
export interface LLMMessage{
    role: 'sender' | 'receiver',
    content: string,
}
