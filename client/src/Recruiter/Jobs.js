import Job from './Job';

const Jobs = ({ jobs, erase }) => {
  return (
    <div>
      {jobs.map((job) => (
        <Job job={job} erase={erase}/>
      ))}
    </div>
  );
};

export default Jobs;
