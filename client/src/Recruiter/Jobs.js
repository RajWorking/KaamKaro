import Job from './Job';

const Jobs = ({ jobs, erase, edit }) => {
  return (
    <div>
      {jobs.map((job) => (
        <Job job={job} erase={erase} edit={edit}/>
      ))}
    </div>
  );
};

export default Jobs;
