const MODULES = [
  'Find a topic',
  'Ask a question',
  'Literature review',
  'Choose a method',
  'Collect and analyze data',
  'Write and cite',
  'Present',
]

function Course() {
  return (
    <>
      <h1 tabIndex="-1">Course: Learn to do research</h1>
      <ol>
        {MODULES.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ol>
    </>
  )
}

export default Course