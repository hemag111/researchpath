
import ModuleLearning from '../components/ModuleLearning'

export const LESSONS = [
  {
    title: 'Understanding research reports',
    text: `After completing the research, the researcher prepares a report or thesis describing the work carried out.

The report communicates the research objectives, methodology, findings and conclusions.

A well-organized report helps readers understand the research clearly.`,
    simple: `A research report is a document that explains the research work.

It tells readers what the researcher studied, how the research was conducted and what was discovered.`,
  },
  {
    title: 'Structure of a research report',
    text: `The layout of a research report has three main parts:

1. Preliminary pages: Title, date, acknowledgements, foreword, table of contents and lists of tables, graphs and charts.
2. Main text: Introduction, summary of findings, main body and conclusion.
3. End matter: Appendices, bibliography and index.

Each section has a specific purpose in organizing the report.`,
    simple: `A research report is generally divided into three parts.

1. Beginning: Title, acknowledgements and table of contents.
2. Main section: Introduction, findings, explanation and conclusion.
3. Ending: Appendices, bibliography and index.

This structure makes the report easy to understand.`,
  },
  {
    title: 'Writing the main text',
    text: `The main text of a research report includes:

1. Introduction: Explains the research objectives, methodology, scope and limitations.
2. Summary of findings: Presents the important findings and recommendations in non-technical language.
3. Main body: Explains the research in a logical sequence using identifiable sections.
4. Conclusion: Summarizes the results clearly and precisely.`,
    simple: `The main part of a report explains the research.

The introduction tells what the research is about.

The findings explain what was discovered.

The main body gives the detailed explanation.

The conclusion summarizes the final results.`,
  },
  {
    title: 'Bibliography and good report writing',
    text: `The end matter of a research report includes appendices, bibliography and index.

A bibliography is a list of books, journals, reports and other materials consulted during the research.

A good report should be written in a concise and objective style using simple language.

Charts and illustrations should be included when they make information clearer. Relevant limitations and constraints should also be stated.`,
    simple: `At the end of a research report, we include additional information such as appendices and a bibliography.

A bibliography lists the books, journals and reports used by the researcher.

A good report should use simple, clear and objective language.

Charts should be used when they help readers understand the information.`,
  },
]

function Module6() {
  return (
    <ModuleLearning
      moduleNumber={6}
      title="Write and Cite"
      description="Learn how to organize a research report and list the sources consulted."
      lessons={LESSONS}
    />
  )
}

export default Module6
