export function checkKeywordsInAnswer(answer: string): boolean | undefined {
    const negativeKeywords = ["nicht korrekt", "nicht richtig", "nicht ganz korrekt", "nicht ganz richtig", "interessanter ansatz", "interessanter punkt", "interessanter gedanke"];
    const positiveKeywords = ["ist richtig", "ist korrekt", "sehr gut", "gut gemacht"];

    const answerLowerCase = answer.toLowerCase();

    for (const keyword of negativeKeywords) {
        if (answerLowerCase.includes(keyword)) {
            return false;
        }
    }

    for (const keyword of positiveKeywords) {
        if (answerLowerCase.includes(keyword)) {
            return true;
        }
    }

    return undefined;
}