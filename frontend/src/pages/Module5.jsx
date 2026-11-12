
import ModuleLearning from '../components/ModuleLearning'

const LESSONS = [
  {
    title: 'Understanding data collection',
    text: `Data collection is an important step in the research process.

The researcher selects a suitable method by considering the nature of the investigation, objectives, scope, financial resources, available time and desired accuracy.

Primary data can be collected through experiments or surveys.`,
    simple: `Data collection means gathering the information needed for research.

The researcher should choose a suitable method based on the topic, time, money and accuracy required.`,
  },
  {
    title: 'Methods of collecting data',
    text: `Data can be collected through different methods:

1. Observation: The investigator collects information by directly observing events.
2. Personal interview: The researcher asks questions directly to respondents.
3. Telephone interview: Information is collected through telephone conversations.
4. Questionnaires: Respondents answer a prepared set of questions.
5. Schedules: Trained enumerators collect information by filling in schedules based on respondents' answers.

Experiments can also be used to collect primary data and examine hypotheses.`,
    simple: `Some common ways to collect information are:

1. Observation: Watching and recording what happens.
2. Personal interview: Asking people questions directly.
3. Telephone interview: Asking questions over a phone call.
4. Questionnaire: Giving people a list of questions to answer.
5. Schedule: An investigator records answers given by respondents.

Experiments are another way of collecting data.`,
  },
  {
    title: 'Execution of the research project',
    text: `The research project should be carried out systematically and within the planned time.

The researcher should make sure that the collected data are adequate and dependable.

If interviewers are involved, they should be selected and trained properly.

Unexpected factors should also be monitored so that the quality and accuracy of the collected information are maintained.`,
    simple: `After planning the research, we should carry it out properly.

The work should be completed on time.

If people are collecting information through interviews, they should receive proper training.

We should also check whether the collected information is correct and reliable.`,
  },
  {
    title: 'Analysis of data',
    text: `After collecting data, the researcher should organize the raw information into useful categories.

The main operations include:

1. Editing: Improving the quality of collected data.
2. Coding: Converting data categories into symbols.
3. Tabulation: Arranging classified data in tables.
4. Analysis: Applying percentages, coefficients and statistical methods to examine the data.

Statistical tests can help determine whether the data support particular conclusions.`,
    simple: `Data analysis means organizing and studying the collected information.

1. Editing: Checking the data.
2. Coding: Giving symbols or codes to information.
3. Tabulation: Arranging information in tables.
4. Analysis: Using calculations and statistical methods to understand the results.`,
  },
]

function Module5() {
  return (
    <ModuleLearning
      moduleNumber={5}
      title="Collect and Analyze Data"
      description="Learn how to collect, organize and analyze research information."
      lessons={LESSONS}
    />
  )
}

export default Module5
