export const generateQAPromptMessage = {
  role: 'system',
  content: `You are a German teacher. Please speak in a clear and simple manner that is appropriate for Middle School students (Grades 7-9). You are not allowed to say "im Text", because the students don't have the provided text. Answer in German. 

    Use the following steps to respond to user inputs. Fully restate each step before proceeding.

    Step 1: Review the provided text and decide whether the text  is suitable for a assignment. If it is suitable answer with: "Geeignet, da [erklärung]", otherwise answer with "Nicht geeignet, da". If it is suitable, proceed to Step 2.

    Step 2: Without creating a question decide which of the following question formats is best suited for the provided information. Answer with the name of the choosen format: 
      - Short-Answer: "Use this format when the information is good to test exact knwoledge and understanding of certain facts or concepts. This format is ideal for testing conceptual and abstract learning content." 
      - Multiple-Choice: "Use this format when the information is good to test the knowledge about facts or certain numbers. This format is ideal for testing a broad range of content."

    Step 3: Based on the information in the provided text and the chosen format from Step 2., formulate a question that meets the following criteria:
    - Must be clear and concise.
    - Must focus on a single aspect.
    - Should be appropriate for Middle School students (Grades 7-9).
    - Is in German.
    - You are not allowed to say "in dem Text/im Text", because the students don't have the provided text.
    - If the question format is Multiple Choice, provide the answer options in the question.

    Step 4: Based on the information in the provided text, create a detailed answer for the question you created in Step 3. This serves as a solution for the students. Make sure that you follow the criteria of your chosen question format from step 2.

    Step 5: Now use the answer from Step 4. to create a concise answer.

    Step 6: Respond with a JSON object with the following format:
    {
    "question": "[The question you created for your students in Step 3.]",
    "answer": "[The answer for the question you created in Step 4.]"
    "conciseAnswer": "[The concise answer you created in Step 5.]"
    }`,
}

// - Multiple-Choice: This format is suitable when you want to assess recognition and recall of factual information. It is effective for testing specific knowledge and understanding of the content. Use this format when the information provided has clear, distinct facts or concepts that can be easily turned into questions with multiple answer options.
// - Short-Answer: This format is ideal for testing a deeper understanding of the material and the ability to express it in a concise manner. Use this format when the information involves explanations, definitions, or any content that requires a brief written response to demonstrate comprehension.

export const distributionOfTaxRevenuesExample = [
  {
    role: 'user',
    content: `Dem Bund stehen vor allem die meisten Verbrauchssteuern (auf Mineralöl, Tabak, Branntwein, Kaffee) und die Versicherungssteuer zu. Die Länder erheben vor allem die Kraftfahrzeugsteuer, die Erbschafts- und die Grunderwerbssteuer sowie die Biersteuer.Bund und Ländern gemeinsam stehen zu: die Lohn- und Einkommenssteuer, die Umsatzsteuer (Mehrwertsteuer) sowie die Körperschaftssteuer. Diese Gemeinschaftssteuern sind die ertragreichsten Steuern. Sie machen 70 Prozent der gesamten Steuereinnahmen aus. Ihr Aufkommen wird nach einem bestimmten Schlüssel aufgeteilt. Von der Lohn- und Einkommenssteuer erhalten die Gemeinden 15 Prozent. Bund und Länder teilensichdierestlichen85Prozent.DieKörperschaftssteuerstehtjezurHälfteBundundLändernzu.DieAufteilungderUmsatzsteueristnachArt.106Abs.4neufestzusetzen,
        'wenn sich das Verhältnis zwischen den Einnahmen und Ausgaben des Bundes und der Länder wesentlich anders entwickelt (...)'. Einer solchen Neufestsetzung gehen regelmäßig heftige politische Auseinandersetzungen voraus, bis schließlich ein Kompromiss gefunden wird. Seit 2008 erhalten die Gemeinden 2 Prozent des Umsatzsteueraufkommens. Das verbleibende Aufkommen steht dem Bund zu 54,7 Prozent und den Ländern zu 43,3 Prozent zu.`,
  },
  {
    role: 'assistant',
    content: `Step 1. Review the text:
        Geeignet, da der Text die Verteilung von Steuereinnahmen zwischen Bund, Ländern und Gemeinden sowie die Erhebung und Verteilung der Gemeinschaftssteuern erläutert und grundlegende Kenntnisse über die Finanzverwaltung und politischen Prozesse im föderalen System Deutschlands vermittelt.

        Step 2. Decide on a question format:
        Multiple-Choice

        Step 3. Create a Question:
        Welche der folgenden Aussagen zur Verteilung der Steuereinnahmen in Deutschland ist korrekt?<br>A) Die Gemeinden erhalten 15% der Umsatzsteuer.<br>B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.<br>C) Die Länder erheben die Mehrwertsteuer vollständig.<br>D) Der Bund erhält die gesamten Einnahmen aus der Biersteuer.

        Step 4. Create a detailed Answer:
        B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.

        Step 5. Create a concise Answer:
        B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.

        Step 6. Respond with a JSON object:
        {
          "question": "Welche der folgenden Aussagen zur Verteilung der Steuereinnahmen in Deutschland ist korrekt?<br>A) Die Gemeinden erhalten 15% der Umsatzsteuer.<br>B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.<br>C) Die Länder erheben die Mehrwertsteuer vollständig.<br>D) Der Bund erhält die gesamten Einnahmen aus der Biersteuer.",
          "answer": "B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt."
          "conciseAnswer": "B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt."
        }`,
  },
]

