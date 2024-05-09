export const generateQAPromptMessages = [
    {
        role: 'system',
        content: `You are a german Gemeinschaftskunde teacher. Answer in German.

Use the following steps to respond to user inputs. Fully restate each step before proceeding.

Step 1: Review the provided text. If the text is not suitable for a social studies assignment, return "Not suitable". If it is suitable, proceed to Step 2.

Step 2: Decide which of the following question formats is best suited for the provided information:

Multiple Choice: This format is suitable when you want to assess recognition and recall of factual information. It is effective for testing specific knowledge and understanding of the content. Use this format when the information provided has clear, distinct facts or concepts that can be easily turned into questions with multiple answer options.
Short Answer: This format is ideal for testing a deeper understanding of the material and the ability to express it in a concise manner. Use this format when the information involves explanations, definitions, or any content that requires a brief written response to demonstrate comprehension.
Step 3: Based on the information in the provided text, create a question for your students in the chosen format from Step 2. The question should test the broad understanding of the subject 'Gemeinschaftskunde'. It should ask about a basic concept or piece of information, without focusing on specific details. This ensures that the assignment measures the students' ability to understand and apply key concepts.

Step 4: Based on the information in the provided text, create a answer for the question you created in Step 3. This serves as a solution for the students. Make sure that you follow the criteria of your chosen question format from step 2.

Step 5: Respond with a JSON object in the following format:
{
"question": "[The question you created for your students in Step 3.]",
"answer": "[The answer for the question you created in Step 4.]"
}`,
    },
    {
        role: 'user',
        content:
            'Wir werden daran erinnert, dass die Demokratie in Deutschland nicht ungefährdet ist. Die Demokratie kann in Deutschland nicht, wie in den alten Demokratien des Westens, auf eine ungebrochene Tradition zurückblicken. Die Geschichte der Demokratie in Deutschland war eine Geschichte gescheiterter Versuche. Erst der zweite demokratische Staat ist bisher, trotz aller Schwächen und Mängel, eine Erfolgsgeschichte gewesen. Viele betrachten diese Erfolge als selbstverständlich. Sie erwarten viele Leistungen vom Staat, halten aber selbst Distanz, weil sie meinen, "die da oben machen doch, was sie wollen".Manche haben ein idealisiertes Bild von einer harmonischen, problemlos funktionierenden Demokratie. Gemessen am Ideal schneidet die Realität schlecht ab. Eine harmonische, konfliktfreie Gesellschaft existiert jedoch nirgendwo. Wenn die Demokratie nicht die ideale Ordnung von Staat und Gesellschaft ist, so ist bisher jedenfalls noch keine bessere erfunden worden. Sie ist die einzige, die ein System von Spielregeln zur Verfügung stellt, in dem Konflikte friedlich ausgetragen, Kompromisse gefunden und Fehler korrigiert werden können.Aus: Pötzsch, Horst: Die Deutsche Demokratie. 5. überarbeitete und aktualisierte Auflage, Bonn: Bundeszentrale für politische Bildung 2009, S. 9-12.',
    },
    {
        role: 'assistant',
        content: `Step 1: Review the text

Der bereitgestellte Text ist für eine Gemeinschaftskunde-Aufgabe geeignet, da er die Herausforderungen und die historische Entwicklung der Demokratie in Deutschland diskutiert. Er reflektiert auch kritische Einstellungen der Bürger zur Demokratie und die Bedeutung eines Systems, das Konflikte friedlich lösen kann.

Step 2: Decide on a question format

Das geeignete Frageformat für diese Information ist die Kurzantwort. Der Text behandelt komplexe Themen wie die historische Entwicklung der Demokratie in Deutschland und die kritische Betrachtung ihrer Funktion durch die Bürger. Eine Kurzantwortfrage eignet sich gut, um das Verständnis dieser breiteren Themen zu testen.

Step 3: Create a Question

Was sind die Hauptgründe dafür, dass die Demokratie in Deutschland als nicht ideal angesehen wird?

Step 4: Create a Answer

Die Hauptgründe, warum die Demokratie in Deutschland als nicht ideal angesehen wird, sind die Erwartungshaltung der Bürger an den Staat, die oft mit einer gewissen Distanz und Skepsis gegenüber politischen Entscheidungsträgern einhergeht, sowie die idealisierte Vorstellung von einer harmonischen und konfliktfreien Gesellschaft, die in der Realität nicht existiert. Viele Bürger kritisieren, dass die politischen Führer "doch machen, was sie wollen", und sind enttäuscht, dass die Realität nicht dem Ideal einer perfekten Demokratie entspricht.

Step 5: Respond with a JSON object:

{
  "question": "Was sind die Hauptgründe dafür, dass die Demokratie in Deutschland als nicht ideal angesehen wird?",
  "answer": "Die Hauptgründe, warum die Demokratie in Deutschland als nicht ideal angesehen wird, sind die Erwartungshaltung der Bürger an den Staat, die oft mit einer gewissen Distanz und Skepsis gegenüber politischen Entscheidungsträgern einhergeht, sowie die idealisierte Vorstellung von einer harmonischen und konfliktfreien Gesellschaft, die in der Realität nicht existiert. Viele Bürger kritisieren, dass die politischen Führer 'doch machen, was sie wollen', und sind enttäuscht, dass die Realität nicht dem Ideal einer perfekten Demokratie entspricht."
}`,
    },
    {
        role: 'user',
        content: `Dem Bund stehen vor allem die meisten Verbrauchssteuern (auf Mineralöl, Tabak, Branntwein, Kaffee) und die Versicherungssteuer zu. Die Länder erheben vor allem die Kraftfahrzeugsteuer, die Erbschafts- und die Grunderwerbssteuer sowie die Biersteuer.Bund und Ländern gemeinsam stehen zu: die Lohn- und Einkommenssteuer, die Umsatzsteuer (Mehrwertsteuer) sowie die Körperschaftssteuer. Diese Gemeinschaftssteuern sind die ertragreichsten Steuern. Sie machen 70 Prozent der gesamten Steuereinnahmen aus. Ihr Aufkommen wird nach einem bestimmten Schlüssel aufgeteilt. Von der Lohn- und Einkommenssteuer erhalten die Gemeinden 15 Prozent. Bund und Länder teilensichdierestlichen85Prozent.DieKörperschaftssteuerstehtjezurHälfteBundundLändernzu.DieAufteilungderUmsatzsteueristnachArt.106Abs.4neufestzusetzen,
        \"wenn sich das Verhältnis zwischen den Einnahmen und Ausgaben des Bundes und der Länder wesentlich anders entwickelt (...)\". Einer solchen Neufestsetzung gehen regelmäßig heftige politische Auseinandersetzungen voraus, bis schließlich ein Kompromiss gefunden wird. Seit 2008 erhalten die Gemeinden 2 Prozent des Umsatzsteueraufkommens. Das verbleibende Aufkommen steht dem Bund zu 54,7 Prozent und den Ländern zu 43,3 Prozent zu.`,
    },
    {
        role: 'assistant',
        content: `Schritt 1: Überprüfung des Textes:
Der Text behandelt die Verteilung von Steuereinnahmen zwischen Bund, Ländern und Gemeinden in Deutschland. Er erläutert, welche Steuerarten von welcher Ebene erhoben werden und wie die Einnahmen aus den Gemeinschaftssteuern verteilt werden. Dies ist ein geeignetes Thema für eine Gemeinschaftskunde-Aufgabe, da es grundlegende Kenntnisse über die Finanzverwaltung und die politischen Prozesse innerhalb des föderalen Systems Deutschlands vermittelt.

Schritt 2: Entscheidung über das Frageformat:
Für diese Art von Information eignet sich das Multiple-Choice-Format am besten. Es gibt klare, spezifische Fakten über die Steuerarten und ihre Verteilung, die gut in eine Frage mit mehreren Antwortmöglichkeiten umgesetzt werden können.

Schritt 3: Erstellung einer Frage:
Welche der folgenden Aussagen zur Verteilung der Steuereinnahmen in Deutschland ist korrekt?<br>A) Die Gemeinden erhalten 15% der Umsatzsteuer.<br>B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.<br>C) Die Länder erheben die Mehrwertsteuer vollständig.<br>D) Der Bund erhält die gesamten Einnahmen aus der Biersteuer.

Schritt 4: Erstellung einer Antwort:
Die korrekte Antwort ist B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.

Schritt 5: Antwort im JSON-Format:
{
  "question": "Welche der folgenden Aussagen zur Verteilung der Steuereinnahmen in Deutschland ist korrekt?<br>A) Die Gemeinden erhalten 15% der Umsatzsteuer.<br>B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt.<br>C) Die Länder erheben die Mehrwertsteuer vollständig.<br>D) Der Bund erhält die gesamten Einnahmen aus der Biersteuer.",
  "answer": "B) Die Körperschaftssteuer wird zu gleichen Teilen zwischen Bund und Ländern aufgeteilt."
}`,
    },
    {
        role: 'user',
        content: `Demokratie heißt wörtlich \"Herrschaft des Volkes\". Über die eigene Regierung mitbestimmen, frei die eigene Meinung äußern: in Deutschland sind das relativ junge Errungenschaften.
        Das Hambacher Schloss bei Neustadt an der Weinstraße. Am 27. Mai 1832 demonstrierten hier etwa 30.000 Menschen für Freiheit, Demokratie und nationale Einheit (© AP)
        Demokratien wollen nahezu alle Länder der heutigen Welt sein. Kaum ein politisches Regime bezeichnet sich nicht als demokratisch. Selbst autoritäre Herrschaftssysteme in Asien, Afrika und Lateinamerika berufen sich ebenso auf die Demokratie wie traditionell demokratische Länder der westlichen Welt. Das galt gleichermaßen für die zusammengebrochenen \"realsozialistischen\" Systeme Mittel- und Osteuropas, die sich als \"Volksdemokratie\" oder \"sozialistische Demokratie\" bezeichneten.`,
    },
    {
        role: 'assistant',
        content: `Step 1: Review the text

Der bereitgestellte Text ist für eine Gemeinschaftskunde-Aufgabe geeignet, da er das Konzept der Demokratie, seinen historischen Kontext in Deutschland und den universellen Anspruch verschiedener politischer Regime auf der ganzen Welt auf demokratische Prinzipien diskutiert.

Step 2: Decide on a question format

Das geeignete Frageformat für diese Information ist die Kurzantwort. Der Text behandelt komplexe Konzepte wie Demokratie, ihre historische Entwicklung und ihre unterschiedliche Anwendung weltweit. Eine Kurzantwortfrage eignet sich gut, um das Verständnis dieser breiteren Themen zu testen.

Step 3: Create a Question

Was bedeutet der Begriff "Demokratie"?

Step 4: Create a Answer

Der Begriff "Demokratie" stammt aus dem Griechischen und bedeutet wörtlich "Herrschaft des Volkes". In einer Demokratie haben die Bürger das Recht, über ihre Regierung mitzubestimmen und ihre Meinung frei zu äußern. Historisch gesehen konnte das Volk in kleinen Gemeinschaften direkt über Gesetze abstimmen, wie in den antiken griechischen Stadtstaaten. In modernen Großstaaten wird die Demokratie meist indirekt ausgeübt, indem die Bürger Repräsentanten wählen, die dann in ihrem Namen Entscheidungen treffen.

Step 5: Respond with a JSON object:

{
  "question": "Was bedeutet der Begriff "Demokratie"?",
  "answer": "Der Begriff "Demokratie" stammt aus dem Griechischen und bedeutet wörtlich "Herrschaft des Volkes". In einer Demokratie haben die Bürger das Recht, über ihre Regierung mitzubestimmen und ihre Meinung frei zu äußern. Historisch gesehen konnte das Volk in kleinen Gemeinschaften direkt über Gesetze abstimmen, wie in den antiken griechischen Stadtstaaten. In modernen Großstaaten wird die Demokratie meist indirekt ausgeübt, indem die Bürger Repräsentanten wählen, die dann in ihrem Namen Entscheidungen treffen."
}`,
    },
    {
        role: 'user',
        content: `Seit mehr als 40 Jahren, zuletzt im Jahr 2009, beantworten drei Viertel der Bürgerinnen und Bürger der Bundesrepublik (West) eine Frage des Instituts für Demoskopie, Allensbach – "Glauben Sie, die Demokratie, die wir in der Bundesrepublik haben, ist die beste Staatsform, oder gibt es eine andere, die besser ist?" – positiv: "Die Demokratie ist die beste Staatsform." Die Zahl derer, die eine andere Staatsform vorziehen würden, pendelt zwischen 4 und 18 Prozent. In den neuen Bundesländern hielten 2009 36 Prozent die Demokratie für die beste Staatsform, 24 Prozent glaubten, dass es eine bessere gibt. Die größte Gruppe sind die Unentschiedenen. Eine Umfrage des Polis-Sinus-Instituts im Auftrag der Friedrich-Ebert-Stiftung im Jahre 2008 mit einer etwas anderen Fragestellung – "Wie gut funktioniert die Demokratie in Deutschland?" – kam zu ähnlichen Ergebnissen. 62 Prozent aller Deutschen sind zufrieden (8 Prozent: funktioniert sehr gut, weitere 54 Prozent: gut). Kritisch waren 37 Prozent (31 Prozent: weniger gut, 6 Prozent: schlecht). In Westdeutschland waren 69 Prozent mit der Demokratie zufrieden, in Ostdeutschland 39 Prozent. Negativ äußerten sich 31 Prozent im Westen und 61 Prozent im Osten.Es zeigt sich, dass die Zufriedenheit mit der Demokratie weitgehend abhängig ist von der eigenen wirtschaftlichen Lage. Arbeitslose, Hartz-IV-Empfänger und Personen mit niedrigem Haushaltseinkommen sind überproportional kritisch; sie machen das politische System für ihre Lage verantwortlich. Immerhin hält eine große Mehrheit der Deutschen unsere Gesellschaftsordnung für verteidigungswert. 78 Prozent der Deutschen sagen, unsere Gesellschaftsordnung ist es wert, dass man für sie eintritt.

`,
    },
    {
        role: 'assistant',
        content: `Step 1: Review the text

Der bereitgestellte Text ist für eine Gemeinschaftskunde-Aufgabe geeignet, da er sich mit der Einstellung der deutschen Bevölkerung zur Demokratie befasst und wie diese Einstellungen durch verschiedene Umfragen gemessen wurden. Der Text thematisiert auch den Zusammenhang zwischen wirtschaftlicher Lage und politischer Zufriedenheit.

Step 2: Decide on a question format

Für diese Information ist das Multiple-Choice-Format am besten geeignet. Der Text liefert spezifische statistische Daten und Meinungen, die gut in eine Frage mit mehreren Antwortmöglichkeiten umgewandelt werden können, um das Verständnis und die Erinnerung an die Fakten zu testen.

Step 3: Create a Question

Wie hoch war der Prozentsatz der Bürger in den neuen Bundesländern, die 2009 die Demokratie als die beste Staatsform ansahen?<br>A) 36%<br>B) 24%<br>C) 62%<br>D) 78%

Step 4: Create a Answer

A) 36%

Step 5: Respond with a JSON object:

{
  "question": "Wie hoch war der Prozentsatz der Bürger in den neuen Bundesländern, die 2009 die Demokratie als die beste Staatsform ansahen?<br>A) 36%<br>B) 24%<br>C) 62%<br>D) 78%",
  "answer": "A) 36%"
}`,
    },
    {
        role: 'user',
        content: `Grundgesetz                                                                                                                                     Horst Pötzsch                                                                                                                                      15.12.2009                                      / 6 Minuten zu lesen                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         Link kopieren
      `,
    },
    {
        role: 'assistant',
        content: `Step 1: Review the text

Der bereitgestellte Text ist nicht geeignet für eine Gemeinschaftskunde-Aufgabe, da er nur einen Titel und einige Metadaten enthält, aber keine Inhalte, die für eine Aufgabe geeignet wären.

Not suitable`,
    },
]
