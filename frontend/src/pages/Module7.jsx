
import ModuleLearning from '../components/ModuleLearning'

const LESSONS = [
  {
    title: 'Understanding research findings',
    text: `Research findings are the results obtained after collecting and analyzing information.

The researcher should present the findings clearly and explain what the results indicate.

The findings should be connected to the objectives and problem of the research.`,
    simple: `Research findings are what we discover after studying the collected information.

They explain what the research results tell us.`,
  },
  {
    title: 'Generalization and interpretation',
    text: `Generalization means arriving at broader conclusions based on research results.

When a hypothesis is tested and supported several times, the researcher may be able to develop a generalization.

Interpretation means explaining the findings with the help of an appropriate theory or understanding of the problem.`,
    simple: `Generalization means using research results to arrive at a broader conclusion.

Interpretation means explaining what the results actually mean.`,
  },
  {
    title: 'Preparing recommendations and conclusions',
    text: `A research report should summarize its findings and recommendations in a clear manner.

The conclusion should present the results of the research precisely.

Recommendations should be connected to the findings and the problem being investigated.

The researcher should avoid unclear statements and present information objectively.`,
    simple: `After completing research, the researcher explains the final results.

The conclusion tells what was learned.

Recommendations suggest what can be done based on the findings.

Both should be clear and related to the research.`,
  },
  {
    title: 'Communicating research results',
    text: `Research results should be communicated in a clear and organized way.

The report should follow a logical sequence and use simple, objective language.

Tables, charts and illustrations may be used when they make information easier to understand.

The summary of findings and recommendations should be presented in non-technical language so that readers can understand the important outcomes.`,
    simple: `After finishing research, we should explain our work so that others can understand it.

We can use clear language, tables and charts to explain the results.

The important findings and recommendations should be easy to understand.`,
  },
]

function Module7() {
  return (
    <ModuleLearning
      moduleNumber={7}
      title="Present"
      description="Learn how to communicate research findings, conclusions and recommendations."
      lessons={LESSONS}
    />
  )
}

export default Module7