export const democracyNotIdealExample = [
  {
    role: 'user',
    content:
      'Wir werden daran erinnert, dass die Demokratie in Deutschland nicht ungefährdet ist. Die Demokratie kann in Deutschland nicht, wie in den alten Demokratien des Westens, auf eine ungebrochene Tradition zurückblicken. Die Geschichte der Demokratie in Deutschland war eine Geschichte gescheiterter Versuche. Erst der zweite demokratische Staat ist bisher, trotz aller Schwächen und Mängel, eine Erfolgsgeschichte gewesen. Viele betrachten diese Erfolge als selbstverständlich. Sie erwarten viele Leistungen vom Staat, halten aber selbst Distanz, weil sie meinen, "die da oben machen doch, was sie wollen".Manche haben ein idealisiertes Bild von einer harmonischen, problemlos funktionierenden Demokratie. Gemessen am Ideal schneidet die Realität schlecht ab. Eine harmonische, konfliktfreie Gesellschaft existiert jedoch nirgendwo. Wenn die Demokratie nicht die ideale Ordnung von Staat und Gesellschaft ist, so ist bisher jedenfalls noch keine bessere erfunden worden. Sie ist die einzige, die ein System von Spielregeln zur Verfügung stellt, in dem Konflikte friedlich ausgetragen, Kompromisse gefunden und Fehler korrigiert werden können.Aus: Pötzsch, Horst: Die Deutsche Demokratie. 5. überarbeitete und aktualisierte Auflage, Bonn: Bundeszentrale für politische Bildung 2009, S. 9-12.',
  },
  {
    role: 'assistant',
    content: `Step 1. Review the text:
      Geeignet, da der Text die Herausforderungen und historische Entwicklung der Demokratie in Deutschland sowie die kritischen Einstellungen der Bürger und die Bedeutung eines friedlichen Konfliktlösungsmechanismus diskutiert.

      Step 2. Decide on a question format:
      Short-Answer

      Step 3. Create a Question:
      Was sind die Hauptgründe dafür, dass die Demokratie in Deutschland als nicht ideal angesehen wird?

      Step 4. Create a detailed Answer:
      Die Hauptgründe, warum die Demokratie in Deutschland als nicht ideal angesehen wird, sind die Erwartungshaltung der Bürger an den Staat, die oft mit einer gewissen Distanz und Skepsis gegenüber politischen Entscheidungsträgern einhergeht, sowie die idealisierte Vorstellung von einer harmonischen und konfliktfreien Gesellschaft, die in der Realität nicht existiert. Viele Bürger kritisieren, dass die politischen Führer 'doch machen, was sie wollen', und sind enttäuscht, dass die Realität nicht dem Ideal einer perfekten Demokratie entspricht.

      Step 5. Create a concise Answer:
      Die Demokratie in Deutschland gilt als nicht ideal, da Bürger hohe Erwartungen haben, aber skeptisch gegenüber Politikern sind und eine unrealistische, konfliktfreie Gesellschaft erwarten. Sie kritisieren eigenmächtiges Handeln der Politiker und sind enttäuscht von der Realität.

      Step 6. Respond with a JSON object:
      {
        "question": "Was sind die Hauptgründe dafür, dass die Demokratie in Deutschland als nicht ideal angesehen wird?",
        "answer": "Die Hauptgründe, warum die Demokratie in Deutschland als nicht ideal angesehen wird, sind die Erwartungshaltung der Bürger an den Staat, die oft mit einer gewissen Distanz und Skepsis gegenüber politischen Entscheidungsträgern einhergeht, sowie die idealisierte Vorstellung von einer harmonischen und konfliktfreien Gesellschaft, die in der Realität nicht existiert. Viele Bürger kritisieren, dass die politischen Führer 'doch machen, was sie wollen', und sind enttäuscht, dass die Realität nicht dem Ideal einer perfekten Demokratie entspricht.",
        "conciseAnswer": "Die Demokratie in Deutschland gilt als nicht ideal, da Bürger hohe Erwartungen haben, aber skeptisch gegenüber Politikern sind und eine unrealistische, konfliktfreie Gesellschaft erwarten. Sie kritisieren eigenmächtiges Handeln der Politiker und sind enttäuscht von der Realität."
      }`,
  },
]

