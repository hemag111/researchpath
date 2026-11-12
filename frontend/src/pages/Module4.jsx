
import ModuleLearning from '../components/ModuleLearning'

export const LESSONS = [
  {
    title: 'Understanding research design',
    text: `Research design refers to the conceptual structure within which research is conducted.

It provides a plan for carrying out the research and helps the researcher decide how the study will be organized.

A suitable research design is selected according to the research problem and objectives.`,
    simple: `Research design is a plan for doing research.

It explains how the researcher will conduct the study and collect the required information.`,
  },
  {
    title: 'Preparing a research design',
    text: `While preparing a research design, the researcher should consider:

1. The means of obtaining information.
2. The availability and skills of the researcher.
3. How the selected methods will be organized.
4. The time available.
5. The cost of the research.

These factors help the researcher prepare a practical plan.`,
    simple: `Before starting research, we should decide:

1. How to collect information.
2. What skills are required.
3. How to organize the work.
4. How much time is available.
5. How much money is required.`,
  },
  {
    title: 'Understanding population and sampling',
    text: `All the items under consideration in a field of inquiry are called the population or universe.

A complete study of all items in a population is called a census inquiry.

A sample is a smaller group of items selected from the population for study.

A sample design is a definite plan for selecting a sample before collecting data.`,
    simple: `Population means the complete group we want to study.

A sample means selecting a smaller group from that population.

For example, if a college has 2,000 students and a researcher selects 100 students for a survey, those 100 students form the sample.`,
  },
  {
    title: 'Types of sampling',
    text: `There are two major types of sampling:

1. Probability sampling: Each element has a known chance of being selected. Examples include simple random, systematic, stratified and cluster sampling.

2. Non-probability sampling: The probability of selecting each element is not known. Examples include convenience, judgement and quota sampling.

The researcher selects a suitable sampling method depending on the nature of the study.`,
    simple: `There are two main sampling methods.

Probability sampling gives members a known chance of selection. Examples include random and systematic sampling.

Non-probability sampling does not use a known selection chance. Examples include convenience and judgement sampling.`,
  },
]

function Module4() {
  return (
    <ModuleLearning
      moduleNumber={4}
      title="Choose a Method"
      description="Understand research design, population and sampling methods."
      lessons={LESSONS}
    />
  )
}

export default Module4