export const meaningDemocracyExample = [
  {
    role: 'user',
    content: `Demokratie heißt wörtlich 'Herrschaft des Volkes'. Über die eigene Regierung mitbestimmen, frei die eigene Meinung äußern: in Deutschland sind das relativ junge Errungenschaften.
        Das Hambacher Schloss bei Neustadt an der Weinstraße. Am 27. Mai 1832 demonstrierten hier etwa 30.000 Menschen für Freiheit, Demokratie und nationale Einheit (© AP)
        Demokratien wollen nahezu alle Länder der heutigen Welt sein. Kaum ein politisches Regime bezeichnet sich nicht als demokratisch. Selbst autoritäre Herrschaftssysteme in Asien, Afrika und Lateinamerika berufen sich ebenso auf die Demokratie wie traditionell demokratische Länder der westlichen Welt. Das galt gleichermaßen für die zusammengebrochenen 'realsozialistischen' Systeme Mittel- und Osteuropas, die sich als 'Volksdemokratie' oder 'sozialistische Demokratie' bezeichneten.`,
  },
  {
    role: 'assistant',
    content: `Step 1. Review the text:
        Geeignet, da der Text das Konzept der Demokratie, seinen historischen Kontext in Deutschland und den universellen Anspruch verschiedener politischer Regime auf demokratische Prinzipien diskutiert.

        Step 2. Decide on a question format:
        Short-Answer

        Step 3. Create a Question:
        Was bedeutet der Begriff Demokratie?

        Step 4. Create a detailed Answer:
        Der Begriff 'Demokratie' stammt aus dem Griechischen und bedeutet wörtlich 'Herrschaft des Volkes'. In einer Demokratie haben die Bürger das Recht, über ihre Regierung mitzubestimmen und ihre Meinung frei zu äußern. Historisch gesehen konnte das Volk in kleinen Gemeinschaften direkt über Gesetze abstimmen, wie in den antiken griechischen Stadtstaaten. In modernen Großstaaten wird die Demokratie meist indirekt ausgeübt, indem die Bürger Repräsentanten wählen, die dann in ihrem Namen Entscheidungen treffen.

        Step 5. Create a concise Answer:
        Herrschaft des Volkes

        Step 6. Respond with a JSON object:
        {
          "question": "Was bedeutet der Begriff 'Demokratie'?",
          "answer": "Der Begriff 'Demokratie' stammt aus dem Griechischen und bedeutet wörtlich 'Herrschaft des Volkes'. In einer Demokratie haben die Bürger das Recht, über ihre Regierung mitzubestimmen und ihre Meinung frei zu äußern. Historisch gesehen konnte das Volk in kleinen Gemeinschaften direkt über Gesetze abstimmen, wie in den antiken griechischen Stadtstaaten. In modernen Großstaaten wird die Demokratie meist indirekt ausgeübt, indem die Bürger Repräsentanten wählen, die dann in ihrem Namen Entscheidungen treffen."
          "conciseAnswer": "Herrschaft des Volkes"
        }`,
  },
]

export const contentNotSuitableExample = [
  {
    role: 'user',
    content: `Demokratie                                                                                                                                     Horst Pötzsch                                                                                                                                      15.12.2009
                                              / 5 Minuten zu lesen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Link kopieren`,
  },
  {
    role: 'assistant',
    content: `Step 1. Review the text:
        Nicht geeignet, da der Text nur einen Titel und einige Metadaten enthält, aber keine Inhalte, die für eine Aufgabe geeignet wären.
    }`,
  },
]
